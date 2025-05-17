const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Игрок
const player = {
    x: 50,
    y: canvas.height - 100,
    width: 30,
    height: 50,
    speed: 5,
    velX: 0,
    velY: 0,
    jumping: false,
    gravity: 0.4,
    color: '#FF5555'
};

// Платформы
const platforms = [
    { x: 0, y: canvas.height - 20, width: canvas.width, height: 20, color: '#00AA00' },
    { x: 200, y: canvas.height - 100, width: 100, height: 20, color: '#0099FF' },
    { x: 400, y: canvas.height - 150, width: 100, height: 20, color: '#FF9900' },
];

// Враги
const enemies = [
    { x: 300, y: canvas.height - 70, width: 30, height: 30, speed: 2, dir: 1, color: '#FF0000' }
];

// Управление (для мобильных)
let left = false, right = false;

document.getElementById('jumpBtn').addEventListener('touchstart', (e) => {
    if (!player.jumping) {
        player.velY = -12;
        player.jumping = true;
    }
    e.preventDefault();
});

// Виртуальный джойстик
const joystick = document.getElementById('joystick');
let joystickActive = false;
let joystickX = 0;

joystick.addEventListener('touchstart', (e) => {
    joystickActive = true;
    const touch = e.touches[0];
    joystickX = touch.clientX;
    e.preventDefault();
});

document.addEventListener('touchmove', (e) => {
    if (joystickActive) {
        const touch = e.touches[0];
        const diff = touch.clientX - joystickX;
        if (diff > 10) right = true, left = false;
        else if (diff < -10) left = true, right = false;
        else left = right = false;
        e.preventDefault();
    }
});

document.addEventListener('touchend', () => {
    joystickActive = false;
    left = right = false;
});

// Игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Движение игрока
    player.velX = 0;
    if (left) player.velX = -player.speed;
    if (right) player.velX = player.speed;
    
    player.x += player.velX;
    player.y += player.velY;
    player.velY += player.gravity;
    
    // Коллизия с платформами
    player.jumping = true;
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
        }
    });
    
    // Враги
    enemies.forEach(enemy => {
        enemy.x += enemy.speed * enemy.dir;
        if (enemy.x > 500 || enemy.x < 200) enemy.dir *= -1;
        
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // Коллизия с врагами
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            alert("Game Over!");
            player.x = 50;
            player.y = canvas.height - 100;
        }
    });
    
    // Отрисовка
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
    
    requestAnimationFrame(gameLoop);
}

gameLoop();
