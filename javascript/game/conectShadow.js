const inicioAtividade = new Date();

let selectedImage = null;
let clickedIndexes = [];
let currentConnections = 0;
const totalConnectionsExpected = 3;

document.querySelectorAll('.image-box').forEach((box, index) => {
    box.addEventListener('click', () => {
        console.log('Índice da imagem clicada:', index + 1);

        if (!selectedImage && index < 3) {
            selectedImage = box;
            assignVariables(index + 1);
        } else if (selectedImage && index >= 3) {
            assignVariables(index + 1);
            drawLine(selectedImage, box);
            selectedImage = null;
            currentConnections++;

            if (currentConnections === totalConnectionsExpected) {
                checkVariables(); 
            }
        }

        console.log(clickedIndexes)
    });
});

function assignVariables(index) {
    clickedIndexes.push(index);
}

function checkVariables() {
    if (clickedIndexes.length !== totalConnectionsExpected * 2) {
        console.log('Por favor, complete todas as conexões antes de verificar.');
        return;
    }

    let todasCorretas = true;
    clickedIndexes.forEach(function (index, i) {
        if (i % 2 === 1) { // Verifica os índices a cada par de elementos (conexão)
            let acerto = false;
            if ((clickedIndexes[i - 1] === 1 && index === 6) ||
                (clickedIndexes[i - 1] === 2 && index === 4) ||
                (clickedIndexes[i - 1] === 3 && index === 5)) {
                acerto = true;
            }
            console.log(`Conexão ${i / 2 + 1} - ${acerto ? 'Certo' : 'Errado'}`);
            if (!acerto) {
                todasCorretas = false;
            }
        }
    });

    const diferencaTempoSegundos = calcularDiferencaTempo(inicioAtividade);
    const respostasConcatenadas = todasCorretas ? 'Todas corretas' : 'Pelo menos uma incorreta';
    enviarDadosParaServidor(respostasConcatenadas, todasCorretas, diferencaTempoSegundos);
}

function drawLine(img1, img2) {
    const svg = document.getElementById('lineCanvas');
    const rect1 = img1.getBoundingClientRect();
    const rect2 = img2.getBoundingClientRect();

    const x1 = rect1.left + rect1.width / 2 + window.scrollX;
    const y1 = rect1.top + rect1.height / 2 + window.scrollY;
    const x2 = rect2.left + rect2.width / 2 + window.scrollX;
    const y2 = rect2.top + rect2.height / 2 + window.scrollY;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "black"); // Cor da linha

    svg.appendChild(line);
}

function enviarDadosParaServidor(resposta, respostaFinal, diferencaTempoSegundos) {
    const nomedoUsario = localStorage.getItem('nomeDoUsuarioClicado')
    const idDoUsuario = localStorage.getItem('idDoUsuarioClicado')
    try {
        const corpoRequisicao = {
            idaluno: idDoUsuario,
            nomealuno: nomedoUsario,
            item: 'CI005',
            descricao: 'Ligue os animais à suas comidas favoritas',
            resposta: resposta,
            acerto: respostaFinal,
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
                // Tratamento de erro conforme o código original
            });
    } catch (error) {
        console.error('Erro ao enviar dados para o servidor:', error);
    }
}

function calcularDiferencaTempo(inicioAtividade) {
    const agora = new Date();
    const diferencaTempoMilissegundos = agora - inicioAtividade;
    return Math.floor(diferencaTempoMilissegundos / 1000);
}

document.getElementById('btn-next-phase').addEventListener('click', function() {
    completeStage();
});