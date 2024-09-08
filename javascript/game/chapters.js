document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.querySelector('.chapters-init button');
    const chaptersSection = document.querySelector('.chapters-game');
    const chaptersInitSection = document.querySelector('.chapters-init');

    if (localStorage.getItem('chapterStarted') === 'true') {
        chaptersSection.classList.remove('hidden');
        chaptersSection.classList.add('visible');
        chaptersInitSection.style.display = 'none';
    }

    startButton.addEventListener('click', function() {
        chaptersSection.classList.remove('hidden');
        chaptersSection.classList.add('visible');
        chaptersInitSection.style.display = 'none';
        
        localStorage.setItem('chapterStarted', 'true');
    });
});

const chapters = {
    1: ['paint.html', 'paint-2.html'],
    2: ['listen-q1.html', 'listen-q2.html', 'listen-q3.html'],
    3: ['conect-equals.html', 'conect-foods.html', 'conect-shadow.html'],
    4: ['find.html', 'drag.html', 'select.html']
};

document.addEventListener('DOMContentLoaded', () => {
    for (let chapter in chapters) {
        if (localStorage.getItem(`chapter${chapter}`) === 'completed') {
            const chapterElement = document.getElementById(`chapter${chapter}`);
            chapterElement.classList.add('completed');
        }
    }
});

function startChapter(chapterNumber) {
    const currentChapter = chapters[chapterNumber];
    localStorage.setItem('currentChapter', chapterNumber);

    let currentStageIndex = parseInt(localStorage.getItem(`chapter${chapterNumber}_stage`) || 0);

    if (currentStageIndex < currentChapter.length) {
        window.location.href = currentChapter[currentStageIndex];
    } else {
        // Marcar o capítulo como concluído se todas as fases forem completadas
        localStorage.setItem(`chapter${chapterNumber}`, 'completed');
        localStorage.removeItem(`chapter${chapterNumber}_stage`);
        window.location.href = 'chapters.html';
    }
}