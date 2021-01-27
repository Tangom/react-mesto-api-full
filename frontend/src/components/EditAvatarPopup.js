import React from 'react';
import PopupWithForm from './PopupWithForm';
import {useFormValidation} from "../hooks/useFormValidation";

function EditAvatarPopup(props) {

  const {values, isValid, handleChange, resetForm} = useFormValidation();

  function handleSubmit(evt) {
    evt.preventDefault();
    props.onUpdateAvatar(values);
  }

  React.useEffect(() => {
    resetForm();
  }, [props.isOpen, resetForm])


  return (
    <PopupWithForm
      name='avatar'
      title='Обновить аватар'
      buttonName='Сохранить'
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      isDisabled={!isValid}
    >
      <input className="popup__field popup__field_link" id='link-avatar-input' name="avatar"
             placeholder="Ссылка на картинку"
             required type="url" value={values.avatar || ''} onChange={handleChange}/>
      <span className='popup__form-error' id='link-avatar-input-error'></span>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;