// canvas
const canvas = document.getElementById('canvas');
let canvasWidth = 700;
let canvasHeight = 600;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
const ctx = canvas.getContext('2d');

// play mode
const singlePlayerButton = document.querySelector('.single-player-button');
const multiPlayerButton = document.querySelector('.multi-player-button');
let playMode = "singleplayer";

singlePlayerButton.addEventListener('click', () => {
    if (playMode === 'singleplayer') return;
    playMode = 'singleplayer';
    singlePlayerButton.classList.add('active');
    multiPlayerButton.classList.remove('active');
    startMessage.style.display = 'flex';
    isRunning = false;
    resetGame();
    difficultyDiv.classList.add('usable');
});
multiPlayerButton.addEventListener('click', () => {
    if (playMode === 'multiplayer') return;
    playMode = 'multiplayer';
    multiPlayerButton.classList.add('active');
    singlePlayerButton.classList.remove('active'); 
    startMessage.style.display = 'flex';
    isRunning = false;
    resetGame();
    difficultyDiv.classList.remove('usable');
});

// difficulty
const difficultyDiv = document.querySelector('.difficulty'); 
const easyButton = document.querySelector('.easy-button');
const mediumButton = document.querySelector('.medium-button');
const hardButton = document.querySelector('.hard-button');

let difficulty = 'medium';

easyButton.addEventListener('click', () => {
    if (difficulty === 'easy') return;
    difficulty = 'easy';
    easyButton.classList.add('active');
    mediumButton.classList.remove('active');
    hardButton.classList.remove('active');
    startMessage.style.display = 'flex';
    isRunning = false;
    resetGame();
});

mediumButton.addEventListener('click', () => {
    if (difficulty === 'medium') return;
    difficulty = 'medium';
    mediumButton.classList.add('active');
    easyButton.classList.remove('active');
    hardButton.classList.remove('active');
    startMessage.style.display = 'flex';
    isRunning = false;
    resetGame();
});

hardButton.addEventListener('click', () => {
    if (difficulty === 'hard') return;
    difficulty = 'hard';
    hardButton.classList.add('active');
    easyButton.classList.remove('active');
    mediumButton.classList.remove('active');
    startMessage.style.display = 'flex';
    isRunning = false;
    resetGame();
});

// players
let playerWidth = 10;
let playerHeight = 100;
let playerSpeed = 10;
const p1ScoreElement = document.querySelector('.p1-score');
const p2ScoreElement = document.querySelector('.p2-score');
let player1Score = 0;
let player2Score = 0;

const player1 = {
    x: 5,
    y: canvasHeight / 2 - playerHeight / 2,
    width: playerWidth,
    height: playerHeight,
    velocity: playerSpeed,
};

const player2 = {
    x: canvasWidth - playerWidth - 5,
    y: canvasHeight / 2 - playerHeight / 2,
    width: playerWidth,
    height: playerHeight,
    velocity: playerSpeed,
};

// draw players
function drawPlayers() {
    ctx.fillStyle = 'skyblue';
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
}

// move players
const keys = {}; // pressed keys

document.addEventListener('keydown', (e) => {
    keys[e.code] = true; // key pressed
});
document.addEventListener('keyup', (e) => {
    keys[e.code] = false; // key released
});

function updateAI(deltaTime) {
    // AI Parameter
    let aiSpeed = playerSpeed; // Movement Speed
    let errorMargin;  // Error not following the ball
    let offsetRange; // Unprecise Aim

    if (difficulty === 'easy') {
        errorMargin = 0.2;
        offsetRange = 20; 
    } else if (difficulty === 'medium') {
        errorMargin = 0.16;
        offsetRange = 13;
    } else if (difficulty === 'hard') {
        errorMargin = 0.15;
        offsetRange = 8;
    }

    // Calculate random error depending on errorMargin
    const makeError = Math.random() < errorMargin; 

    // Only move if no error occured 
    if (!makeError) {
        const offset = (Math.random() - 0.5) * offsetRange; // calculates random offset depending on offsetRange
        const targetY = ball.y + offset;

        // Follow the Ball (targetY)
        // DeltaTime einrechnen, damit Bewegung zeitbasiert ist
        const movement = aiSpeed * deltaTime;
        if (targetY > player2.y + player2.height / 2) {
            player2.y += movement; // Move KI down
        } else if (targetY < player2.y + player2.height / 2) {
            player2.y -= movement; // Move KI up
        }
    }
}


function updatePlayers(deltaTime) {
    const movement = player1.velocity * deltaTime;
    // player 1
    if (keys['KeyW']) {
        player1.y -= movement;
    }
    if (keys['KeyS']) {
        player1.y += movement;
    }

    // collision with top and bottom walls
    if (player1.y < 0) {
        player1.y = 0;
    }
    if (player1.y > canvasHeight - player1.height) {
        player1.y = canvasHeight - player1.height;
    }

    // player 2
    if (playMode === 'singleplayer') {
        updateAI(deltaTime);  // let AI control player 2
    }
    if (playMode === 'multiplayer') {
        const movement2 = player2.velocity * deltaTime;
        if (keys['ArrowUp']) {
            player2.y -= movement2;
        }
        if (keys['ArrowDown']) {
            player2.y += movement2;
        }
    }

    // collision with top and bottom walls
    if (player2.y < 0) {
        player2.y = 0;
    }
    if (player2.y > canvasHeight - player2.height) {
        player2.y = canvasHeight - player2.height;
    }
}

// ball
const ball = {
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    radius: 10,
    dx: 300, // Pixel pro Sekunde (Beispielwert)
    dy: 300, // Pixel pro Sekunde (Beispielwert)
};

// draw ball
function drawBall() {
    ctx.fillStyle = 'rgb(213, 52, 52)';
    ctx.beginPath(); // start drawing
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2); // x, y, radius, startAngle, endAngle
    ctx.fill(); // fill the circle
    ctx.closePath(); // end drawing
}

// move ball
function moveBall(deltaTime) {
    // Multiplikation mit deltaTime, um zeitabhängige Bewegung zu erreichen.
    ball.x += ball.dx * deltaTime;
    ball.y += ball.dy * deltaTime;

    // collision with top and bottom walls
    if (ball.y + ball.radius > canvasHeight || ball.y - ball.radius < 0) {
        ball.dy *= -1; // reverse direction
    }

     // collision with player 1
     if (
        ball.x - ball.radius < player1.x + player1.width && 
        ball.y > player1.y && 
        ball.y < player1.y + player1.height
    ) {
        ball.dx *= -1; // reverse direction
        ball.x = player1.x + player1.width + ball.radius;
        increaseSpeed();
    }

    // collision with player 2
    if (
        ball.x + ball.radius > player2.x && 
        ball.y > player2.y && 
        ball.y < player2.y + player2.height
    ) {
        ball.dx *= -1; // reverse direction
        ball.x = player2.x - ball.radius;
        increaseSpeed();
    }

    // ball out of bounds
    if (ball.x - ball.radius < 0) {
        player2Score++; // player 2 scores
        p2ScoreElement.textContent = player2Score; // update score
        resetBall();
    }
    if (ball.x + ball.radius > canvasWidth) {
        player1Score++; // player 1 scores
        p1ScoreElement.textContent = player1Score; // update score
        resetBall();
    }
}

// increase ball speed
function increaseSpeed() {
    let speedMultiplier = 1.4; // increase speed
    ball.dx *= speedMultiplier;
    ball.dy *= speedMultiplier;

    const initialSpeed = getBallSpeed(); 
    const maxSpeed = initialSpeed * 1.8;
    
    // Begrenze die Ballgeschwindigkeit
    if (Math.abs(ball.dx) > maxSpeed) {
        ball.dx = Math.sign(ball.dx) * maxSpeed;
    } 
    if (Math.abs(ball.dy) > maxSpeed) {
        ball.dy = Math.sign(ball.dy) * maxSpeed;
    }
}

let isRunning = false;
let lastTimestamp = 0; // letzter Zeitstempel

// game loop
function gameLoop(timestamp) {
    if (!isRunning) return; // pause game

    // deltaTime in Sekunden umrechnen
    const deltaTime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight); // clear canvas
    updatePlayers(deltaTime); // update players
    drawPlayers(); // draw players
    drawBall();    // draw ball
    moveBall(deltaTime);    // move ball
    checkWinner(); // check winner

    requestAnimationFrame(gameLoop); // loop
}

function getBallSpeed() {
    const baseBallSpeed = 300;
    const minBallSpeed = 180;
    return Math.max(baseBallSpeed * (canvasWidth / 700), minBallSpeed);
}

// reset ball
function resetBall() {
    // center
    ball.x = canvasWidth / 2;
    ball.y = canvasHeight / 2;

    // reset speed 
    const speed = getBallSpeed();
    
    // random angle
    let angle;
    do {
        angle = Math.random() * Math.PI * 2;
    } while (Math.abs(Math.cos(angle)) < 0.3);
    ball.dx = Math.cos(angle) * speed;
    ball.dy = Math.sin(angle) * speed;
}

const winnerMessage = document.querySelector('.winner-message');
const winnerMessageText = document.querySelector('.winner-message-text');
const restartButton = document.querySelector('.restart-button');

// check winner
function checkWinner() {
    if (player1Score === 5) {
        winnerMessageText.textContent = 'Player 1 wins!';
        winnerMessage.style.display = 'flex';
        isRunning = false;
    } else if (player2Score === 5) {
        if (playMode === 'singleplayer') {
            winnerMessageText.textContent = 'Computer wins!';
        } else {
            winnerMessageText.textContent = 'Player 2 wins!';
        }
        winnerMessage.style.display = 'flex';
        isRunning = false;
    }
}

function resetGame() {
    player1Score = 0;
    player2Score = 0;
    p1ScoreElement.textContent = player1Score;
    p2ScoreElement.textContent = player2Score;
    player1.y = canvasHeight / 2 - playerHeight / 2;
    player2.y = canvasHeight / 2 - playerHeight / 2;
    resetBall();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawPlayers();
    drawBall();
}

// restart game
restartButton.addEventListener('click', () => {
    resetGame();
    winnerMessage.style.display = 'none';
    isRunning = true;
    lastTimestamp = performance.now();
    requestAnimationFrame(gameLoop);
});

// pause game
let isPaused = true;

const pauseMessage = document.querySelector('.pause-message');
const resumeButton = document.querySelector('.resume-button');

const startMessage = document.querySelector('.start-message');

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (winnerMessage.style.display === 'flex'){
            restartButton.click();
            return;
        };
        if (startMessage.style.display === 'flex') {
            restartButton.click();
            startMessage.style.display = 'none';
            return;
        }
        isPaused = !isPaused;
        if (isPaused) {
            pauseMessage.style.display = 'flex';
            isRunning = false;
        } else {
            pauseMessage.style.display = 'none';
            isRunning = true;
            startMessage.style.display = 'none';
            lastTimestamp = performance.now();
            requestAnimationFrame(gameLoop);
        }
    }
});

resumeButton.addEventListener('click', () => {
    isPaused = false;
    isRunning = true;
    lastTimestamp = performance.now();
    requestAnimationFrame(gameLoop); 
    pauseMessage.style.display = 'none';
}); 

// media query
function resizeCanvas() {
    if (window.innerHeight < 770) {
        canvasWidth = 480;
        canvasHeight = 400;
    } else if (window.innerHeight < 850) {
        canvasWidth = 550;
        canvasHeight = 450;
    } else if (window.innerHeight < 930) {
        canvasWidth = 620;
        canvasHeight = 520;
    } else {
        canvasWidth = 700;
        canvasHeight = 600;
    }
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Statt vorheriger Berechnungen setzen wir die Geschwindigkeiten höher an.
    playerWidth = Math.round(canvasWidth / 70);
    playerHeight = Math.round(canvasHeight / 6);
    // Spieler sollte z.B. ca. einmal pro Sekunde die Höhe durchlaufen können.
    // Ist das zu schnell oder zu langsam, kann man es anpassen.
    playerSpeed = canvasHeight; 
    
    player1.width = playerWidth;
    player1.height = playerHeight;
    player1.velocity = playerSpeed;
    player2.width = playerWidth;
    player2.height = playerHeight;
    player2.velocity = playerSpeed;
    player2.x = canvasWidth - playerWidth - 5;

    ball.radius = Math.round(canvasWidth / 70);

    player1.y = canvasHeight / 2 - playerHeight / 2;
    player2.y = canvasHeight / 2 - playerHeight / 2;
    resetBall();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawPlayers();
    drawBall();
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
