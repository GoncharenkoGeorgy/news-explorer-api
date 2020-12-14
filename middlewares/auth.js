const jwt = require('jsonwebtoken');
const CrashAuthorizError = require('../errors/crash-authoriz-err.js');

const { JWT_SECRET, NODE_ENV } = process.env;

// eslint-disable-next-line no-unused-vars
const handleAuthError = (res) => { throw new CrashAuthorizError('Необходима авторизация'); };

function extractBearerToken(header) {
  return header.replace('Bearer ', '');
}

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
