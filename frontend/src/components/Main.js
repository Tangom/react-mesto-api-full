import React from 'react';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main(props) {

  const currentUser = React.useContext(CurrentUserContext);

    return (
    <main className="content">
      <section className="profile">
        <button className="profile__avatar-image" onClick={props.onEditAvatar} type="button">
          <img alt="Портрет" className="profile__avatar" src={currentUser.avatar}/>
        </button>
        <div className="profile__input">
          <div className="profile__text">
            <h1 className="profile__name-field">{currentUser.name}</h1>
            <p className="profile__career-field">{currentUser.about}</p>
          </div>
          <button className="profile__edit" onClick={props.onEditProfile} type="button">
          </button>
        </div>
        <button className="profile__add-image" onClick={props.onAddPlace} type="button">
        </button>
      </section>

      <section className="elements">
        {props.cards.map(card =>(
          <Card
            key={card._id}
            card={card}
            onCardClick={props.onCardClick}
            onCardLike={props.onCardLike}
            onCardDelete={props.onCardDelete}
          />
          )
        )}
      </section>
    </main>
  )
}

export default Main;
