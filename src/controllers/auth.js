const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authenticate = async (req, res) => {
  // Validate the username exists.
  const user = await User.findOne({
    name: req.body.name,
  });
  if (!user) {
    return res.status(400).json({
      error: "Username or password are incorrect",
    });
  }

  // Validate password with bcrypt.
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).json({
      error: "Username or password are incorrect",
    });
  }

  // create token
  const token = jwt.sign(
    { name: user.name, id: user.id },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_TTL }
  );

  res.header("auth-token", token).json({
    data: { token },
  });
};

module.exports = authenticate;
