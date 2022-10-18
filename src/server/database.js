const mongoose = require("mongoose");
const getLogger = require("../utils/logger");
const logger = getLogger(__filename);

const startDatabase = () => {
  // Connect Database.
  const uri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_SERVICE_URL}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;

  mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger.info("Database connected successfully"))
    .catch((err) =>
      logger.info({
        dbUrl: uri,
        message: "Database failed to connect",
        trace: err,
      })
    );
};

module.exports = startDatabase;
