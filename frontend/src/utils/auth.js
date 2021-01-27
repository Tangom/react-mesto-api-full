class Auth {
  constructor(options) {
    this._url = options.url;
  }

  _handleOriginalResponse(res) {
    if (!res.ok) {
      return Promise.reject(`Error: ${res.status}`);
    }
    return res.json();
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
    }).then(this._handleOriginalResponse)
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
    }).then(this._handleOriginalResponse);
  }

  checkToken(token) {
    return fetch(`${this._url}/users/me`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }).then(this._handleOriginalResponse)
  }
}

const auth = new Auth({
  url: "http://localhost:3000"
  // url: "https://api.tangom.students.nomoredomains.icu"
})

export default auth;