
import { togglePage } from './modules/ui.js';
import { initAuth, register, login, logout } from './modules/authorization.js';
import { addRoom, deleteRoom, switchTab } from './modules/calculator.js';

window.togglePage = togglePage;
window.register = register;
window.login = login;
window.logout = logout;
window.addRoom = addRoom;
window.deleteRoom = deleteRoom;
window.switchTab = switchTab;

window.onload = initAuth;