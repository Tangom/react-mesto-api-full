const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    link: Joi.string().pattern(new RegExp('^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w\\W.-]*)#?$')),
    name: Joi.string().min(2).max(30),
  }),
}), createCard);

router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().required().length(24),
  }),
}), deleteCard);

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().required().length(24)
      .hex(),
  }),
}), likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().required().length(24)
      .hex(),
  }),
}), dislikeCard);

module.exports = router;
