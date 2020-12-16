const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getLoginUser, login, createUser,
} = require('../controllers/users.js');
const auth = require('../middlewares/auth.js');

router.get('/users/me', auth, getLoginUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

module.exports = router;
