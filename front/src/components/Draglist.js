import {
	Container,
	Typography,
	AppBar,
	Toolbar,
	Box,
	Chip,
	TextField,
	SwipeableDrawer,
	Divider,
	Button
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";
import { useState, useEffect, useContext } from "react";
import { FaList, IoMdConstruct, MdOutlineDoneOutline, IoMdArrowRoundBack } from "react-icons/all";
import { SocketContext } from "../context/socket";
import DraggableElement from "./DraggableElement";

const DragDropContextContainer = styled.div`
	padding: 20px;
	border-radius: 6px;
`;

const ListGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-gap: 8px;
`;

// fake data generator
const getItems = (count, list) =>
	Array.from({ length: count }, (v, k) => k).map((k) => {
		const randomId = uuidv4();
		return {
			id: `item-${randomId}`,
			list,
			content: `item ${randomId}`,
		};
	});

const removeFromList = (list, index) => {
	const result = Array.from(list);
	const [removed] = result.splice(index, 1);
	return [removed, result];
};

const addToList = (list, index, element) => {
	const result = Array.from(list);
	result.splice(index, 0, element);
	return result;
};

const lists = [
	{
		name: "To Do",
		color: "#fee2dc",
		icon: <FaList color="action" />,
	},
	{
		name: "Doing",
		color: "#fcecc9",
		icon: <IoMdConstruct color="primary" />,
	},
	{
		name: "Done",
		color: "#daedda",
		icon: <MdOutlineDoneOutline color="primary" />,
	},
];

const generateLists = () =>
	lists.reduce(
		(acc, listKey) => ({ ...acc, [listKey.name]: getItems(0, listKey.name) }),
		{}
	);

function DragList({ workspaceName }) {
	const [elements, setElements] = useState(generateLists());
	const [drawer, setDrawer] = useState({
		open: false,
		title: "",
		content: "",
	});
	const socket = useContext(SocketContext);

	const handleSocketEdit = (editedTask) => {
		setElements((prevTasks) => {
			const newTasks = Object.assign({}, prevTasks);
			const editedTaskIdx = newTasks[editedTask.board].findIndex(
				(t) => t.id === editedTask.id
			);
			newTasks[editedTask.board][editedTaskIdx] = editedTask;
			return newTasks;
		});
	};

	const handleSocketAdd = (newTask) => {
		setElements((prevTasks) => {
			if (isTheKeyDuplicated(prevTasks, newTask)) {
				return prevTasks;
			}
			const newTasks = Object.assign({}, prevTasks);
			newTasks[newTask.board].push(newTask);
			return newTasks;
		});
	};

	function handleAdd(list) {
		const randomId = uuidv4();
		const date = new Date().toLocaleString();
		const newTask = {
			id: `item-${randomId}`,
			createdAt: date,
			board: list,
			title: ``,
			content: ``,
			editing: true,
			workspaceName,
		};
		socket.emit("addTask", newTask, (t) => {
			if (t.message === undefined) {
				handleSocketAdd(t);
			} else {
				// TODO: Display error message.
			}
		});
	}

	function handleChangeItemTitle(e, item) {
		const elementsCopy = { ...elements };
		let elementIndex = elementsCopy[item.board].findIndex(
			(i) => i.id === item.id
		);
		elementsCopy[item.board][elementIndex].title = e.target.value;
		socket.emit("editTask", elementsCopy[item.board][elementIndex], (t) => {
			if (t.message === undefined) {
				handleSocketEdit(t);
			} else {
				// TODO: Display error message.
			}
		});
	}

	function handleChangeItemContent(e, item) {
		const elementsCopy = { ...elements };
		let elementIndex = elementsCopy[item.board].findIndex(
			(i) => i.id === item.id
		);
		elementsCopy[item.board][elementIndex].content = e.target.value;
		setElements(elementsCopy);
	}

	function handleEdit(item, editing) {
		const elementsCopy = { ...elements };
		let elementIndex = elementsCopy[item.board].findIndex(
			(i) => i.id === item.id
		);
		if (elementsCopy[item.board][elementIndex].title !== "") {
			elementsCopy[item.board][elementIndex].editing = editing;
			socket.emit("editTask", elementsCopy[item.board][elementIndex], (t) => {
				if (t.message === undefined) {
					handleSocketAdd(t);
				} else {
					// TODO: Display error message.
				}
			});
		} else {
			// TODO: Handle Delete.
			// handleDelete(item);
		}
	}

	function handleDelete(item) {
		const elementsCopy = { ...elements };
		let elementIndex = elementsCopy[item.board].findIndex(
			(i) => i.id === item.id
		);
		elementsCopy[item.board].splice(elementIndex, 1);
		setElements(elementsCopy);
	}

	const onDragEnd = (result) => {
		if (!result.destination) {
			return;
		}
		const listCopy = { ...elements };
		const sourceList = listCopy[result.source.droppableId];
		const [removedElement, newSourceList] = removeFromList(
			sourceList,
			result.source.index
		);

		listCopy[result.source.droppableId] = newSourceList;
		const destinationList = listCopy[result.destination.droppableId];
		removedElement["board"] = result.destination.droppableId;

		listCopy[result.destination.droppableId] = addToList(
			destinationList,
			result.destination.index,
			removedElement
		);

		setElements(listCopy);
	};

	const toggleOk = (open, item) => {
		setDrawer({
			open: open,
			item: item,
			createdAt: item.createdAt,
			title: item.title,
			content: item.content,
		});
	};

	const toggleDrawer = (open, item) => (event) => {
		if (
			event &&
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}
		console.log(item);
		console.log("ok");
		setDrawer({ open: open, title: "", content: "" });
	};

	function handleChangeDrawerItemTitle(e, item) {
		const drawerCopy = { ...drawer };
		drawerCopy.title = e.target.value;
		setDrawer(drawerCopy);
		handleChangeItemTitle(e, item);
	}

	function handleChangeDrawerItemContent(e, item) {
		const drawerCopy = { ...drawer };
		drawerCopy.content = e.target.value;
		setDrawer(drawerCopy);
		handleChangeItemContent(e, item);
	}

	const handleKeyPress = (e, item) => {
		//13 -> Enter
		if (e.keyCode == 13) {
			toggleOk(false, item);
		}
	};

	const isTheKeyDuplicated = (tasks, task) => {
		return (
			tasks["To Do"].some((thisTask) => thisTask.id === task.id) ||
			tasks["Doing"].some((thisTask) => thisTask.id === task.id) ||
			tasks["Done"].some((thisTask) => thisTask.id === task.id)
		);
	};

	useEffect(() => {
		socket.on("newTask", handleSocketAdd);
		socket.on("taskEdited", handleSocketEdit);
		return () => {
			socket.off("newTask", handleSocketAdd);
			socket.off("taskEdited", handleSocketEdit);
		};
	});

	useEffect(() => {
		socket.on("allTasks", (tasks) => {
			const baseList = generateLists();
			for (const task of tasks) {
				console.log(JSON.stringify(task));
				baseList[task.board].push(task);
			}
			setElements(baseList);
		});
		socket.emit("openWorkspace", workspaceName);
	}, []);

	// Used for debugging
	useEffect(() => {
		console.log("The tasks have changed: " + JSON.stringify(elements));
	}, [elements]);

	const renderDrawerContent = (item) => (
		<Box sx={{ width: 600, marginLeft: 6 }} role="presentation">
			<TextField
				hiddenLabel
				id="item-title-drawer-input"
				value={drawer.title}
				onChange={(e) => handleChangeDrawerItemTitle(e, drawer.item)}
				onKeyDown={(e) => handleKeyPress(e, drawer.item)}
				size="medium"
				fullWidth
				autoFocus
				variant="standard"
				InputProps={{
					disableUnderline: true,
					style: { fontWeight: "bold", fontSize: 40 },
				}}
				sx={{ paddingTop: "7.5px", paddingBottom: "3.5px" }}
			/>
			<Chip
				size="small"
				label={"Created at: " + drawer.createdAt}
				sx={{
					mb: 1,
					borderRadius: 1,
				}}
			/>
			<Divider />
			<TextField
				hiddenLabel
				id="item-content-drawer-input"
				value={drawer.content}
				onChange={(e) => handleChangeDrawerItemContent(e, drawer.item)}
				onKeyDown={(e) => handleKeyPress(e, drawer.item)}
				size="medium"
				fullWidth
				variant="standard"
				multiline
				rows={25}
				InputProps={{
					disableUnderline: true,
				}}
				sx={{ paddingTop: "7.5px", paddingBottom: "3.5px" }}
			/>
		</Box>
	);

	return (
		<Container maxWidth="lg">
			<AppBar position="fixed" sx={{ backgroundColor: "#478ea1" }}>
				<Toolbar sx={{ justifyContent: "space-between" }}>
					<Box firstChild={true} float="left">
						<Button 
							component={Link}
							to="/workspace"
							variant="contained"
							startIcon={<IoMdArrowRoundBack />}
							sx={{
								backgroundColor: "#5bb9c1",
								"&:hover": {
									backgroundColor: "#2b9fa9",
								},
							}}
						>
							Back
						</Button>
                	</Box>

					<Box style={{ 
						float       : 'none', 
						width       : '200px',
						marginLeft  : 'auto',
						marginRight : 'auto'
					}}>
						<Typography variant="h4">{workspaceName.toUpperCase()}</Typography>
					</Box>

				</Toolbar>
			</AppBar>
			<Box sx={{ marginTop: 10 }}>
				<DragDropContextContainer sx={{ marginTop: 100 }}>
					<DragDropContext onDragEnd={onDragEnd}>
						<ListGrid>
							{lists.map((listKey) => (
								<DraggableElement
									elements={elements[listKey.name]}
									key={listKey.name}
									prefix={listKey}
									handleAdd={handleAdd}
									handleChangeItemTitle={handleChangeItemTitle}
									handleEdit={handleEdit}
									handleDelete={handleDelete}
									toggleDrawer={toggleOk}
								/>
							))}
						</ListGrid>
					</DragDropContext>
				</DragDropContextContainer>
				<SwipeableDrawer
					anchor="right"
					open={drawer.open}
					onClose={toggleDrawer(false)}
					onOpen={toggleDrawer(true)}
					BackdropProps={{ invisible: true }}
				>
					{renderDrawerContent()}
				</SwipeableDrawer>
			</Box>
		</Container>
	);
}

export default DragList;
