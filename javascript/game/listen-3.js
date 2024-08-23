document.addEventListener('DOMContentLoaded', function () {
    iniciarAtividade();

});

function iniciarAtividade() {
    const inicioAtividade = new Date();
    const animalCorreto = "Rato";

    const nomedoUsario = localStorage.getItem('nomeDoUsuarioClicado')
    const idDoUsuario = localStorage.getItem('idDoUsuarioClicado')

    const botoesAnimais = document.querySelectorAll('.animals');
    console.log(botoesAnimais)
    botoesAnimais.forEach(botaoAnimal => {
        botaoAnimal.addEventListener('click', () => {
            const animalSelecionado = botaoAnimal.id;
            let acerto = animalSelecionado.toLowerCase() == animalCorreto.toLowerCase();
            const diferencaTempoSegundos = calcularDiferencaTempo(inicioAtividade);

            enviarDadosParaServidor(idDoUsuario, nomedoUsario, animalSelecionado, acerto, diferencaTempoSegundos);

            
            contadorDeCliques = 0;

        });
    });
}



function calcularDiferencaTempo(inicioAtividade) {
    const agora = new Date();
    const diferencaTempoMilissegundos = agora - inicioAtividade;
    return Math.floor(diferencaTempoMilissegundos / 1000);
}

function enviarDadosParaServidor(idDoUsuario, nomeDoUsario, animalSelecionado, acerto, diferencaTempoSegundos) {
    try {
        const corpoRequisicao = {
            idaluno: idDoUsuario,
            nomealuno: nomeDoUsario,
            item: 'CI005',
            descricao: 'Quem brincou com o gato?',
            resposta: animalSelecionado,
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

                // Verifique o tipo de erro e adicione logs específicos
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
        window.location.href = '../../views/../next.html'
    }
}


