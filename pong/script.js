// script.js

// Variables del marcador
let player1Score = 0;
let player2Score = 0;

function drawScore() {
  ctx.font = '24px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText(`Player 1: ${player1Score}`, 50, 30); // Puntaje del jugador 1
  ctx.fillText(`Player 2: ${player2Score}`, canvas.width - 150, 30); // Puntaje del jugador 2
}


//


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


//


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


//


function movePaddles() {
  if (wPressed && player1Y > 0) player1Y -= paddleSpeed;
  if (sPressed && player1Y < canvas.height - paddleHeight) player1Y += paddleSpeed;
  if (upPressed && player2Y > 0) player2Y -= paddleSpeed;
  if (downPressed && player2Y < canvas.height - paddleHeight) player2Y += paddleSpeed;
}

function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Colisión con las paredes superior e inferior
  if (ballY <= 0 || ballY >= canvas.height) {
    ballSpeedY *= -1;
  }

  // Colisión con las paletas
  if (
    (ballX <= paddleWidth && ballY >= player1Y && ballY <= player1Y + paddleHeight) ||
    (ballX >= canvas.width - paddleWidth - ballSize && ballY >= player2Y && ballY <= player2Y + paddleHeight)
  ) {
    ballSpeedX *= -1;
  }

  // Si la pelota sale del campo
  if (ballX <= 0 || ballX >= canvas.width) {
    resetBall();
  }
}

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


//


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


//


function gameLoop() {
  // Limpiar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar elementos
  drawNet();
  drawPaddle(0, player1Y, '#fb6542'); // Jugador 1
  drawPaddle(canvas.width - paddleWidth, player2Y, '#00ff00'); // Jugador 2
  drawBall(ballX, ballY);
  drawScore(); // Dibujar el marcador

  // Mover elementos
  movePaddles();
  moveBall();

  // Repetir el bucle
  requestAnimationFrame(gameLoop);
}

// Iniciar el juego
gameLoop();

