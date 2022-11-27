class BaseController {
	// Handles emits with timeout in a promise.
	// !Important: Dont forget to bind the emitFunc before passing it.
	_promiseEmitWithTimeout = (emitFunc, endpoint, data) => {
		return new Promise((res, rej) => {
			setTimeout(() => rej("Unable to acces stateManager"), 6000);
			emitFunc(endpoint, data, (d) => res(d));
		});
	};
}

module.exports = BaseController;
