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
    .then((article) => res.send({
      data: {
        id: article.id,
        keyword: article.keyword,
        title: article.title,
        text: article.text,
        date: article.date,
        source: article.source,
        link: article.link,
        image: article.image,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  Article.findById(req.params.id).select('+owner')
    .then((article) => {
      if (!article) {
        throw new NotFoundError('Карточка с таким id не найдена');
      }
      if (article.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Авторизуйтесь для удаления');
      }
      return Article.findByIdAndRemove(req.params.id)
        .then(() => {
          res.send({ message: 'Статья успешно удалена' });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
