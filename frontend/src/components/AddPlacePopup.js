import React from 'react';
import PopupWithForm from './PopupWithForm';
import {useFormValidation} from "../hooks/useFormValidation";

function AddPlacePopup(props) {
  const {values, errors, isValid, handleChange, resetForm,} = useFormValidation();

  React.useEffect(() => {
    resetForm();
  }, [props.isOpen, resetForm]);

  function handleSubmit(evt) {
    evt.preventDefault();
    props.onAddPlace(values);
  }

  return (
    <PopupWithForm
      name='card'
      title='Новое место'
      buttonName='Создать'
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      isDisabled={!isValid}
    >
      <input className="popup__field popup__field_place" id='place-input' maxLength="30" minLength="1"
             name="name"
             placeholder="Название" required type="text" onChange={handleChange} value={values.name || ""}/>
      <span className='popup__form-error' id='place-input-error'>{errors.name}</span>
      <input className="popup__field popup__field_link" id='link-input' name="link"
             placeholder="Ссылка на картинку"
             required type="url" onChange={handleChange} value={values.link || ""}/>
      <span className='popup__form-error' id='link-input-error'>{errors.link}</span>
    </PopupWithForm>
  )
}

export default AddPlacePopup;
