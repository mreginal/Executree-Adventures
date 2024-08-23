document.addEventListener('DOMContentLoaded', function () {
    const authTokenProfessor = getCookie('authToken');
    if (authTokenProfessor) {
        obterDadosUsuarioPorToken()
            .then(dadosUsuarioAPI => {
                criarFormularioEdicao(dadosUsuarioAPI);
            })
            .catch(error => {
                console.error('Erro ao obter dados do usuário:', error);
            });
    } else {
        console.error('Token de autenticação não encontrado.');
        window.location.href = '../app/login.html'
    }
});

function criarFormularioEdicao(dadosUsuario) {
    const form = document.createElement('form');
    form.id = 'formEditUser';

    const divData = document.createElement('div');
    divData.className = 'data';

    const nome = criarCampoInput('text', 'nome', 'nome', 'Nome:', dadosUsuario.nome);
    const datanasc = criarCampoInput('date', 'datanasc', 'datanasc', 'Data de Nascimento:', dadosUsuario.datanasc);
    const genero = criarCampoInput('text', 'genero', 'genero', 'Gênero:', dadosUsuario.genero);
    const estado = criarCampoInput('text', 'estado', 'estado', 'Estado:', dadosUsuario.estado);
    const instituicao = criarCampoInput('text', 'instituicao', 'instituicao', 'Instituição:', dadosUsuario.instituicao);
    const ocupacao = criarCampoInput('text', 'ocupacao', 'ocupacao', 'Ocupação:', dadosUsuario.ocupacao);

    divData.appendChild(nome);
    divData.appendChild(datanasc);
    divData.appendChild(genero);
    divData.appendChild(estado);
    divData.appendChild(ocupacao);
    divData.appendChild(instituicao);

    form.appendChild(divData);

    const botaoEnviar = document.createElement('button');
    botaoEnviar.type = 'submit';
    botaoEnviar.textContent = 'Enviar';
    form.appendChild(botaoEnviar);

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        enviarEdicaoUsuario(form);
    });

    const editData = document.querySelector('.scrollable');
    editData.appendChild(form);
}

function criarCampoInput(type, id, name, label, valor) {
    const container = document.createElement('div');

    const labelElement = document.createElement('label');
    labelElement.textContent = label;

    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.name = name; 
    input.value = valor;

    container.appendChild(labelElement);
    container.appendChild(input);

    return container;
}

async function enviarEdicaoUsuario(form) {
    const formData = new FormData(form);
    const idDoUsuario = getCookie('authToken');
    
    const dadosAtualizados = {};
    for (let [chave, valor] of formData.entries()) {
        dadosAtualizados[chave] = valor;
    }
    try {
        const response = await fetch(`https://fauna-api.onrender.com/prof/${idDoUsuario}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosAtualizados),
        });

        if (!response.ok) {
            throw new Error(`Erro na solicitação: ${response.status}`);
        }

        console.log('Dados do usuário atualizados com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
    }
}

const API_URL_PROFESSOR = 'https://fauna-api.onrender.com/prof/perfil';

async function obterDadosUsuarioPorToken() {
    try {
        const response = await fetch(API_URL_PROFESSOR, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('authToken')}`
            }
        });

        if (!response.ok) {
            const errorMessage = `Erro na solicitação: ${response.status} - ${response.statusText}`;
            throw new Error(errorMessage);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Erro ao obter dados do usuário:', error.message); 
        throw error;
    }
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
