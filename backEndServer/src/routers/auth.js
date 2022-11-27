const { authenticate } = require('../controllers')

const authRouter = (router) => {
    router.post('/auth', authenticate);

    return router
}

module.exports = authRouter;
