const logger = require("../utils/logger")(__filename);

class BaseController {
	// Handles emits with timeout in a promise.
	// !Important: Dont forget to bind the emitFunc before passing it.
	_promiseEmitWithTimeout = (emitFunc, endpoint, data) => {
		return new Promise((res, rej) => {
			setTimeout(() => {
				const err = "Unable to access stateManager";
				logger.error(err);
				rej("Internal Server Error");
			}, 6000);
			emitFunc(endpoint, data, (d) => {
				logger.debug(`Received ${JSON.stringify(d)} from the stateManager`);
				if (d.error !== undefined) {
					rej(d.error);
				}
				res(d);
			});
		});
	};
}

module.exports = BaseController;
