document.addEventListener('DOMContentLoaded', function () {
    const userId = localStorage.getItem('idDoUsuarioClicado');
    renderizarHistorico(userId);
});

async function acessarHistoricoAluno(userId) {
    try {
        const response = await fetch(`https://fauna-api.onrender.com/resposta/return`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idaluno: userId
            })
        });
        if (!response.ok) {
            throw new Error(`Erro na solicitação: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Erro ao acessar dados dos alunos:', error);
        throw error;
    }
}

async function renderizarHistorico(userId) {
    try {
        const historicoAluno = await acessarHistoricoAluno(userId);
        const container = document.getElementById('history'); 
        
        historicoAluno.forEach(resposta => {
            const divResposta = criarDivResposta(resposta);
            container.appendChild(divResposta);
        });
    } catch (error) {
        console.error('Erro ao criar histórico de respostas:', error);
        throw error;
    }
}

function criarDivResposta(resposta) {
    const divResposta = document.createElement('div');
    divResposta.classList.add('resposta');

    divResposta.appendChild(criarParagrafo(`Item: ${resposta.item}`));
    divResposta.appendChild(criarParagrafo(`Atividade: ${resposta.descricao}`));
    divResposta.appendChild(criarParagrafo(`Resposta: ${resposta.resposta}`));
    divResposta.appendChild(criarParagrafo(`Acerto: ${resposta.acerto}`));
    divResposta.appendChild(criarParagrafo(`Tempo: ${resposta.tempo}`+' segundo(s)'));

    return divResposta;
}

function criarParagrafo(texto) {
    const paragrafo = document.createElement('p');
    paragrafo.textContent = texto;
    return paragrafo;
}
