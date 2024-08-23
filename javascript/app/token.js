document.addEventListener('DOMContentLoaded', function () {
    verificarToken()
})

function verificarToken() {
    console.log('Verificando token...');
    const authToken = getCookie('authToken');

    const body = document.body;

    if (!authToken) {
        console.log('Token não encontrado. Redirecionando para a página de login.');
        body.classList.add('blurred'); 

        setTimeout(function() {
            window.location.href = '../app/login.html';
        }, 100);
    } else {
        console.log('Token encontrado. Bem-vindo!');
        body.classList.remove('blurred'); 
    }
}

function exibirMensagem(mensagem) {
    const overlay = document.getElementById('overlay');
    overlay.innerText = mensagem;
    overlay.style.display = 'flex'; 
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

console.log('Script principal carregado.');