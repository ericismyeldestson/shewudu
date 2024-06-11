const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('startButton');

let gameStarted = false;

// 创建音频对象池
const audioPool = [];
const poolSize = 5; // 可以根据需要调整音频对象池的大小
for (let i = 0; i < poolSize; i++) {
    const audio = new Audio('mauser_fire.mp3');
    audioPool.push(audio);
}

function getAudioFromPool() {
    for (let i = 0; i < audioPool.length; i++) {
        if (audioPool[i].paused) {
            return audioPool[i];
        }
    }
    // 如果所有音频对象都在使用，创建一个新的音频对象
    const newAudio = new Audio('mauser_fire.mp3');
    audioPool.push(newAudio);
    return newAudio;
}

const images = ['scorpion.png', 'centipede.png', 'snake.png', 'spider.png', 'toad.png'];
const targets = [];
let score = 0;

function loadImages(imagePaths) {
    return imagePaths.map(path => {
        const img = new Image();
        img.src = path;
        img.addEventListener('load', () => {
            console.log(`图片加载成功: ${path}`);
        }, false);
        img.addEventListener('error', (e) => {
            console.error(`图片加载失败: ${path}`, e);
        }, false);
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
    targets.forEach(target => {
        context.drawImage(target.image, target.x, target.y);
    });
}

function drawScore() {
    context.font = '20px Arial';
    context.fillStyle = 'black';
    context.fillText('得分: ' + score, 10, 20);
}

// 生成随机颜色
function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 1)`;
}


// 烟花效果
const particles = [];
function createFireworks(x, y) {
    const particleCount = 80; // 烟花粒子的数量
    const speedMultiplier = 0.5; // 调整这个值来控制爆炸半径
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 2;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            life: Math.random() * 30 + 30,
            color: getRandomColor() // 为每个粒子分配一个随机颜色
        });
    }
}

function updateFireworks() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
        p.life--;
        if (p.alpha <= 0 || p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function drawFireworks() {
    context.save();
    context.globalAlpha = 0.7;
    particles.forEach(p => {
        context.fillStyle = p.color; // 使用粒子的颜色
        context.beginPath();
        context.arc(p.x, p.y, 3, 0, Math.PI * 2);
        context.fill();
    });
    context.restore();
}

function checkCollision(x, y) {
    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        if (x >= target.x && x <= target.x + target.image.width &&
            y >= target.y && y <= target.y + target.image.height) {
            targets.splice(i, 1);
            score++;
            scoreElement.textContent = `得分: ${score}`;
            const fireSound = getAudioFromPool();
            fireSound.currentTime = 0; // 重置音频播放时间
            fireSound.play().catch(error => {
                console.error('音频播放失败', error);
            });
            createFireworks(target.x + target.image.width / 2, target.y + target.image.height / 2); // 创建烟花效果
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
    drawTargets();
    drawFireworks();
    drawScore();
    updateFireworks();
    requestAnimationFrame(gameLoop);
}

// 开始游戏
startButton.addEventListener('click', () => {
    gameStarted = true;
    startButton.style.display = 'none'; // 隐藏开始按钮

    // 初始化
    for (let i = 0; i < 5; i++) {
        spawnTarget();
    }
    gameLoop();
});
