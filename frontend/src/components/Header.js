import React from 'react';
import logo from "../images/header.svg"

function Header({ email, onClick, menuText }) {
  const [isOpened, setIsOpened] = React.useState(false);

  function toggleMenu() {
    setIsOpened(!isOpened);
  }

  return (
    <>
      {isOpened && (
        <nav className={isOpened ? 'header__menu-mobile' : 'header__menu'}>
          <p className={`header__menu-email ${isOpened && "header__menu-email_mobile"}`}>
            {email}
          </p>
          <button onClick={onClick} className="header__menu-email header__menu-email_button">
            {menuText}
          </button>
        </nav>
      )}
  <header className="header">
      <img alt="Логотип заголовка" className="header__logo" src={logo}/>
      <div className={isOpened ?'header__menu-line header__menu-line_opened' : 'header__menu-line'} onClick={toggleMenu}></div>
      {!isOpened && (
        <nav className={isOpened ? 'header__menu__mobile' : 'header__menu'}>
          <p className={`header__menu-email ${isOpened && "header__menu-email_mobile"}`}>
            {email}
          </p>
          <button onClick={onClick} className="header__menu-email header__menu-email_button">
            {menuText}
          </button>
        </nav>
      )}
    </header>
    </>
  )
  }

export default Header;
