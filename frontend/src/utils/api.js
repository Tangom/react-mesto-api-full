 class Api {
  constructor(options) {
    this._url = options.url;
     }

   setHeaders() {
     return {
       authorization: `Bearer ${localStorage.getItem("jwt")}`,
       "Content-Type": "application/json",
     };
   }

  getUser() {
    return fetch(`${this._url}/users/me`, {
      method: 'GET',
      headers: this.setHeaders(),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        // если ошибка, отклоняем промис
        return Promise.reject(`Ошибка: ${res.status}`);
      })
  }

  getInitialCards() {
    return fetch(`${this._url}/cards`, {
      method: 'GET',
      headers: this.setHeaders(),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
      })
  }

  patchProfileEditing(data) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: this.setHeaders(),
      body: JSON.stringify({
        name: data.name,
        about: data.about
      })
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    })
  }

  patchUserAvatar(data) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this.setHeaders(),
      body: JSON.stringify({
        avatar: data.avatar
      })
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    })
  }

  postAddCard(item) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: this.setHeaders(),
      body: JSON.stringify({
        name: item.name,
        link: item.link
      })
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
      })
  }

  deleteCard(data) {
    return fetch(`${this._url}/cards/${data._id}`, {
      method: 'DELETE',
      headers: this.setHeaders(),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
      })
  }

   changeLikeStatus(data, like) {
     if (like) {
       return this.deleteLike(data);
     } else {
       return this.putLikeCard(data);
     }
   }

   deleteLike(data) {
    return fetch(`${this._url}/cards/likes/${data._id}`, {
      method: 'DELETE',
      headers: this.setHeaders(),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
      })
  }

  putLikeCard(data) {
    return fetch(`${this._url}/cards/likes/${data._id}`, {
      method: 'PUT',
      headers: this.setHeaders(),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
      })
  }

  getAllData() {
    return Promise.all([this.getUser(), this.getInitialCards()]);
  }
}

const api = new Api({
  // url: "http://localhost:3000"
  url: "https://api.tangom.students.nomoredomains.icu",
  });

export default api;
