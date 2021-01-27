import React from "react";
import success from "../images/success.svg";
import fail from "../images/fail.svg";

export default function InfoTooltip(props) {
  return (
    <div className={`popup ${props.isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container">
        <button onClick={props.onClose} type="button" className="popup__close"
        ></button>
        <img className="popup__icon" alt="icon" src={`${props.error ? fail : success}`} />
        <h2 className="popup__title">{props.error ?
            'Что-то пошло не так! Попробуйте ещё раз.': 'Вы успешно зарегистрировались!'
        }
        </h2>
      </div>
    </div>
  );
}
