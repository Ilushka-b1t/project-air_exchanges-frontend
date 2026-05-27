import { showScreen, togglePage } from './ui.js';
import { renderRooms } from './calculator.js'; 

export function initAuth() {
    let users = localStorage.getItem('current_users_auth');
    if (users) {
        showScreen('mainScreen');
        document.getElementById('userName').innerText = users;
        renderRooms(); 
    } else {
        showScreen('loginScreen');
    }
}

export function login() {
    const loginEmail = document.getElementById('loginInput').value.trim();
    const password = document.getElementById('loginPass').value;
    let usersStorage = JSON.parse(localStorage.getItem('current_users_reg')) || {};
    let userFound = false;
    let autoLogin = "";

    for (let key in usersStorage) {
        if ((key === loginEmail || usersStorage[key].email === loginEmail) && (usersStorage[key].pass === password)) {
            userFound = true;
            autoLogin = key;
            break;
        }
    }

    if (userFound) {
        localStorage.setItem('current_users_auth', autoLogin);
        initAuth();
    } else {
        alert('Неверный логин/email или пароль!');
    }
}

export function register() {
    const login = document.getElementById('regLogin').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value.trim();
    
    let usersStorage = JSON.parse(localStorage.getItem('current_users_reg')) || {};

    if (!login || !email || !pass) {
        alert('Пожалуйста, заполните все поля!');
        return;
    }

    let emailExists = false;
    for (let key in usersStorage) {
        if (usersStorage[key].email === email) {
            emailExists = true;
            break;
        }
    }
    
    if (usersStorage[login] || emailExists) {
        alert('Пользователь с таким логином или email уже существует!');
        return;
    }

    usersStorage[login] = { email: email, pass: pass };
    localStorage.setItem('current_users_reg', JSON.stringify(usersStorage));
    
    alert('Регистрация прошла успешно! Теперь вы можете войти.');
    togglePage('login'); 
}

export function logout() {
    localStorage.removeItem('current_users_auth');
    initAuth();
}