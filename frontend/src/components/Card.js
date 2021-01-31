import React from 'react';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

function Card(props) {

  const currentUser = React.useContext(CurrentUserContext);

  const isOwn = props.card.owner._id === currentUser._id;
  const isLiked = props.card.likes.some(i => i._id === currentUser._id);

  const cardDeleteButtonClassName = `element__deleted ${!isOwn ? 'element__deleted_disable' : ''}`;
  const cardLikeButtonClassName = `element__like ${isLiked ? 'element__like_active' : ''}`;

  function handleCardClick() {
    props.onCardClick(props.card);
  }

  function handleLikeClick() {
    props.onCardLike(props.card)
  }

  function handleCardDelete() {
    props.onCardDelete(props.card)
  }

  return (
    <div className="element">
      <button className={cardDeleteButtonClassName} onClick={handleCardDelete} type="button"></button>
      <img className="element__image" onClick={handleCardClick} src={props.card.link} alt={props.card.name}/>
      <div className="element__content">
        <h2 className="element__text">{props.card.name}</h2>
        <div className="element__content-like">
          <button className={cardLikeButtonClassName} onClick={handleLikeClick} type="button"></button>
          <p className="element__result">{props.card.likes.length}</p>
          </div>
      </div>
    </div>
  );
}

export default Card;
