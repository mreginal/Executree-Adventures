const inicioAtividade = new Date();

var canvas = new fabric.Canvas('canvas');
canvas.setWidth(window.innerWidth);
canvas.setHeight(window.innerHeight);

var maxLines = 3;
var linesDrawn = 0;
var lines = [];
var images = [];
var firstClickedImage = null;
var clickedIndexes = [];
let respostasConcatenadas = '';
let respostaFinal = [];
var totalConnectionsExpected = 3; 
var currentConnections = 0; 

function createImage(left, top, imageUrl, index) {
    fabric.Image.fromURL(imageUrl, function (img) {
        img.set({ left: left, top: top, selectable: false });
        img.index = index;
        canvas.add(img);
        images.push(img);
        bindImageEvents(img);
    });
}

createImage(50, 50, '../imagens/barcelona.png', 1);
createImage(window.innerWidth / 2 - 75, 50, '../imagens/barcelona.png', 2);
createImage(window.innerWidth - 150, 50, '../imagens/barcelona.png', 3);
createImage(50, window.innerHeight - 150, '../imagens/barcelona.png', 4);
createImage(window.innerWidth / 2 - 75, window.innerHeight - 150, '../imagens/barcelona.png', 5);
createImage(window.innerWidth - 150, window.innerHeight - 150, '../imagens/barcelona.png', 6);



function bindImageEvents(img) {
    img.on('mousedown', function () {
        var index = getIndexFromImage(img);
        console.log('Índice da imagem clicada:', index);

        if (!firstClickedImage && index <= 3) {
            firstClickedImage = img;
            assignVariables(index);
        } else if (firstClickedImage && index > 3) {
            assignVariables(index);
            createLineBetweenImages(firstClickedImage, img);
            firstClickedImage = null;
            currentConnections++;

            if (currentConnections === totalConnectionsExpected) {
                checkVariables(); 
            }
        }
    });
}

function assignVariables(index) {
    clickedIndexes.push(index);
}

function checkVariables() {
    if (clickedIndexes.length !== totalConnectionsExpected * 2) {
        console.log('Por favor, complete todas as conexões antes de verificar.');
        return;
    }

    if (currentConnections === totalConnectionsExpected) {
        console.log('Índices clicados na ordem:');
        let todasCorretas = true;
        clickedIndexes.forEach(function (index, i) {
            console.log(index);
            if (i % 2 === 1) { // Verifica os índices a cada par de elementos (conexão)
                let acerto = false;
                if ((clickedIndexes[i - 1] === 1 && index === 5) ||
                    (clickedIndexes[i - 1] === 2 && index === 6) ||
                    (clickedIndexes[i - 1] === 3 && index === 4)) {
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
    } else {
        console.log('Ainda não foi realizada a última conexão.');
    }
}



function getIndexFromImage(img) {
    var index = -1;
    images.forEach(function (image, i) {
        if (image === img) {
            index = i + 1;
        }
    });
    return index;
}

function createLineBetweenImages(upperImg, lowerImg) {
    if (linesDrawn >= maxLines) {
        removeFirstLine();
    }

    var points = [
        upperImg.left + upperImg.width / 2,
        upperImg.top + upperImg.height / 2,
        lowerImg.left + lowerImg.width / 2,
        lowerImg.top + lowerImg.height / 2
    ];

    var line = new fabric.Line(points, {
        strokeWidth: 2,
        fill: 'red',
        stroke: 'red',
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
        lockRotation: true
    });

    canvas.add(line);
    lines.push(line);
    linesDrawn++;
}

function removeFirstLine() {
    if (lines.length > 0) {
        var removedLine = lines.shift();
        canvas.remove(removedLine);
        linesDrawn--;
    }
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

function calcularDiferencaTempo(inicioAtividade) {
    const agora = new Date();
    const diferencaTempoMilissegundos = agora - inicioAtividade;
    return Math.floor(diferencaTempoMilissegundos / 1000);
}

function redirecionarUsuario() {
    const proximoCapitulo = localStorage.getItem('proximoCapitulo');
    if (proximoCapitulo == "false") {
        window.location.href = '../views/main.html'
    }
    else {
        window.location.href = '../views/encontreTartaruga.html'
    }
}