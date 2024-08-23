async function registrarAluno() {
    try {
        const nome = document.getElementById('name').value;
        const datanasc = document.getElementById('birthdate').value;
        const genero = document.querySelector('input[name="sexo"]:checked').id;
        const escola = document.getElementById('escola').value;
        const serie = document.getElementById('anoSerie').value;
        const idprof = getCookie('userID');

        const response = await sendRegistrationRequest({
            nome,
            datanasc,
            genero,
            escola,
            serie,
            idprof,
        });

        console.log(response);

        if (response.status === 204) {
            console.log('Sem conteúdo retornado.');
            window.location.href = "../app/menu.html";
        } else if (response.ok) {
            console.log('Usuário registrado com sucesso:', await response.json());
            window.location.href = "../app/menu.html";
        } else {
            console.log("Erro ao registrar usuário");
            const errorMessage = await response.text();
            alert(errorMessage);
        }
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        alert('Erro ao registrar usuário. Por favor, tente novamente.');
    }
}

async function sendRegistrationRequest(userData) {
    return await fetch('https://fauna-api.onrender.com/aluno', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
}

function getCookie(nomeCookie) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name.trim() === nomeCookie) {
            return value;
        }
    }
    return null;
}

