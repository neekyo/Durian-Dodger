var canvas = document.getElementById('canvas');
canvas.width = 1280;
canvas.height = 700;
var ctx = canvas.getContext('2d');
let obstacles = [];
var cancelMe = '';
let difficulty = 10;
let id;
let dis = 0;
let miles = 0;
let gameRunning = false;
let paused = false;

function getScore() {
	let highScore = localStorage.getItem('highscore');
	console.log('highscore is ', highScore);
	document.getElementById('score').innerHTML = 'Highscore: ' + highScore + ' ft.';
}
getScore();

function saveScore(score) {
	let highScore;
	if (!isNaN(localStorage.getItem('highscore'))) {
		highScore = localStorage.getItem('highscore');
	} else {
		highScore = 0;
	}
	console.log(highScore);
	highScore = Math.max(score, highScore);
	localStorage.setItem('highscore', highScore);
}

var img = new Image();
img.src = './images/background.jpg';
img.onload = function() {
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};

var durianImg = new Image();
durianImg.src = './images/durian.png';

durianImg.onload;

var backgroundImage = {
	img: img,
	x: 0,
	speed: -1.5,

	move: function() {
		backgroundImage.x += this.speed;
		backgroundImage.x %= canvas.width;
		sprite.distance += 0.2;
	},

	draw: function() {
		ctx.drawImage(this.img, this.x, 0);
		if (this.speed < 0) {
			ctx.drawImage(this.img, this.x + canvas.width, 0);
		} else {
			ctx.drawImage(this.img, this.x - this.img.width, 0);
		}
	}
};

var timeFalling = 0;

function clamp(num, min, max) {
	return num <= min ? min : num >= max ? max : num;
}

var sprite = {
	name: 'Mr. Sprite',
	x: 2,
	y: 528,
	distance: 0,
	int: null,
	moveLeft: function() {
		sprite.x -= 30;
		sprite.x = clamp(this.x, 0, 1280);
		sprite.distance -= 30;
	},
	moveRight: function() {
		sprite.x += 30;
		sprite.x = clamp(this.x, 0, 1230);
		sprite.distance += 30;
	},
	moveUp: function() {
		if ((sprite.y = 528)) {
			sprite.y -= 70;
			this.beginFall();
		}
	},

	beginFall: function() {
		clearInterval(this.int);
		timeFalling = 0;
		this.int = setInterval(function() {
			timeFalling = timeFalling + 1;
		}, 10);
	},
	draw: function() {
		spriteImg = new Image();
		spriteImg.src = './images/sprite.png';
		ctx.drawImage(spriteImg, sprite.x, sprite.y, 50, 60);
	},
	fall: function() {
		if (this.y < 528) {
			this.y += 9.8 * timeFalling / 150;
		} else {
			clearInterval(this.int);
			this.y = 528;
		}
	}
};

class obstacle {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	fall() {
		if (this.y < 528) {
			this.y++;
		}
	}
}

document.onkeydown = function(e) {
	switch (e.keyCode) {
		case 80:
			if (gameRunning) {
				paused = !paused;
				startGameButton.value = paused ? 'Resume' : 'Pause';
				console.log('Paused');
			}
			break;
		case 37:
		case 65:
			sprite.moveLeft();
			console.log('Left', sprite);
			break;
		case 38:
		case 87:
		case 32:
			sprite.moveUp();
			console.log('Up', sprite);
			break;
		case 39:
		case 68:
			sprite.moveRight();
			console.log('Right', sprite);
			break;
	}
};

function checkCollision(obstacle) {
	if (obstacle.y + 60 > sprite.y && obstacle.y < sprite.y + 60) {
		if (obstacle.x + 50 < sprite.x + 50 && obstacle.x + 50 > sprite.x) {
			console.log('Collision');
			gameOver();
		} else if (obstacle.x < sprite.x + 41 && obstacle.x > sprite.x) {
			console.log('Collision');
			gameOver();
		}
	}
}

function updateCanvas() {
	if (paused) {
		return;
	}

	backgroundImage.move();

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	backgroundImage.draw();

	dis++;
	if (dis % 20 == 0) {
		miles++;
	}
	ctx.fillStyle = '#606060';
	ctx.fillText('Distance Traversed: ' + miles + ' ft.', 540, 40);
	sprite.draw();
	sprite.fall();

	if (dis % 40 == 0) {
		obstacles.push(randomObstacle());
	}

	for (let i = 0; i < obstacles.length; i++) {
		obstacles[i].draw();
		obstacles[i].fall();

		checkCollision(obstacles[i]);

		if (obstacles[i].y > 520) obstacles.splice(i, 1);
	}
}

function startGame() {
	if (gameRunning) {
		paused = !paused;
		startGameButton.value = paused ? 'Resume' : 'Pause';
	} else {
		difficulty = Number(document.querySelector('#diffSelect').value);
		id = setInterval(updateCanvas, difficulty);
		gameRunning = true;
		startGameButton.value = 'Pause';
		init();
		loop();
	}
}

var startGameButton = document.getElementById('startGameButton');
startGameButton.onclick = startGame;

function restartGame() {
	clearInterval(id);
	obstacles = [];
	var timeFalling = 0;
	sprite.x = 2;
	sprite.y = 528;
	sprite.distance = 0;
	sprite.int = null;
	dis = 0;
	miles = 0;
	fallSpeed = 1.0005;
	startGameButton.disabled = false;
	ctx.fillStyle = 'white';
	ctx.font = '18px serif';
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	backgroundImage.draw();
	audio.pause();
	location.reload();
}

var retryGameButton = document.getElementById('retryGameButton');
retryGameButton.onlick = restartGame;

ctx.fillStyle = 'white';
ctx.font = '18px serif';

function randomObstacle() {
	let x = Math.random() * canvas.width;
	let y = 0;

	return new Durian(x, y);
}

let fallSpeed = 1.0003;

setInterval(function() {
	fallSpeed += 0.0008; // tweak this to change how quickly it increases in difficulty
	// console.log(fallSpeed);
}, 8000); // timer at which it gets harder

class Durian {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	draw() {
		ctx.drawImage(durianImg, this.x, this.y, 50, 60);
	}
	fall() {
		if (this.y < 528) this.y = (this.y + 1) ** fallSpeed;
		this.x -= 1.5;
	}
}

var hotbod = document.querySelector('body');

function doStuff() {
	hotbod.className += ' animate';
}

window.onload = function() {
	doStuff();
};

function gameOver() {
	clearInterval(id);
	ctx.fillStyle = '#606060';
	ctx.font = '70px Anton';
	ctx.fillText('GAME OVER', 430, 300);
	console.log('save ', miles);
	saveScore(miles);
	audio.pause();
	new Audio('sounds/game_over.wav').play();
}

function init() {
	audio = document.getElementById('audio');
	// add listener function to loop on end
	audio.addEventListener('ended', loop, false);
	// set animation on perpetual loop
	setInterval(animate);
}

function loop() {
	audio.play();
}
