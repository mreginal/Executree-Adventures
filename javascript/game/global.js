function completeStage() {
    const currentChapter = localStorage.getItem('currentChapter');
    let currentStageIndex = parseInt(localStorage.getItem(`chapter${currentChapter}_stage`) || 0);

    currentStageIndex++;

    if (currentStageIndex >= chapters[currentChapter].length) {
        localStorage.setItem(`chapter${currentChapter}`, 'completed');
        localStorage.removeItem(`chapter${currentChapter}_stage`);
        window.location.href = 'chapters.html';
    } else {
        localStorage.setItem(`chapter${currentChapter}_stage`, currentStageIndex);
        window.location.href = chapters[currentChapter][currentStageIndex];
    }
}
