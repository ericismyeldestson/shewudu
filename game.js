const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const images = ['scorpion.png', 'centipede.png', 'snake.png', 'spider.png', 'toad.png'];
const targets = [];
let score = 0;

function loadImages(imagePaths) {
    return imagePaths.map(path => {
        const img = new Image();
        img.src = path;
        return img;
    });
}

const loadedImages = loadImages(images);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function spawnTarget() {
    const image = loadedImages[getRandomInt(0, loadedImages.length - 1)];
    const x = getRandomInt(0, canvas.width - image.width);
    const y = getRandomInt(0, canvas.height - image.height);
    targets.push({ image, x, y });
}

function drawTargets() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    targets.forEach(target => {
        context.drawImage(target.image, target.x, target.y);
    });
}

function checkCollision(x, y) {
    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        if (x >= target.x && x <= target.x + target.image.width &&
            y >= target.y && y <= target.y + target.image.height) {
            targets.splice(i, 1);
            score++;
            document.title = `得分: ${score}`;
            return true;
        }
    }
    return false;
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (checkCollision(x, y)) {
        spawnTarget();
    }
});

function gameLoop() {
    drawTargets();
    requestAnimationFrame(gameLoop);
}

// 初始化
for (let i = 0; i < 5; i++) {
    spawnTarget();
}

gameLoop();
