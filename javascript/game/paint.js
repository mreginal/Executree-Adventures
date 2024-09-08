document.addEventListener('DOMContentLoaded', function () {
    iniciarAtividade();
});

async function iniciarAtividade() {
    try {
        const inicioAtividade = new Date();
        const corCorreta = "green";

        const nomedoUsario = localStorage.getItem('nomeDoUsuarioClicado')
        const idDoUsuario = localStorage.getItem('idDoUsuarioClicado')
        const botoesCores = document.querySelectorAll('.tint');
        const imgMonkey = document.getElementById('quest-img');

        botoesCores.forEach((botaoCor) => {
            botaoCor.addEventListener('click', () => {
                const corSelecionada = botaoCor.id;
                const acerto = corSelecionada.toLowerCase() === corCorreta.toLowerCase();
                const diferencaTempoSegundos = calcularDiferencaTempo(inicioAtividade);

                console.log(idDoUsuario, nomedoUsario, corSelecionada, acerto, diferencaTempoSegundos);

                updateImg(corSelecionada, imgMonkey);

                setTimeout(()=>{
                    enviarDadosParaServidor(idDoUsuario, nomedoUsario, corSelecionada, acerto, diferencaTempoSegundos);
                }, 2000);
            });
        });
    } catch (error) {
        console.error('Erro ao iniciar atividade:', error);
    }
}

function updateImg(color, image){
    image.src =`../../images/animals/monkey/monkey-${color}.png`;
    image.style.display = 'block';

    image.classList.add('fun-animation');

    image.addEventListener('animationend', ()=>{
        image.classList.remove('fun-animation');
    })
}

function calcularDiferencaTempo(inicioAtividade) {
    const agora = new Date();
    const diferencaTempoMilissegundos = agora - inicioAtividade;
    return Math.floor(diferencaTempoMilissegundos / 1000);
}

function enviarDadosParaServidor(idDoUsuario, nomeDoUsuario, corSelecionada, acerto, diferencaTempoSegundos) {
    try {
        const corpoRequisicao = {
            idaluno: idDoUsuario,
            nomealuno: nomeDoUsuario,
            item: 'CI001',
            descricao: 'Pinte o macaco de verde',
            resposta: corSelecionada,
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

document.getElementById('btn-next-phase').addEventListener('click', function() {
    completeStage();
});
