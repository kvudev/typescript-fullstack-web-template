const express = require('express');
const createContentRouter = require('./content/src');

function createApiRouter(dependencies) {
  const router = express.Router();

  router.use('/content', createContentRouter(dependencies));

  return router;
}

module.exports = createApiRouter;
