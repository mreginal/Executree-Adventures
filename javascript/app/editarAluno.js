document.addEventListener('DOMContentLoaded', function () {
    const userId = localStorage.getItem('idDoUsuarioClicado');

    obterDadosUsuarioPorId(userId)
        .then(dadosUsuario => {
            console.log('Dados do aluno:', dadosUsuario);
            criarFormularioEdicao(dadosUsuario);
        })
        .catch(error => {
            console.error('Erro ao obter dados do aluno:', error);
        });
});

function criarFormularioEdicao(dadosUsuario) {
    const form = document.createElement('form');
    form.id = 'formEditUser';

    const divData = document.createElement('div');
    divData.className = 'data';

    const nome = criarCampoInput('text', 'nome', 'nome', 'Nome:', dadosUsuario.nome);
    const datanasc = criarCampoInput('date', 'datanasc', 'datanasc', 'Data de Nascimento:', dadosUsuario.datanasc);
    const genero = criarCampoInput('text', 'genero', 'genero', 'Gênero:', dadosUsuario.genero);
    const escola = criarCampoInput('text', 'escola', 'escola', 'Escola:', dadosUsuario.escola);
    const serie = criarCampoInput('text', 'serie', 'serie', 'Série:', dadosUsuario.serie);
    divData.appendChild(nome);
    divData.appendChild(datanasc);
    divData.appendChild(genero);
    divData.appendChild(escola);
    divData.appendChild(serie);

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
    const idDoUsuario = localStorage.getItem('idDoUsuarioClicado');

    console.log('Dados do formulário antes:', formData);

    const dadosAtualizados = {};
    for (let [chave, valor] of formData.entries()) {
        dadosAtualizados[chave] = valor;
    }

    console.log('Dados atualizados antes:', dadosAtualizados);

    try {
        const response = await fetch(`https://fauna-api.onrender.com/aluno/${idDoUsuario}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosAtualizados),
        });

        if (!response.ok) {
            throw new Error(`Erro na solicitação: ${response.status}`);
        }

        console.log('Dados do aluno atualizados com sucesso!');
        window.location.href = '../views/alunos.html'
    } catch (error) {
        console.error('Erro ao atualizar dados do aluno:', error);
    }
}

const API_URL_ALUNOS = 'https://fauna-api.onrender.com/aluno/perfil';

async function obterDadosUsuarioPorId(userId) {
    try {
        const response = await fetch(API_URL_ALUNOS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: userId
            }),
        });

        if (!response.ok) {
            throw new Error(`Erro na solicitação: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao obter dados do aluno:', error);
        throw error;
    }
}