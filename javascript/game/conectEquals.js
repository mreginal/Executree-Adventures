let selectedImage = null;

document.querySelectorAll('.image-box').forEach(box => {
    box.addEventListener('click', () => {
        if (!selectedImage) {
            selectedImage = box;
        } else {
            drawLine(selectedImage, box);
            selectedImage = null;
        }
    });
});

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
