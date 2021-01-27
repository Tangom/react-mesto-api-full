import React from "react";
import { Link, useHistory } from "react-router-dom";
import Header from "./Header";
import { useFormValidation } from "../hooks/useFormValidation";

function Register({ handleRegistration}) {
  const history = useHistory();
  const {values, errors, handleChange} = useFormValidation();

  function handleSubmit(evt) {
    evt.preventDefault();
    handleRegistration(values.email, values.password);
  }

  return (
    <>
      <Header email="" onClick={() => {
          history.push("/sign-in");
        }}
        menuText="Войти"
      />
      <div className="popup__container popup__container_dark">
        <h2 className="popup__title popup__title_dark">Регистрация</h2>
        <form
          className="popup__form"
          name="registerForm"
          noValidate
          onSubmit={handleSubmit}
        >
          <input
            className="popup__field popup__field_dark popup__field_email"
            id="email"
            type="email"
            placeholder="Email"
            name="email"
            minLength="2"
            maxLength="40"
            required
            value={values.email || ''}
            onChange={handleChange}
          />
          <span
            className={`popup__form-error ${
              errors.email && "popup__form-error_visible"
            }`}
            id="email-error"
          >
            {errors.email || ''}
          </span>
          <input
            className="popup__field popup__field_dark popup__field_password"
            id="password"
            type="password"
            placeholder="Пароль"
            name="password"
            required
            value={values.password || ''}
            onChange={handleChange}
          />
          <span
            className={`popup__form-error ${
              errors.password && "popup__form-error_visible"
            }`}
            id="password-error"
          >
            {errors.password || ''}
          </span>
          <button
            type="submit"
            className="popup__save popup__save_dark"
          >
            Зарегистрироваться
          </button>
        </form>
        <Link to="/sign-in" className="popup__link">
          Уже зарегистрированы? Войти
        </Link>
      </div>
    </>
  );
}

export default Register;
