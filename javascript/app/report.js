document.addEventListener('DOMContentLoaded', function () {
    carregarAlunos();
});

async function carregarAlunos() {
    try {
        const container = document.getElementById('alunos-container');
        const dadosDoAluno = await criarAlunosPagMeusAlunos();

        dadosDoAluno.forEach(divAluno => {
            container.appendChild(divAluno);
        });
    } catch (error) {
        console.error('Erro ao processar dados:', error);
    }
}

async function criarAlunosPagMeusAlunos() {
    try {
        const dadosAluno = await resgatarDadosAluno();
        

        return dadosAluno.map(aluno => {
            const divAluno = document.createElement('div');
            divAluno.setAttribute('data-userid', aluno._id);

            const nomealuno = criarElementoComTexto('p', 'nome', `Nome: ${aluno.nome}`);
            const escolaaluno = criarElementoComTexto('p', 'escola', `Escola: ${aluno.escola}`);

            const botaoHistorico = document.createElement('button');
            botaoHistorico.textContent = '🔄'; 
            

            botaoHistorico.classList.add('botaoHistorico');
            

            botaoHistorico.addEventListener('click', function() {
                const idDoUsuarioClicado = aluno._id;
                localStorage.setItem('idDoUsuarioClicado', idDoUsuarioClicado);
                window.location.href = '../app/history.html';
            });

            divAluno.appendChild(nomealuno);
            divAluno.appendChild(escolaaluno);
            divAluno.appendChild(botaoHistorico);


            divAluno.classList.add('aluno');

            return divAluno;
        });
    } catch (error) {
        console.error('Erro ao criar alunos:', error);
        throw error;
    }
}

function criarElementoDetalhes(aluno) {
    const detalhesContainer = document.createElement('div');
    detalhesContainer.className = 'detalhes-container';

    const informacoesContainer = criarElementoInformacoes(aluno);

    detalhesContainer.appendChild(informacoesContainer);


    return detalhesContainer;
}

function criarElementoInformacoes(aluno) {
    const informacoesContainer = document.createElement('div');
    informacoesContainer.className = 'info-container';

    const nomealuno = criarElementoComTexto('p', 'nome', `Nome: ${aluno.nomealuno}`);
    const idaluno = criarElementoComTexto('p', 'id', `Id: ${aluno.idaluno}`);

    informacoesContainer.appendChild(nomealuno);
    informacoesContainer.appendChild(idaluno);

    return informacoesContainer;
}

function criarElementoComTexto(tag, className, textContent) {
    const elemento = document.createElement(tag);
    if (className) {
        elemento.className = className;
    }
    elemento.textContent = textContent;

    return elemento;
}

API_URL_ALUNOS_PROF = 'https://fauna-api.onrender.com/aluno/prof'
async function resgatarDadosAluno() {
    const idProf = getCookie('userID');
    try {
        const response = await fetch(API_URL_ALUNOS_PROF, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idprof: idProf
            })
        });

        if (!response.ok) {
            throw new Error(`Erro na solicitação: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Erro ao resgatar dados do aluno:', error);
        throw error;
    }
}



