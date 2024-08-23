document.addEventListener('DOMContentLoaded', function() {
    iniciarAtividade();
});

let respostas = [];
let inicioAtividade;

function iniciarAtividade() {
    inicioAtividade = new Date();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev, dropzoneId) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var dropzone = document.getElementById(dropzoneId);
    let acerto;
    let resposta;

    if (data === 'imagem1' && dropzoneId === 'imagem2') {
        document.getElementById('imagem3').style.display = 'none';
        document.getElementById('imagem4').style.display = 'none';
        acerto = true;
        resposta = "Imagem 1 na 2";
        respostas.push(acerto);
    }

    if (data === 'imagem3' && dropzoneId === 'imagem4') {
        document.getElementById('imagem1').style.display = 'none';
        document.getElementById('imagem2').style.display = 'none';
        acerto = false;
        resposta = "Imagem 3 na 4";
        respostas.push(acerto);
    }

    if (data === 'imagem1' && dropzoneId === 'imagem4') {
        document.getElementById('imagem2').style.display = 'none';
        document.getElementById('imagem3').style.display = 'none';
        acerto = false;
        resposta = "Imagem 1 na 4";
        respostas.push(acerto);
    }

    if (data === 'imagem3' && dropzoneId === 'imagem2') {
        document.getElementById('imagem1').style.display = 'none';
        document.getElementById('imagem4').style.display = 'none';
        acerto = false;
        resposta = "Imagem 3 na 2";
        respostas.push(acerto);
    }

    if (respostas.length === 1) {
        const diferencaTempoSegundos = calcularDiferencaTempo(inicioAtividade);
        console.log(diferencaTempoSegundos);
        const nomedoUsario = localStorage.getItem('nomeDoUsuarioClicado');
        const idDoUsuario = localStorage.getItem('idDoUsuarioClicado');

        enviarDadosParaServidor(nomedoUsario, idDoUsuario, resposta, acerto, diferencaTempoSegundos);
    }
}

function calcularDiferencaTempo(inicioAtividade) {
    const agora = new Date();
    const diferencaTempoMilissegundos = agora - inicioAtividade;
    return Math.floor(diferencaTempoMilissegundos / 1000);
}

function enviarDadosParaServidor(idDoUsuario, nomeDoUsario, resposta, acerto, diferencaTempoSegundos) {
    try {
        const corpoRequisicao = {
            idaluno: idDoUsuario,
            nomealuno: nomeDoUsario,
            item: 'CI010',
            descricao: 'Arraste a girafa maior',
            resposta: resposta,
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
            redirecionarUsuario();
        })
        .catch((error) => {
            console.error('Erro ao enviar dados para o servidor:', error);
            // Tratamento de erros
        });
    } catch (error) {
        console.error('Erro ao enviar dados para o servidor:', error);
    }
}

function redirecionarUsuario() {
    const proximoCapitulo = localStorage.getItem('proximoCapitulo');
    if (proximoCapitulo === "false") {
        setTimeout(function() {
            window.location.href = '../../views/app/menu.html';
        }, 1000);
    } else {
        setTimeout(function() {
            window.location.href = '../../views/game/select.html';
        }, 1000);
    }
}
