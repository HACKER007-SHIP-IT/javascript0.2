// Obtener el canvas y su contexto
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Variables del juego
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

// Posiciones iniciales
let player1Y = canvas.height / 2 - paddleHeight / 2;
let player2Y = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;

// Velocidades
let ballSpeedX = 4;
let ballSpeedY = 4;
let paddleSpeed = 6;

// Controles
let upPressed = false;
let downPressed = false;
let wPressed = false;
let sPressed = false;

// Marcadores
let player1Score = 0;
let player2Score = 0;
const maxScore = 7;

// Sonidos
const hitSound = new Audio('sounds/hit.mp3');
const scoreSound = new Audio('sounds/score.mp3');
const gameOverSound = new Audio('sounds/gameover.mp3');

// Destellos
let player1Hit = false;
let player2Hit = false;

// Función para reproducir un sonido
function playSound(sound) {
  sound.currentTime = 0; // Reiniciar el sonido
  sound.play();
}

// Dibujar elementos
function drawPaddle(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall(x, y) {
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x, y, ballSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

function drawNet() {
  ctx.strokeStyle = '#fff';
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.closePath();
}

function drawScore() {
  ctx.font = '30px Arial';
  ctx.fillStyle = '#ff0000'; // Rojo para Player 1
  ctx.fillText(`Player 1: ${player1Score}`, 50, 40);
  ctx.fillStyle = '#00ff00'; // Verde para Player 2
  ctx.fillText(`Player 2: ${player2Score}`, canvas.width - 160, 40);
}

// Movimiento de las paletas
function movePaddles() {
  if (wPressed && player1Y > 0) player1Y -= paddleSpeed;
  if (sPressed && player1Y < canvas.height - paddleHeight) player1Y += paddleSpeed;
  if (upPressed && player2Y > 0) player2Y -= paddleSpeed;
  if (downPressed && player2Y < canvas.height - paddleHeight) player2Y += paddleSpeed;
}

// Movimiento de la pelota
function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Colisión con las paredes superior e inferior
  if (ballY <= 0 || ballY >= canvas.height) {
    ballSpeedY *= -1;
    playSound(hitSound);
  }

  // Colisión con las paletas
  if (ballX <= paddleWidth && ballY >= player1Y && ballY <= player1Y + paddleHeight) {
    ballSpeedX *= -1;
    playSound(hitSound);
    player1Hit = true; // Activar destello
  } else if (ballX >= canvas.width - paddleWidth - ballSize && ballY >= player2Y && ballY <= player2Y + paddleHeight) {
    ballSpeedX *= -1;
    playSound(hitSound);
    player2Hit = true; // Activar destello
  }

  // Si la pelota sale del campo
  if (ballX <= 0 || ballX >= canvas.width) {
    resetBall();
    playSound(scoreSound);
  }
}

// Reiniciar la pelota
function resetBall() {
  if (ballX <= 0) {
    player2Score++; // Jugador 2 gana un punto
  } else if (ballX >= canvas.width) {
    player1Score++; // Jugador 1 gana un punto
  }

  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX *= -1; // Cambiar dirección
}

// Verificar si hay un ganador
function checkGameOver() {
  if (player1Score >= maxScore || player2Score >= maxScore) {
    playSound(gameOverSound);
    alert(`Game Over! ${player1Score > player2Score ? 'Player 1' : 'Player 2'} wins!`);
    resetGame();
  }
}

// Reiniciar el juego
function resetGame() {
  player1Score = 0;
  player2Score = 0;
  resetBall();
}

// Eventos del teclado
document.addEventListener('keydown', (e) => {
  if (e.key === 'w') wPressed = true;
  if (e.key === 's') sPressed = true;
  if (e.key === 'ArrowUp') upPressed = true;
  if (e.key === 'ArrowDown') downPressed = true;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'w') wPressed = false;
  if (e.key === 's') sPressed = false;
  if (e.key === 'ArrowUp') upPressed = false;
  if (e.key === 'ArrowDown') downPressed = false;
});

// Bucle principal del juego
function gameLoop() {
  // Limpiar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar elementos
  drawNet();
  drawPaddle(0, player1Y, player1Hit ? '#ff4500' : '#ff0000'); // Rojo con destello naranja
  drawPaddle(canvas.width - paddleWidth, player2Y, player2Hit ? '#32cd32' : '#00ff00'); // Verde con destello claro
  drawBall(ballX, ballY);
  drawScore();

  // Mover elementos
  movePaddles();
  moveBall();

  // Restablecer el destello después de un ciclo
  player1Hit = false;
  player2Hit = false;

  // Verificar si hay un ganador
  checkGameOver();

  // Repetir el bucle
  requestAnimationFrame(gameLoop);
}

// Iniciar el juego
gameLoop();