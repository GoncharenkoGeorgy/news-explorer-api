const router = require('express').Router();
const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');
const {
  getArticles, createArticle, deleteArticle,
} = require('../controllers/articles.js');
const auth = require('../middlewares/auth.js');

router.delete('/articles/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).hex(),
  }),
}), deleteArticle);

router.get('/articles', auth, getArticles);

const urlValidation = (value) => {
  if (!validator.isURL(value)) {
    throw new CelebrateError('Некорректный URL');
  }
  return value;
};

router.post('/articles', auth, celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom(urlValidation),
    image: Joi.string().required().custom(urlValidation),
  }),
}), createArticle);

module.exports = router;
