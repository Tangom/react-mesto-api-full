const Card = require('../models/card');
const User = require('../models/user');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');

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
  Card.findByIdAndRemove(id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы неверные данные');
      }
      if (err.statusCode === 'Ошибка сервера') {
        return next(err);
      }
      return next(err);
    });
};

// const likeCard = (req, res, next) => {
//   const userId = req.user._id;
//   const id = req.params.cardId;
//   Card.findByIdAndUpdate(id, { $addToSet: { likes: userId } },
//     { new: true })
//     .then((card) => {
//       if (!card) {
//         res.status(404).send({ message: 'Нет данных' });
//       }
//       res.status(200).send(card);
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         res.status(400).send({ message: 'Переданы неверные данные' });
//       }
//       res.status(500).send({ message: 'Ошибка сервера' });
//     })
//     .catch(next);
// };

const likeCard = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      Card.findByIdAndUpdate(
        { _id: req.params },
        { $push: { likes: user } },
        { new: true },
      )
        .then((card) => {
          res.status(200).send(card);
        })
        .catch(next);
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      Card
        .findByIdAndUpdate(
          { _id: req.params },
          { $pull: { likes: user._id } },
          { new: true },
        )
        .then((card) => {
          res.status(200).send(card);
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
