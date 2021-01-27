function PopupWithForm(props) {

    return (
    <div className={`popup ${props.isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <button onClick={props.onClose} type="button" className={`popup__close popup__close_${props.name}`}></button>
        <h2 className="popup__title">{props.title}</h2>
        <form className={`popup__form popup__form_${props.name}`} name="popup__form" noValidate onSubmit={props.onSubmit}>
          <fieldset className="popup__form-set">
            {props.children}
            <button className="popup__save" type="submit">{props.buttonName}</button>
          </fieldset>
        </form>
      </div>
    </div>
  )
}

export default PopupWithForm;
