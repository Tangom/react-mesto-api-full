require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
const BadRequestError = require('./errors/badRequestError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const pageNotFound = require('./routes/pageNotFound');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(requestLogger);
app.use(cors());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp('^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w\\W.-]*)#?$')),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use('/', auth, usersRouter);
app.use('/', auth, cardsRouter);
app.use('/', pageNotFound);

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (err.kind === 'ObjectId') {
    throw new BadRequestError('Неверно переданы данные');
  } else {
    res.status(statusCode).send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
