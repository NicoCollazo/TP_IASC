const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const { Server } = require("socket.io");
const logger = require("./utils/logger")(__filename);
dotenv.config();

const app = express(cors("*"));

const port = process.env.PORT || "8090";
const attemptTimeouts = process.env.SOCKET_ATTEMPT_TIMEOUTS || 3000;

const server = http.createServer(app);
const io = new Server(server, {
	cors: { origin: "*", credentials: true },
});
server.listen(port);

/* Intialize In-Memory DBs */
const activeServers = []; // Active server names and their sockets.
const { WorkspaceManager, TaskManager, UsersDb } = require("./models");
const test_workspaces = [
	{
		id: "123123123",
		name: "test",
		owner: "Jorge",
		shared: ["Ramiro"],
	},
	{
		id: "123123124",
		name: "test2",
		owner: "Ramiro",
		shared: [],
	},
];

const test_tasks = [
	{
		board: "Doing",
		workspaceName: "test2",
		owner: "Ramiro",
		id: "e0244293-468c-469a-b552-c54cfc851b3d",
		title: "Hola, soy una tarea",
		content: "",
		editing: false,
	},
];

const usersDb = new UsersDb();
usersDb.register("Ramiro", "password");
const tasksManagerInstance = new TaskManager(test_tasks);
const workspaceManagerInstance = new WorkspaceManager(test_workspaces);
/* ----------------------- */

setInterval(() => {
	logger.info(
		`Active Servers: ${JSON.stringify(activeServers.map((s) => s.name))}`
	);
}, 6000);

const responsesAreTrue = (responses) => {
	logger.info(`Response from servers: ${responses}`);
	return (
		responses &&
		responses.length === activeServers.length &&
		responses.every((r) => r)
	);
};

io.on("connection", (socket) => {
	socket.on("activeServer", (serverName, ack) => {
		logger.info(`Server ${serverName} has connected`);
		if (!activeServers.some((s) => s.name === serverName)) {
			activeServers.push({ name: serverName, socket });

			// Publish state to newly connected server.
			ack(
				workspaceManagerInstance.getAll(),
				tasksManagerInstance.getAll(),
				usersDb.getAll()
			);
		}
	});

	socket.on("attemptToAddUser", (data, ack) => {
		io.timeout(attemptTimeouts).emit(
			"checkAddUser",
			data.username,
			(err, responses) => {
				if (err || !responsesAreTrue(responses)) {
					logger.error({
						message: "Attempt to add user failed",
						responses,
						err,
					});
					return;
				}

				usersDb
					.register(data.username, data.password)
					.then((_) => {
						socket.broadcast.emit("commitAddUser", data);
						ack(data);
					})
					.catch((err) => logger.error(err));
			}
		);
	});

	socket.on("attemptToAddWorkspace", (data, ack) => {
		io.timeout(attemptTimeouts).emit(
			"checkAddWorkspace",
			data,
			(err, responses) => {
				if (err || !responsesAreTrue(responses)) {
					logger.error({
						message: "Attempt to add workspaces failed",
						responses,
						err,
					});
					io.emit("cancelAttemptToAddWorkspace", data);
					return;
				}

				workspaceManagerInstance
					.add(data.username, data.workspace)
					.then((w) => {
						socket.broadcast.emit("commitAddWorkspace", data);
						ack(w);
					})
					.catch((err) => logger.error(err));
			}
		);
	});

	socket.on("attemptToAddTask", (data, ack) => {
		io.timeout(attemptTimeouts).emit(
			"checkAddTask",
			data.task,
			(err, responses) => {
				if (err || !responsesAreTrue(responses)) {
					logger.error({
						message: "Attempt to add tasks failed",
						responses,
						err,
					});
					io.emit("cancelAttemptToAddTask", data);
					return;
				}

				tasksManagerInstance
					.add({ ...data.task, owner: data.workspace.owner })
					.then((task) => {
						socket.broadcast.emit("commitAddTask", {
							task,
							workspace: data.workspace,
						});
						ack(task);
					})
					.catch((err) => logger.error(err));
			}
		);
	});

	socket.on("attemptToEditTask", (data, ack) => {
		io.timeout(attemptTimeouts).emit(
			"checkEditTask",
			data.task,
			(err, responses) => {
				if (err || !responsesAreTrue(responses)) {
					logger.error({
						message: "Attempt to Edit tasks failed",
						responses,
						err,
					});
					io.emit("cancelAttemptToEditTask", data);
					return;
				}

				tasksManagerInstance
					.edit(data.task)
					.then((task) => {
						socket.broadcast.emit("commitEditTask", {
							task,
							workspace: data.workspace,
						});
						ack(task);
					})
					.catch((err) => logger.error(err));
			}
		);
	});

	socket.on("attemptToDeleteWorkspace", (data, ack) => {
		io.timeout(attemptTimeouts).emit(
			"checkDeleteWorkspace",
			data,
			(err, responses) => {
				if (err || !responsesAreTrue(responses)) {
					logger.error({
						message: "Attempt to Delete workspace failed",
						responses,
						err,
					});
					io.emit("cancelAttemptToDeleteWorkspace", data);
					return;
				}

				workspaceManagerInstance
					.delete(data.workspace)
					.then((w) => {
						socket.broadcast.emit("commitDeleteWorkspace", {
							username: data.username,
							workspace: w,
						});
						ack(w);
					})
					.catch((err) => logger.error(err));
			}
		);
	});
	socket.on("attemptToDeleteTask", (data, ack) => {
		io.timeout(attemptTimeouts).emit(
			"checkDeleteTask",
			data.task,
			(err, responses) => {
				if (err || !responsesAreTrue(responses)) {
					logger.error({
						message: "Attempt to Delete tasks failed",
						responses,
						err,
					});
					io.emit("cancelAttemptToDeleteTask", data.task);
					return;
				}

				tasksManagerInstance
					.delete(data.task)
					.then(() => {
						socket.broadcast.emit("commitDeleteTask", {
							task: data.task,
							workspace: data.workspace,
						});
						ack(data.task);
					})
					.catch((err) => logger.error(err));
			}
		);
	});

	socket.on("disconnect", () => {
		const serverIdx = activeServers.findIndex((s) => s.socket === socket);
		const deletedServers = activeServers.splice(serverIdx, 1);
		logger.info(`Server ${deletedServers[0].name} has disconnected`);
	});
});
