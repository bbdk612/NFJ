"use strict";
const score = document.querySelector(".score"),
	start = document.querySelector(".start"),
	gameArea = document.querySelector(".gameArea"),
    car = document.createElement('div');
car.classList.add('car');

const keys = {
	ArrowUp: false,
	ArrowDown: false,
	ArrowRight: false,
	ArrowLeft: false,
};

const setting = {
	start: false,
	score: 0,
	speed: 3,
	traffic: 3,
};

function getQuantityElements(heightElement) {
	return document.documentElement.clientHeight / heightElement + 1;
}

function startGame() {
	start.classList.add("hide");

	for (let i = 0; i < getQuantityElements(100); i++ ){
		const line = document.createElement('div');
		line.classList.add('line');
		line.style.top = (i * 75) + 'px';
		line.y = i * 100
		gameArea.appendChild(line);
	}

	for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++){
		const enemy = document.createElement('div');
		enemy.classList.add('enemy');
		enemy.y = -100 * setting.traffic * (i + 1);
		enemy.style.top = enemy.y + 'px';
		enemy.style.background = "transparent url('./img/enemy2.png') center / cover no-repeat";
		gameArea.appendChild(enemy);
	}

	setting.start = true;
    gameArea.appendChild(car);
	setting.x = car.offsetLeft;
	setting.y = car.offsetTop;
	requestAnimationFrame(playGame);
}

function playGame() {
	// console.log("Play game!");
	if (setting.start) {
		moveRoad();
		moveEnemy();
		if (keys.ArrowLeft && setting.x > 0){
			setting.x -= setting.speed;
		}
		if (keys.ArrowRight && setting.x < 250){
			setting.x += setting.speed;
		}
		if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - 110)){
			setting.y += setting.speed;
		}
		if (keys.ArrowUp && setting.y > 0){
			setting.y -= setting.speed;
		}
		car.style.left = setting.x + 'px';
		car.style.top = setting.y + 'px';
		requestAnimationFrame(playGame);
	}
}

function startRun(event) {
	event.preventDefault();
	keys[event.key] = true;
	console.log(keys);
}

function stopRun(event) {
	event.preventDefault();
	keys[event.key] = false;
}

function moveRoad(){
	let lines = document.querySelectorAll('.line');
	lines.forEach(function (line) {
		line.y += setting.speed;
		line.style.top = line.y + 'px';

		if (line.y >= document.documentElement.clientHeight){
			line.y = -100;
		}
	});
}
function moveEnemy(){
	let enemys = document.querySelectorAll('.enemy');
	enemys.forEach(function (enemy) {
		enemy.y += setting.speed / 2;
		enemy.style.top = enemy.y + 'px';

		if (enemy.y >= document.documentElement.clientHeight){
			enemy.y = -100 * setting.traffic;
			enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px'

		}
	});
}
start.addEventListener("click", startGame);

document.addEventListener("keydown", startRun);
document.addEventListener("keyup", stopRun);
