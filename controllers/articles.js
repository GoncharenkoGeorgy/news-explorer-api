const Article = require('../models/article.js');

const BadRequestError = require('../errors/bad-req-err.js');
const ForbiddenError = require('../errors/forbidden-err.js');
const NotFoundError = require('../errors/not-found-err.js');

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
      // if (err.statusCode === 400) {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  // const { id } = req.params;
  // const { _id } = req.user;
  Article.findById(req.params.id).select('+owner')
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Авторизуйтесь для удаления');
      }
      return Article.findByIdAndRemove(req.params.id)
        .then(() => {
          res.send({ message: 'Статья успешно удалена' });
        })
        .catch((err) => {
          if (err.name === 'CastError' || err.name === 'DocumentNotFoundError') {
            throw new NotFoundError('Карточка с таким id не найдена');
          }
        });
    })
    .catch(next);
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
