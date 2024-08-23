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
