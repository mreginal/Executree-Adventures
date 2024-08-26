document.addEventListener('DOMContentLoaded', function(){
    const startButton = document.querySelector('.chapters-init button');
    const chaptersSection = document.querySelector('.chapters-game');
    const chaptersInitSection = document.querySelector('.chapters-init');

    startButton.addEventListener('click',function(){
        chaptersSection.classList.remove('hidden');
        chaptersSection.classList.add('visible');
        chaptersInitSection.style.display='none';
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
            document.getElementById(`chapter${chapter}`).classList.add('completed');
        }
    }
});

function startChapter(chapterNumber) {
    const currentChapter = chapters[chapterNumber];
    localStorage.setItem('currentChapter', chapterNumber);

    let currentStageIndex = localStorage.getItem(`chapter${chapterNumber}_stage`) || 0;

    if (currentStageIndex < currentChapter.length) {
        window.location.href = currentChapter[currentStageIndex];
    } else {
        localStorage.setItem(`chapter${chapterNumber}`, 'completed');
        localStorage.removeItem(`chapter${chapterNumber}_stage`);
        window.location.href = 'index.html';
    }
}

function completeStage() {
    const currentChapter = localStorage.getItem('currentChapter');
    let currentStageIndex = parseInt(localStorage.getItem(`chapter${currentChapter}_stage`) || 0);

    currentStageIndex++;

    if (currentStageIndex >= chapters[currentChapter].length) {
        localStorage.setItem(`chapter${currentChapter}`, 'completed');
        localStorage.removeItem(`chapter${currentChapter}_stage`);
        window.location.href = 'index.html';
    } else {
        localStorage.setItem(`chapter${currentChapter}_stage`, currentStageIndex);
        window.location.href = chapters[currentChapter][currentStageIndex];
    }
}
