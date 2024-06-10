const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// 加载背景图片
const backgroundImage = new Image();
backgroundImage.src = 'background.jpg';
backgroundImage.crossOrigin = "Anonymous"; // 如果图片来源不同域，确保设置跨域属性

const images = ['scorpion.png', 'centipede.png', 'snake.png', 'spider.png', 'toad.png'];
const targets = [];
let score = 0;

function loadImages(imagePaths) {
    return imagePaths.map(path => {
        const img = new Image();
        img.src = path;
        img.crossOrigin = "Anonymous"; // 如果图片来源不同域，确保设置跨域属性
        img.onload = () => {
            console.log(`图片加载成功: ${path}`);
        };
        img.onerror = () => {
            console.error(`图片加载失败: ${path}`);
        };
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

function drawBackground() {
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function drawTargets() {
    targets.forEach(target => {
        context.drawImage(target.image, target.x, target.y);
    });
}

function drawScore() {
    context.font = '20px Arial';
    context.fillStyle = 'black';
    context.fillText('得分: ' + score, 10, 20);
    console.log('当前得分: ' + score); // 调试信息
}

function checkCollision(x, y) {
    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        if (x >= target.x && x <= target.x + target.image.width &&
            y >= target.y && y <= target.y + target.image.height) {
            targets.splice(i, 1);
            score++;
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
    context.clearRect(0, 0, canvas.width, canvas.height); // 清空画布
    drawBackground();
    drawTargets();
    drawScore();
    requestAnimationFrame(gameLoop);
}

// 初始化
backgroundImage.onload = function() {
    for (let i = 0; i < 5; i++) {
        spawnTarget();
    }
    gameLoop();
};

// 错误处理
backgroundImage.onerror = function() {
    console.error("背景图片加载失败");
};

loadedImages.forEach(img => {
    img.onerror = function() {
        console.error(`图片加载失败: ${img.src}`);
    };
});
