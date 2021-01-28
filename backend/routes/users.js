const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getCurrentUsersId, getUsersId, createUser, updateProfile, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUsersId);
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().required().length(24),
  }),
}), getUsersId);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(3).max(30).required(),
    about: Joi.string().min(3).max(30).required(),
  }).unknown(true),
}), updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string()
      .pattern(new RegExp('^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w\\W.-]*)#?$'))
      .required(),
  }),
}), updateAvatar);
router.post('/users',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string()
        .pattern(new RegExp('^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w\\W.-]*)#?$')),
    }),
  }), createUser);

module.exports = router;