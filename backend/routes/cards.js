const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    link: Joi.string().pattern(new RegExp('https?:\\/\\/w{0,3}[a-z0-9-._~:/?#[\\]@!$&\'()*+,;=]{0,}')),
    name: Joi.string().min(2).max(30),
  }),
}), createCard);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().required().length(24),
  }),
}), deleteCard);

router.put('/:cardId/likes', likeCard);

router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
