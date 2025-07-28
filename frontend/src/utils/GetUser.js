// src/utils/GetUser.js
export function getUserDetails() {
  try {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    return user;
  } catch (err) {
    return null;
  }
}
