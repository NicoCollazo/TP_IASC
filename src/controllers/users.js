const bcrypt = require("bcrypt");

const { UserDb } = require("../models");
const getLogger = require("../utils/logger");
const logger = getLogger(__filename);

class UsersController {
  registerUser = async (req, res) => {
    try {
      let userExists;

      userExists = UserDb.findOne(req.body.name);
      if (userExists) {
        logger.error(`Username ${req.body.name} no disponible`);
        return res
          .status(400)
          .json({ message: `Username ${req.body.name} no disponible` });
      }

      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.password, salt);

      // Create a user from mongoose model.
      const user = await UserDb.register(req.body.name, password);

      return res.status(201).json({
        message: "User created successfully.",
        userId: user.id,
      });
    } catch (err) {
      logger.error(err);
      return res
        .status(400)
        .json({ message: `${err}` })
        .end();
    }
  };
}

module.exports = UsersController;
