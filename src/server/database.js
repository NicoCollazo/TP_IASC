const mongoose = require("mongoose");
const getLogger = require("../utils/logger");
const logger = getLogger(__filename);

const CONNECTION_RETRY = 3;
let retry = 0;

const startDatabase = () => {
  const uri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_SERVICE_URL}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority&authSource=admin`;

  mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger.info("Database connected successfully"))
    .catch((err) => {
      if (retry <= CONNECTION_RETRY) {
        retry++;
        logger.info({
          dbUrl: uri,
          message: `Database failed to connect, retry count:${retry}`,
          trace: err,
        });
        setTimeout(startDatabase, 1000);
      } else {
        logger.info({
          dbUrl: uri,
          message: `Retry count exceeded.`,
          trace: err,
        });
      }
    });
};

const checkDatabaseConnection = () => {
  if ([0, 3].includes(Number(mongoose.connection.readyState))) {
    logger.info({ message: "Database disconnected, trying to reconnect..." });
    startDatabase();
    retry = 0;
  }
};

module.exports = { startDatabase, checkDatabaseConnection };
