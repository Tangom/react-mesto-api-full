
class Auth {
  constructor(options) {
    this._url = options.url;
  }

   register(email, password) {
    return fetch(`${this._url}/signup`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        email: email
      })
    })
      .then((res) => {
        try {
          if (res.ok) {
            return res.json();
          }
        } catch (e) {
          return e;
        }
      })
      .then((res) => res)
      .catch((err) => console.log(err));
   }

  authorize(email, password) {
    return fetch(`${this._url}/signin`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        email: email
      })
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else return Promise.reject(res.status);
      })
      .then((data) => {
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          return data;
        } else {
          return;
        }
      })
      .catch((err) => {
        if (err === 400) {
          throw new Error(`Не передано одно из полей.`);
        } else if (err === 401) {
          throw new Error(`Пользователь с email не найден.`);
        }
      });
  }

  checkToken(token) {
    return fetch(`${this._url}/users/me`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => data);
  }
}

const auth = new Auth({
  // url: "http://localhost:3000"
  url: "https://api.tangom.students.nomoredomains.icu",
})

export default auth;