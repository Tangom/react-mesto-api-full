require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const pageNotFound = require('./routes/pageNotFound');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');

const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(requestLogger);
app.use(cors());
app.use(errors());
app.use(errorLogger);

app.use('/', auth, usersRouter);
app.use('/', auth, cardsRouter);
app.use('*', pageNotFound);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), createUser);

app.use((err, req, res) => {
  const { statusCode = 500, message } = err;
  if (err.kind === 'ObjectId') {
    res
      .status(400)
      .send({
        message: 'Неверно переданы данные',
      });
  } else {
    res
      .status(statusCode)
      .send({
        message: statusCode === 500
          ? 'На сервере произошла ошибка'
          : message,
      });
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});