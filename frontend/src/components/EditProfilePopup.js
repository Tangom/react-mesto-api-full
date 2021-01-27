import React from 'react';
import PopupWithForm from './PopupWithForm';
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import {useFormValidation} from "../hooks/useFormValidation";

function EditProfilePopup(props) {
  const {values, errors, isValid, handleChange, resetForm} = useFormValidation();
  const currentUser = React.useContext(CurrentUserContext);

  React.useEffect(() => {
    if (currentUser) {
      resetForm(currentUser);
    }
  }, [currentUser, resetForm, props.isOpen]);

  function handleSubmit(evt) {
    evt.preventDefault();
    props.onUpdateUser(values);
  }

  return (
    <PopupWithForm
      name='profile'
      title='Редактировать профиль'
      buttonName='Сохранить'
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      isDisabled={!isValid}
    >
      <input className="popup__field popup__field_name" id='name-input' maxLength="40" minLength="2" name="name"
             placeholder="Имя" required type="text" value={values.name || ''} onChange={handleChange}/>
      <span className='popup__form-error' id='name-input-error'>{errors.name}</span>
      <input className="popup__field popup__field_career" id='career-input' maxLength="200" minLength="2"
             name="about"
             placeholder="О себе" required type="text" value={values.about || ''} onChange={handleChange}/>
      <span className='popup__form-error' id='career-input-error'>{errors.about}</span>
    </PopupWithForm>
  )
}

export default EditProfilePopup;