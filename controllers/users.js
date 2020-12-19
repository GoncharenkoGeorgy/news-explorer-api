const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const BadRequestError = require('../errors/bad-req-err.js');
const ConflictError = require('../errors/conflict-err.js');
const NotFoundError = require('../errors/not-found-err.js');

const { JWT_SECRET, NODE_ENV } = process.env;

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  // const { id } = req.user._id;
  if (!name || !email || !password) {
    throw new BadRequestError('Переданы не все данные');
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.send({ data: { id: user._id, name: user.name, email: user.email } }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      } else if (err.name === 'MongoError') {
        throw new ConflictError('Пользователь с таким email уже зарегистрирован');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

const getLoginUser = (req, res, next) => {
  User.findById(req.user._id).orFail().then((user) => {
    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id');
    }
    return res.send(user);
  }).catch(next);
};

module.exports = {
  createUser, login, getLoginUser,
};
