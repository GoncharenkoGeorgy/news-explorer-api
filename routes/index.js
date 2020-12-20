const router = require('express').Router();

const articlesRouter = require('./articles.js');
const usersRouter = require('./users.js');
const errorRouter = require('./error.js');

router.use('/', articlesRouter);
router.use('/', usersRouter);
router.use('/', errorRouter);

module.exports = router;
