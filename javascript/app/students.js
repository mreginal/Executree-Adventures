document.addEventListener('DOMContentLoaded', function () {
    carregarAlunos();

});

const API_URL_ALUNOS_PROF = 'https://fauna-api.onrender.com/aluno/prof';
const API_URL_REMOVER_ALUNO = 'https://fauna-api.onrender.com/aluno/remove';

async function carregarAlunos() {
    try {
        const container = document.getElementById('container-students');
        const dadosDoAluno = await criarAlunosPagMeusAlunos();

        if (dadosDoAluno.length === 0) {
            exibirMensagemSemAlunos(container);
        } else {
            criarOuAtualizarBotaoCadastrar(container);

            dadosDoAluno.forEach(divAluno => {
                container.appendChild(divAluno);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar alunos:', error);
    }
}

async function criarAlunosPagMeusAlunos() {
    try {
        const dadosAluno = await resgatarDadosAluno();

        return dadosAluno.map(aluno => {
            const divAluno = criarDivAlunoComBotoes(aluno);

            divAluno.addEventListener('click', () => {
                localStorage.setItem('nomeDoUsuarioClicado', aluno.nome);
                localStorage.setItem('idDoUsuarioClicado', aluno._id);
            });

            return divAluno;
        });
    } catch (error) {
        if (!dadosAluno || dadosAluno.length === 0) {
            console.log("vazio");
        } else {
            console.error('Erro ao criar alunos:', error);
            throw error;
        }
    }
}

function criarBotao(texto, classe) {
    const botao = document.createElement('button');
    botao.textContent = texto;
    botao.classList.add(classe);

    return botao;
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

async function removerAluno(userId) {
    try {

        const confirmarExclusao = window.confirm('Tem certeza que deseja excluir este aluno?');

        if (!confirmarExclusao) {
            console.log('Exclusão cancelada pelo usuário');
            return; 
        }


        const response = await fetch(API_URL_REMOVER_ALUNO, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: userId
            })
        });

        if (!response.ok) {
            throw new Error(`Erro na solicitação: ${response.status}`);
        }

        const elementoRemover = document.querySelector(`[data-userid="${userId}"]`);
        if (elementoRemover) {
            elementoRemover.remove();
        }

        return response.json();
    } catch (error) {
        console.error('Erro ao remover aluno:', error);
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

const API_URL_ALUNOS_ORDENAR_POR_NOME = 'https://fauna-api.onrender.com/aluno/nome'
async function filtrarAlunosOrdemAlfabetica() {
    try {
        const idProf = getCookie('userID');
        const response = await fetch(API_URL_ALUNOS_ORDENAR_POR_NOME, {
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

        const alunosOrdenados = await response.json();
        exibirAlunosOrdenados(alunosOrdenados);
    } catch (error) {
        console.error('Erro ao resgatar dados do aluno:', error);
        throw error;
    }
}

function exibirAlunosOrdenados(alunos) {
    const container = document.getElementById('container-students');
    container.innerHTML = '';

    if (alunos.length === 0) {
        const mensagemSemAlunos = document.createElement('p');
        mensagemSemAlunos.textContent = 'Nenhum aluno encontrado.';
        container.appendChild(mensagemSemAlunos);
    } else {
        let botaoCadastrar = document.getElementById('botaoCadastrar');
        if (!botaoCadastrar) {
            botaoCadastrar = criarBotao('Cadastrar aluno', 'botaoMeusAlunos');
            botaoCadastrar.id = 'botaoCadastrar';

            container.appendChild(botaoCadastrar);

            botaoCadastrar.addEventListener('click', () => {
                window.location.href = '../app/registerStudent.html';
            });
        }

        alunos.forEach(aluno => {
            const divAluno = criarDivAlunoComBotoes(aluno);
            container.appendChild(divAluno);
        });
    }
}


function criarDivAluno(aluno) {
    const divAluno = document.createElement('div');
    divAluno.classList.add('aluno');

    const nomeAluno = document.createElement('span');
    nomeAluno.textContent = aluno.nome;

    divAluno.appendChild(nomeAluno);

    return divAluno;
}

function criarBotao(texto, classe) {
    const botao = document.createElement('button');
    botao.textContent = texto;
    botao.classList.add(classe);

    return botao;
}

function criarDivAlunoComBotoes(aluno) {
    const divAluno = criarDivAluno(aluno);

    const botaoAcessar = criarBotao('▶️', 'botaoMeusAlunos');
    const botaoExcluir = criarBotao('🚮', 'botaoMeusAlunos');
    const botaoEditar = criarBotao('🖋️', 'botaoMeusAlunos');

    const divBotoesContainer = document.createElement('div');
    divBotoesContainer.classList.add('botaoContainer');

    divBotoesContainer.appendChild(botaoAcessar);
    divBotoesContainer.appendChild(botaoEditar);
    divBotoesContainer.appendChild(botaoExcluir);

    divAluno.appendChild(divBotoesContainer);

    botaoAcessar.addEventListener('click', (event) => {
        event.stopPropagation();
        localStorage.setItem('nomeDoUsuarioClicado', aluno.nome);
        localStorage.setItem('idDoUsuarioClicado', aluno._id);
        window.location.href = '../app/chapters.html';
    });

    botaoExcluir.addEventListener('click', async (event) => {
        event.stopPropagation();
        try {
            console.log(`ID do aluno a ser removido: ${aluno._id}`);
            await removerAluno(aluno._id);
            await excluirRespostasAluno(aluno._id);
        } catch (error) {
            console.error('Erro ao remover aluno:', error);
        }
    });

    botaoEditar.addEventListener('click', (event) => {
        event.stopPropagation();
        localStorage.setItem('idDoUsuarioClicado', aluno._id);
        window.location.href = '../app/editStudent.html';
    });

    return divAluno;
}

function criarDivAluno(aluno) {
    const divAluno = document.createElement('div');
    divAluno.setAttribute('data-userid', aluno._id);

    const nomealuno = criarElementoComTexto('p', 'nome', `Nome: ${aluno.nome}`);
    const escolaaluno = criarElementoComTexto('p', 'escola', `Escola: ${aluno.escola}`);

    divAluno.appendChild(nomealuno);
    divAluno.appendChild(escolaaluno);
    divAluno.classList.add('aluno');

    return divAluno;
}

function exibirMensagemSemAlunos(container) {
    const mensagemSemAlunos = document.createElement('p');
    mensagemSemAlunos.textContent = 'Você não tem alunos cadastrados. Cadastre aqui.';

    const redirecionarParaCadastroDeAlunos = criarBotao('Cadastrar aluno', 'botaoMeusAlunos');
    redirecionarParaCadastroDeAlunos.addEventListener('click', function () {
        window.location.href = '../app/registerStudent.html';
    });

    container.appendChild(mensagemSemAlunos);
    container.appendChild(redirecionarParaCadastroDeAlunos);
}

function criarOuAtualizarBotaoCadastrar(container) {
    let botaoCadastrar = document.getElementById('botaoCadastrar');
    if (!botaoCadastrar) {
        botaoCadastrar = criarBotao('Cadastrar aluno', 'botaoMeusAlunos');
        botaoCadastrar.id = 'botaoCadastrar';

        botaoCadastrar.addEventListener('click', function () {
            window.location.href = '../app/registerStudent.html';
        });

        container.appendChild(botaoCadastrar);
    }
}

const API_URL_ALUNOS_APAGAR_RESPOSTAS = 'https://fauna-api.onrender.com/resposta/remove'
async function excluirRespostasAluno(aluno) {
    try {
        const response = await fetch(API_URL_ALUNOS_APAGAR_RESPOSTAS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idaluno: aluno
            })
        });
        if (!response.ok) {
            throw new Error(`Erro na solicitação: ${response.status}`);
        }

        console.log('excluido respostas')
    } catch (error) {
        console.error('Erro ao apagar histórico do aluno:', error);
        throw error;
    }
}