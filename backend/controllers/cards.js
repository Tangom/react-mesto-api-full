const Card = require('../models/card');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');

const getCards = (req, res) => {
  Card.find({})
    .then((data) => res.status(200).send(data))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы неверные данные'));
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  const id = req.params.cardId;
  Card.findByIdAndRemove(id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы неверные данные'));
      }
      if (err.statusCode === 'Ошибка сервера') {
        return next(err);
      }
      return next(err);
    });
};

const likeCard = (req, res, next) => {
  const userId = req.user._id;
  const id = req.params.cardId;
  Card.findByIdAndUpdate(id, { $addToSet: { likes: userId } },
    { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет данных');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы неверные данные'));
      }
      if (res.status(500).send({ message: 'Ошибка сервера' })) {
        return next(err);
      }
      return next(err);
    });
};

const dislikeCard = (req, res, next) => {
  const userId = req.user._id;
  const id = req.params.cardId;
  Card.findByIdAndUpdate(id, { $pull: { likes: userId } },
    { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет данных');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы неверные данные'));
      }
      if (res.status(500).send({ message: 'Ошибка сервера' })) {
        return next(err);
      }
      return next(err);
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
