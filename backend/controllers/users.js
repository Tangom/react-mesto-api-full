const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const NoAuthorizationError = require('../errors/noAuthorizationError');

const { JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;
  console.log(typeof JWT_SECRET);

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      // ошибка аутентификации
      throw new NoAuthorizationError(err.message);
    })
    .catch(next);
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

const getUsersId = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.status(200).send(user);
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

const getCurrentUsersId = (req, res, next) => {
  const id = req.user._id;

  return User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы неверные данные'));
      }
      return next(err);
    });
};

const updateProfile = (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(id, { name, about }, { new: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы неверные данные'));
      }
      if (res.status(500).send({ message: 'Ошибка сервера' })) {
        return next(err);
      }
      return next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(id, { avatar }, { new: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы неверные данные'));
      }
      if (res.status(500).send({ message: 'Ошибка сервера' })) {
        return next(err);
      }
      return next(err);
    });
};

module.exports = {
  login, getUsers, getUsersId, getCurrentUsersId, createUser, updateProfile, updateAvatar,
};
