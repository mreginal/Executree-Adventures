async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://fauna-api.onrender.com/auth/prof', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
    
            setCookie('authToken', data.token);
    
            const decodedToken = decodeJwtToken(data.token);
    
            setCookie('userID', decodedToken.id);
    
            console.log("Login realizado com sucesso");
            console.log('id:', decodedToken.id);
    
            window.location.href = "../app/menu.html";
        } else {
            const errorMsg = await response.text();
            alert(errorMsg);
            console.log("Falha no login");
        }
    } catch (error) {
        console.error('Erro ao logar professor:', error);
        alert('Erro ao logar professor. Por favor, tente novamente.');
    }
}

function setCookie(name, value) {
    const encodedValue = encodeURIComponent(value);
    document.cookie = `${name}=${encodedValue}; path=/; secure; samesite=strict`;
}

function decodeJwtToken(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return null;
    }
}
