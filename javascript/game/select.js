document.addEventListener('DOMContentLoaded', function () {
    iniciarAtividade();

});

async function iniciarAtividade() {
    try {
        const dadosDoUsuario = await resgatarDadosAluno();
        if (!dadosDoUsuario) {
            console.error('Falha ao obter dados do usuário.');
            return;
        }

        const nomedoUsario = dadosDoUsuario.nomeDoUsuario;
        const idDoUsuario = dadosDoUsuario.idDoUsuario;

        const itensCorretos = [
            ["Arvore", "Ninho", "Passaro"],
            ["Arvore", "Passaro", "Ninho"],
            ["Ninho", "Arvore", "Passaro"],
            ["Ninho", "Passaro", "Arvore"],
            ["Passaro", "Ninho", "Arvore"],
            ["Passaro", "Arvore", "Ninho"]
        ];

        let itensSelecionados = [];
        let contadorDeCliques = 0;
        const inicioAtividade = new Date();

        const botoesItens = document.querySelectorAll('.animals');
        botoesItens.forEach(botaoItem => {
            botaoItem.addEventListener('click', () => {
                contadorDeCliques++;

                if (contadorDeCliques <= 3) {
                    itensSelecionados.push(botaoItem.id);
                    console.log(itensSelecionados);
                }

                if (contadorDeCliques === 3) {
                    const diferencaTempoSegundos = calcularDiferencaTempo(inicioAtividade);
                    const acerto = verificarAcerto(itensSelecionados, itensCorretos);
                    enviarDadosParaServidor(idDoUsuario, nomedoUsario, itensSelecionados.join(','), acerto, diferencaTempoSegundos);
                    contadorDeCliques = 0;
                    itensSelecionados = [];
                }
            });
        });

    } catch (error) {
        console.error('Erro ao iniciar atividade:', error);
    }
}

function verificarAcerto(itensSelecionados, itensCorretos) {
    for (let i = 0; i < itensCorretos.length; i++) {
        let acertos = 0;

        for (let j = 0; j < itensSelecionados.length; j++) {
            if (itensCorretos[i].includes(itensSelecionados[j])) {
                acertos++;
            }
        }

        if (acertos === itensCorretos[i].length) {
            return true;
        }
    }

    return false;
}

function calcularDiferencaTempo(inicioAtividade) {
    const agora = new Date();
    const diferencaTempoMilissegundos = agora - inicioAtividade;
    return Math.floor(diferencaTempoMilissegundos / 1000);
}

function enviarDadosParaServidor(idDoUsuario, nomeDoUsario, itensSelecionados, acerto, diferencaTempoSegundos) {
    try {
        const corpoRequisicao = {
            idaluno: idDoUsuario,
            nomealuno: nomeDoUsario,
            item: 'CI011',
            descricao: 'Selecione os itens que fazem parte da história.',
            resposta: itensSelecionados,
            acerto: acerto,
            tempo: diferencaTempoSegundos,
        };

        fetch('https://fauna-api.onrender.com/resposta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(corpoRequisicao),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erro de rede: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Resposta do servidor:', data);
                redirecionarUsuario()
            })
            .catch((error) => {
                console.error('Erro ao enviar dados para o servidor:', error);

                if (error instanceof TypeError && error.message.includes('NetworkError')) {
                    console.error('Erro de rede: Não foi possível conectar ao servidor.');
                } else if (error instanceof SyntaxError) {
                    console.error('Erro de análise de JSON: A resposta do servidor não pôde ser analisada como JSON.');
                } else if (error instanceof Error && error.message.includes('500')) {
                    console.error('Erro interno do servidor (HTTP 500): O servidor encontrou um erro ao processar a solicitação.');
                } else {
                    console.error('Erro desconhecido:', error);
                }

            });
    } catch (error) {
        console.error('Erro ao enviar dados para o servidor:', error);
    }
}

async function resgatarDadosAluno() {
    try {
        const nomeDoUsuario = localStorage.getItem('nomeDoUsuarioClicado')
        const idDoUsuario = localStorage.getItem('idDoUsuarioClicado')

        return { nomeDoUsuario, idDoUsuario };
    } catch (error) {
        console.error('Erro ao resgatar dados do aluno:', error);
        throw error;
    }
}

function redirecionarUsuario() {
    const proximoCapitulo = localStorage.getItem('proximoCapitulo');
    if (proximoCapitulo == "false") {
        window.location.href = '../../views/app/menu.html'
    }
    else {
        window.location.href = '../../views/game/gatoCachorro1.html'
    }
}


