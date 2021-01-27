import React from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import AddPlacePopup from './AddPlacePopup';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import api from '../utils/api';
import auth from '../utils/auth';
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import {Route, Switch, useHistory} from "react-router-dom";
import Register from './Register';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [error, setError] = React.useState(false);
   const [email, setEmail] = React.useState("");
  const history = useHistory();

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeStatus(card, isLiked).then((newCard) => {
      // Формируем новый массив на основе имеющегося, подставляя в него новую карточку
      const newCards = cards.map((c) => c._id === card._id ? newCard : c);
      // Обновляем стейт
      setCards(newCards);
    })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api.deleteCard(card)
      .then(() => {
        const newCards = cards.filter((i) => {
          return i._id !== card._id;
        });
        setCards(newCards);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  React.useEffect(() => {
    if (loggedIn) {
      setIsLoading(true);
      api.getAllData()
        .then(([profile, cards]) => {
          setCards(cards);
          setCurrentUser(profile)
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [loggedIn])

  function handleUpdateUser(data) {
    setIsLoading(true);
    api.patchProfileEditing(data)
      .then(
        (data) => {
          setCurrentUser(data);
          closeAllPopups();
        })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateAvatar(data) {
    setIsLoading(true);
    api.patchUserAvatar(data)
      .then(
        (data) => {
          setCurrentUser(data);
          closeAllPopups();
        })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleAddPlaceSubmit(data) {
    setIsLoading(true);
    api.postAddCard(data)
      .then(
        (newCard) => {
          setCards([newCard, ...cards]);
          closeAllPopups();
        })
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleRegistration(email, password) {
    auth
      .register(email, password)
      .then((res) => {
        if (res) {
          setError(false);
          history.push("/sign-in");
        } else {
          setError(true);
        }
      })
      .catch((err) => console.log(err));
    setIsInfoTooltipOpen(true);
  }

  function handleAuthorization(email, password) {
    auth
      .authorize(email, password)
      .then((res) => {
        if (res) {
          setEmail(email)
          setLoggedIn(true);
          history.push("/");
        }
      })
      .catch((err) => console.log(err));
  }

  function handleEditProfile() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlace() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatar() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleCard(card) {
    setIsImagePopupOpen(true);
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsImagePopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard({});
  }

  function handleSignOut() {
    setLoggedIn(false);
    localStorage.removeItem("jwt");
    history.push("/sign-in");
  }

  function handleCheckToken() {
    if (localStorage.getItem("jwt")) {
      const token = localStorage.getItem("jwt");
      auth
        .checkToken(token)
        .then((res) => {
          if (res) {
            setEmail(res.email);
            setLoggedIn(true);
            history.push("/");
          }
        })
        .catch((err) => console.log(err));
    }
  }

  React.useEffect(() => {
       handleCheckToken();
      }, [loggedIn])

   return (
    <CurrentUserContext.Provider value={currentUser}>
      {loggedIn && (
      <Header email={email} onClick={handleSignOut} menuText="Выйти"/>
      )}
      <Switch>
        <ProtectedRoute
          exact
          path="/"
          component={Main}
          onEditProfile={handleEditProfile}
          onAddPlace={handleAddPlace}
          onEditAvatar={handleEditAvatar}
          onCardClick={handleCard}
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
          isLoading={isLoading}
          loggedIn={loggedIn}
        />
        <Route path="/sign-in">
          <Login handleAuthorization={handleAuthorization} onCheckToken={handleCheckToken}/>
        </Route>
        <Route path="/sign-up">
          <Register handleRegistration={handleRegistration}/>
        </Route>
      </Switch>
      <Footer/>

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
      />

      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
      />

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
      />

      <PopupWithForm
        name="confirm"
        title="Вы уверены?"
        buttonName="Да"
      />

      <ImagePopup
        card={selectedCard}
        isOpen={isImagePopupOpen}
        onClose={closeAllPopups}
      />

      <InfoTooltip
        isOpen={isInfoTooltipOpen}
        onClose={closeAllPopups}
        error={error}
      />
    </CurrentUserContext.Provider>
  );
}

export default App;

