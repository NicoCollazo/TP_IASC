/* Schema:
    username: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    passwordHash: {
        type: String,
        required: true,
        minlength: 6
    },
    date: {
        type: Date,
        default: Date.now
    }
*/
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

class UsersDb {
	constructor(users) {
		this._users = users || [];
	}

	findOne = (username) => {
		return this._users.find((u) => u.username === username);
	};

	findById = (user_id) => {
		return this._users.find((u) => u.id === user_id);
	};

	register = async (username, password) => {
		if (this.findOne(username) !== undefined) {
			throw Error("Username already exists");
		}

		const salt = await bcrypt.genSalt(10);
		const pHash = await bcrypt.hash(password, salt);

		const createdUser = { id: uuidv4(), username, passwordHash: pHash };
		this._users.push(createdUser);

		return createdUser;
	};

	validate = async (username, password) => {
		const user = this.findOne(username);

		return bcrypt.compare(password, user.passwordHash);
	};
}

const usersDb = new UsersDb();

module.exports = usersDb;
