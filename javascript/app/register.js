async function registerUser() {
    console.log('registerUser() called');

    // Obter valores dos campos
    const nome = document.getElementById('name').value;
    const datanasc = document.getElementById('birthdate').value;
    const genero = document.querySelector('input[name="sexo"]:checked').id;
    const estado = document.getElementById('address').value;
    const instituicao = document.getElementById('instituicao').value;
    const ocupacao = document.getElementById('ocupacao').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmpassword = document.getElementById('confirmpassword').value;

    try {
        console.log("chegou aqui");

        // Realizar a requisição
        const response = await sendRegistrationRequest({
            nome,
            datanasc,
            genero,
            estado,
            instituicao,
            ocupacao,
            email,
            password,
            confirmpassword,
        });

        console.log("chegou aqui 2");

        if (response.ok) {
            console.log('Professor registrado com sucesso:', await response.json());
        } else {
            console.log("Usuário erro");
            // Exibir mensagem de erro do servidor em vez de alerta
            const errorMessage = await response.text();
            alert(errorMessage);
        }
    } catch (error) {
        console.error('Erro ao registrar Professor:', error);
        alert('Erro ao registrar usuário. Por favor, tente novamente.');
    }
}

async function sendRegistrationRequest(userData) {
    return await fetch('https://fauna-api.onrender.com/prof', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
}
