const Article = require('../models/article.js');

const { BadRequestError } = require('../errors/bad-req-err.js');
const { ForbiddenError } = require('../errors/forbidden-err.js');
const { NotFoundError } = require('../errors/not-found-err.js');

const getArticles = (req, res, next) => {
  Article.find({})
    .then((data) => {
      if (data.length === 0) {
        throw new NotFoundError('Статьи не найдены');
      }
      return res.send(data);
    })
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const { _id } = req.user;
  Article.create({
    keyword, title, text, date, source, link, image, owner: _id,
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.user;
  Article.findById(id).select('+owner')
    .then((data) => {
      if (data.owner.toString() !== _id) {
        throw new ForbiddenError('Авторизуйтесь для удаления');
      }
      return Article.findByIdAndDelete(id)
        .then((card) => {
          if (!card) {
            throw new NotFoundError('Неправильный запрос');
          }
          return res.send({ message: 'Статья успешно удалена' });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch(() => {
      throw new NotFoundError('Неправильный запрос статьи для ее удаления');
    });
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
