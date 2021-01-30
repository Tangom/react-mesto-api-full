const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  /* убираем 'Bearer ' в токене */
  const YOUR_JWT = authorization.replace('Bearer ', '');
  let payload;

  try {
    /* метод verify проверяет, что токен верный и возвращает payload
    пользователя (_id) */
    payload = jwt.verify(YOUR_JWT, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  next(); // пропускаем запрос дальше
};
