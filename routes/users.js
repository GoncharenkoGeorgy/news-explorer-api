const router = require('express').Router();
const {
  getLoginUser,
} = require('../controllers/users.js');

router.get('/users/me', getLoginUser);

module.exports = router;
