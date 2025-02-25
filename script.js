const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const heartsDisplay = document.getElementById('hearts');

let score = 0;
let hearts = 3;

// Pferd
const horseImg = new Image();
horseImg.src = 'horse.png';
const horse = {
    x: canvas.width / 2 - 25, // Pferd in der Mitte
    y: 300,
    width: 50,
    height: 50,
    yVelocity: 0,
    jumping: false
};

// Hindernis
const obstacleImg = new Image();
obstacleImg.src = 'obstacle.png';
const obstacles = [];

function spawnObstacle() {
    const obstacle = {
        x: canvas.width + 200,
        y: 300 - Math.random() * 50, // Zufällige Höhe
        width: 30 + Math.random() * 20, // Zufällige Breite
        height: 50 + Math.random() * 20, // Zufällige Höhe
        speed: 5
    };
    obstacles.push(obstacle);
}

// Steuerung
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !horse.jumping) {
        horse.yVelocity = -15;
        horse.jumping = true;
    }
    if (event.code === 'KeyR' && horse.jumping) {
        horse.yVelocity = 15; // Schneller runterfallen
    }
    if (event.code === 'ArrowRight') {
        horse.x += 5; // Schneller
    }
    if (event.code === 'ArrowDown') {
        // Ducken
        horse.height = 30;
        horse.y = 320;
    } else {
        horse.height = 50;
        horse.y = 300;
    }
});

document.addEventListener('keyup', function(event) {
    if (event.code === 'ArrowDown') {
        // Aufheben des Duckens
        horse.height = 50;
        horse.y = 300;
    }
});

function updateScore() {
    scoreDisplay.innerText = 'Punkte: ' + score;
}

function updateHearts() {
    heartsDisplay.innerHTML = '';
    for (let i = 0; i < hearts; i++) {
        const heartImg = document.createElement('img');
        heartImg.src = 'horse.png';
        heartImg.alt = 'Herz';
        heartImg.className = 'heart';
        heartsDisplay.appendChild(heartImg);
    }
}

// Game Loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Pferd updaten
    horse.y += horse.yVelocity;
    if (horse.y < 300) {
        horse.yVelocity += 0.5;
    } else {
        horse.y = 300;
        horse.yVelocity = 0;
        horse.jumping = false;
    }

    // Hindernisse updaten
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= obstacles[i].speed;

        // Kollisionserkennung
        if (horse.x < obstacles[i].x + obstacles[i].width &&
            horse.x + horse.width > obstacles[i].x &&
            horse.y < obstacles[i].y + obstacles[i].height &&
            horse.y + horse.height > obstacles[i].y) {
            // Kollision
            hearts--;
            updateHearts();
            obstacles.splice(i, 1);

            if (hearts <= 0) {
                // Game Over
                alert('Game Over!');
                resetGame();
            }
        }

        // Punkte
        if (obstacles[i].x < -obstacles[i].width) {
            score += 10;
            updateScore();
            obstacles.splice(i, 1);
        }
    }

    // Neue Hindernisse
    if (Math.random() < 0.01) {
        spawnObstacle();
    }

    // Zeichnen
    ctx.drawImage(horseImg, horse.x, horse.y, horse.width, horse.height);
    for (let i = 0; i < obstacles.length; i++) {
        ctx.drawImage(obstacleImg, obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
    }

    requestAnimationFrame(gameLoop);
}

function resetGame() {
    score = 0;
    hearts = 3;
    obstacles.length = 0;
    horse.x = canvas.width / 2 - 25;
    horse.y = 300;
    horse.jumping = false;
    updateScore();
    updateHearts();
}

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !horse.jumping) {
        horse.yVelocity = -15;
        horse.jumping = true;
    }
    if (event.code === 'KeyR' && horse.jumping) {
        horse.yVelocity = 15;
    }
    if (event.code === 'Enter') {
        resetGame();
    }
    if (event.code === 'ArrowRight') {
        horse.x += 5;
    }
    if (event.code === 'ArrowDown') {
        // Ducken
        horse.height = 30;
        horse.y = 320;
    }
});

document.addEventListener('keyup', function(event) {
    if (event.code === 'ArrowDown') {
        // Aufheben des Duckens
        horse.height = 50;
        horse.y = 300;
    }
});

updateScore();
updateHearts();
resetGame(); // Spiel beim Laden starten
gameLoop();
