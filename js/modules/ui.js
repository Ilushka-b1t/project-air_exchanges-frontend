export function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    const currentScreen = document.getElementById(screenId);
    if (currentScreen) {
        currentScreen.classList.remove('hidden');
    }
}

export function togglePage(page) {
    if (page === 'register') {
        showScreen('registerScreen');
    } else if (page === 'login') {
        showScreen('loginScreen');   
    } else {
        showScreen('mainScreen');
    }
}