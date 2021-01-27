import React from 'react';

function ImagePopup(props) {
  return (
    <div className={`popup popup_photo ${props.isOpen && 'popup_opened'}`}>
      <div className="popup__container popup__container_photo">
        <button onClick={props.onClose} className="popup__close popup__close_image" type="button"></button>
        <img alt={`${props.card.name}`} src={`${props.card.link}`} className="popup__image"/>
        <h2 className="popup__text">{props.card.name}</h2>
      </div>
    </div>
  )
}

export default ImagePopup;
