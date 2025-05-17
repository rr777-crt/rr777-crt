const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Камера
const camera = {
    x: 0,
    y: 0,
    follow: function(target) {
        this.x = target.x - canvas.width / 2 + target.width / 2;
        this.y = target.y - canvas.height / 2 + target.height / 2;
    }
};

// Игрок
const player = {
    x: 100,
    y: 300,
    width: 30,
    height: 50,
    speed: 6,
    velX: 0,
    velY: 0,
    jumpForce: -14,
    gravity: 0.5,
    canDoubleJump: true,
    isWallSliding: false,
    color: '#FF5555',
    lastTapTime: 0,
    update: function() {
        this.x += this.velX;
        this.y += this.velY;
        this.velY += this.gravity;
        
        // Ограничение скорости падения
        if (this.velY > 15) this.velY = 15;
    }
};

// Платформы
const platforms = [
    { x: 0, y: 500, width: 800, height: 20, color: '#00AA00' },
    { x: 200, y: 400, width: 100, height: 20, color: '#0099FF' },
    { x: 400, y: 350, width: 100, height: 20, color: '#FF9900' },
    { x: 600, y: 300, width: 100, height: 20, color: '#AA00FF' },
    { x: 300, y: 200, width: 100, height: 20, color: '#FF0099' },
];

// Ловушки
const traps = [
    { x: 500, y: 480, width: 30, height: 20, color: '#FF0000' }, // Шипы
    { x: 700, y: 480, width: 30, height: 20, color: '#FF0000' },
];

// Враги
const enemies = [
    { 
        x: 350, y: 370, width: 30, height: 30, speed: 2, dir: 1, color: '#FF0000',
        update: function() {
            this.x += this.speed * this.dir;
            if (this.x > 450 || this.x < 350) this.dir *= -1;
        }
    }
];

// Управление
let left = false, right = false;

// Стрелки
document.getElementById('left').addEventListener('touchstart', () => left = true);
document.getElementById('left').addEventListener('touchend', () => left = false);
document.getElementById('right').addEventListener('touchstart', () => right = true);
document.getElementById('right').addEventListener('touchend', () => right = false);

// Двойной тап для прыжка
canvas.addEventListener('touchstart', (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - player.lastTapTime;
    if (tapLength < 300 && tapLength > 0) {
        if (!player.jumping || player.canDoubleJump) {
            player.velY = player.jumpForce;
            if (player.jumping) player.canDoubleJump = false;
            player.jumping = true;
        }
    }
    player.lastTapTime = currentTime;
    e.preventDefault();
});

// Коллизии
function checkCollisions() {
    player.jumping = true;
    player.isWallSliding = false;

    // Платформы
    platforms.forEach(platform => {
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y < platform.y + platform.height &&
            player.y + player.height > platform.y &&
            player.velY > 0
        ) {
            player.y = platform.y - player.height;
            player.velY = 0;
            player.jumping = false;
            player.canDoubleJump = true;
        }
    });

    // Ловушки
    traps.forEach(trap => {
        if (
            player.x < trap.x + trap.width &&
            player.x + player.width > trap.x &&
            player.y < trap.y + trap.height &&
            player.y + player.height > trap.y
        ) {
            resetPlayer();
        }
    });

    // Враги
    enemies.forEach(enemy => {
        enemy.update();
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            resetPlayer();
        }
    });
}

// Сброс игрока
function resetPlayer() {
    player.x = 100;
    player.y = 300;
    player.velX = 0;
    player.velY = 0;
}

// Игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Движение игрока
    player.velX = 0;
    if (left) player.velX = -player.speed;
    if (right) player.velX = player.speed;
    
    player.update();
    checkCollisions();
    camera.follow(player);
    
    // Отрисовка с учётом камеры
    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    
    // Платформы
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
    
    // Ловушки
    traps.forEach(trap => {
        ctx.fillStyle = trap.color;
        ctx.fillRect(trap.x, trap.y, trap.width, trap.height);
    });
    
    // Враги
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
    
    // Игрок
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    ctx.restore();
    
    requestAnimationFrame(gameLoop);
}

gameLoop();
// ===== ГЕНЕРАЦИЯ УРОВНЯ =====
let lastPlatformX = 0;
let levelLength = 5000; // Длина уровня (можно увеличивать)
let difficulty = 0;

function generatePlatforms() {
    while (lastPlatformX < player.x + levelLength) {
        const platformWidth = 50 + Math.random() * 100;
        const gap = 100 + Math.random() * 200 - difficulty * 10; // Уже щели
        const heightVariation = Math.random() * 100 - 50;
        
        platforms.push({
            x: lastPlatformX + gap,
            y: 400 + heightVariation,
            width: platformWidth,
            height: 20,
            color: `hsl(${Math.random() * 120 + 100}, 70%, 50%)`
        });
        
        // Ловушки (чем дальше, тем чаще)
        if (Math.random() > 0.7 - difficulty * 0.01) {
            traps.push({
                x: lastPlatformX + gap + 10,
                y: 480,
                width: 30,
                height: 20,
                color: '#FF0000'
            });
        }
        
        // Враги (на высоких платформах)
        if (heightVariation < -20 && Math.random() > 0.8) {
            enemies.push({
                x: lastPlatformX + gap + 20,
                y: 380 + heightVariation,
                width: 30,
                height: 30,
                speed: 2 + difficulty * 0.05,
                dir: 1,
                color: '#FF0000',
                update: function() {
                    this.x += this.speed * this.dir;
                    if (this.x > this.startX + 50 || this.x < this.startX - 50) this.dir *= -1;
                },
                startX: lastPlatformX + gap + 20
            });
        }
        
        lastPlatformX += gap + platformWidth;
    }
}

// ===== ПАРАЛЛАКС-ФОН =====
const layers = [];
for (let i = 0; i < 3; i++) {
    layers.push({
        speed: 0.2 + i * 0.3,
        elements: []
    });
}

function generateBackground() {
    layers.forEach(layer => {
        layer.elements = [];
        for (let j = 0; j < 10; j++) {
            layer.elements.push({
                x: j * 500,
                y: Math.random() * 200 + 100,
                width: 100,
                height: 100,
                color: `rgba(100, 150, 200, ${0.2 + layer.speed * 0.2})`
            });
        }
    });
}

// ===== ОБНОВЛЁННЫЙ ИГРОВОЙ ЦИКЛ =====
let score = 0;

function gameLoop() {
    // Генерация новых участков
    if (player.x > lastPlatformX - 1000) {
        generatePlatforms();
    }
    
    // Удаление пройденных объектов (оптимизация)
    platforms = platforms.filter(p => p.x + p.width > player.x - 500);
    traps = traps.filter(t => t.x + t.width > player.x - 500);
    enemies = enemies.filter(e => e.x + e.width > player.x - 500);
    
    // Обновление сложности
    difficulty = Math.floor(player.x / 1000);
    document.getElementById('score').textContent = `${Math.floor(player.x / 10)} м (Ур. ${difficulty + 1})`;
    
    // ... остальной код рендеринга ...
    
    // Отрисовка фона
    ctx.save();
    layers.forEach(layer => {
        layer.elements.forEach(el => {
            const x = (el.x - camera.x * layer.speed) % 5000;
            ctx.fillStyle = el.color;
            ctx.fillRect(x, el.y, el.width, el.height);
        });
    });
    ctx.restore();
    
    requestAnimationFrame(gameLoop);
}

// Инициализация
generateBackground();
generatePlatforms();
gameLoop();
