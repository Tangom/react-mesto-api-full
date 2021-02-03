const Card = require('../models/card');
const User = require('../models/user');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/fobiddenError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((data) => res.status(200).send(data))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы неверные данные');
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  const id = req.params.cardId;
  Card.findById(id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет прав для удаления карточки');
      } else {
        Card.findByIdAndDelete(id)
          // eslint-disable-next-line no-shadow
          .then((deleted) => {
            res.status(200).send(deleted);
          })
          .catch(next);
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      Card.findByIdAndUpdate(
        { _id: req.params.cardId },
        { $push: { likes: user.id } },
        { new: true },
      )
        .then((card) => {
          if (!card) {
            res.status(404).send({ message: 'Нет данных' });
          }
          res.status(200).send(card);
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            res.status(400).send({ message: 'Переданы неверные данные' });
          }
          return next(err);
        })
        .catch(next);
    });
};

const dislikeCard = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      Card.findByIdAndUpdate(
        { _id: req.params.cardId },
        { $pull: { likes: user._id } },
        { new: true },
      )
        .then((card) => {
          if (!card) {
            res.status(404).send({ message: 'Нет данных' });
          }
          res.status(200).send(card);
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            res.status(400).send({ message: 'Переданы неверные данные' });
          }
          return next(err);
        })
        .catch(next);
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
