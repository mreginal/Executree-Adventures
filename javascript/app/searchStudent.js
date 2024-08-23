document.addEventListener('DOMContentLoaded', function () {
    const dados = JSON.parse(localStorage.getItem('dadosBuscados'));

    if (dados) {
        renderItems(dados);
    } else {
        fetchData(); 
    }
});

async function fetchData() {
    const queryKeyword = document.getElementById('filter').value.trim().toLowerCase();

    try {
        const response = await fetch('URL_PARA_O_ENDPOINT_DE_ALUNOS', { 
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                campo: queryKeyword 
            })
        });

        if (response.ok) {
            const data = await response.json();
            renderItems(data); 
        } else {
            const errorMsg = await response.text();
            alert(errorMsg); 
            console.log("Nenhum aluno encontrado");
        }
    } catch (error) {
        console.error('Erro ao buscar dados de alunos:', error);
    }
}

function renderItems(data) {
    const itemList = document.getElementById('itemList');

    itemList.innerHTML = '';

    if (data && data.length > 0) {
        data.forEach(item => {
            criarDivAluno()
        });
    }
}
