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

        const animalCorreto = "Tartaruga,Tartaruga,Tartaruga";
        let animal1 = "";
        let animal2 = "";
        let animal3 = "";
        let animaisSelecionados = "";
        let contadorDeCliques = 0;
        const inicioAtividade = new Date();

        const animalNome = document.querySelectorAll('.turtles');
        console.log(animalNome);

        animalNome.forEach(botaoAnimal => {
            botaoAnimal.addEventListener('click', () => {
                contadorDeCliques++;

                const diferencaTempoSegundos = calcularDiferencaTempo(inicioAtividade);

                if (contadorDeCliques === 1) {
                    animal1 = botaoAnimal.id;
                    console.log(animal1);
                }

                if (contadorDeCliques === 2) {
                    animal2 = botaoAnimal.id;
                    console.log(animal2);
                    
                }
                if (contadorDeCliques === 3) {
                    animal3 = botaoAnimal.id;
                    console.log(animal3);
                    animaisSelecionados = `${animal1},${animal2},${animal3}`; 
                    const acerto = animaisSelecionados.toLowerCase() === animalCorreto.toLowerCase();
                    enviarDadosParaServidor(idDoUsuario, nomedoUsario, animaisSelecionados, acerto, diferencaTempoSegundos);
                    contadorDeCliques = 0;
                }
                

            });
        });

    } catch (error) {
        console.error('Erro ao iniciar atividade:', error);
    }
}

function calcularDiferencaTempo(inicioAtividade) {
    const agora = new Date();
    const diferencaTempoMilissegundos = agora - inicioAtividade;
    return Math.floor(diferencaTempoMilissegundos / 1000);
}

function enviarDadosParaServidor(idDoUsuario, nomeDoUsario, animaisSelecionados, acerto, diferencaTempoSegundos) {
    try {
        const corpoRequisicao = {
            idaluno: idDoUsuario,
            nomealuno: nomeDoUsario,
            item: 'CI006',
            descricao: 'Encontre todas as tartarugas',
            resposta: animaisSelecionados,
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
        window.location.href = '../../views/game/animals-q.html'
    }
}


