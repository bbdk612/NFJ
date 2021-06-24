"use strict";
const score = document.querySelector(".score"),
	start = document.querySelector(".start"),
	lvl3 = document.querySelector('.lvl_1'),
	lvl2 = document.querySelector('.lvl_2'),
	lvl1 = document.querySelector('.lvl_3'),
	gameArea = document.querySelector(".gameArea"),
	car = document.createElement("div"),
	inMenu = document.createElement('audio'),
	inGame = document.createElement('audio'),
	crash = document.createElement('audio'),
	jungleWin = document.createElement('audio');
	
car.classList.add("car");

inMenu.autoplay = true;
inMenu.src = './audio/in_menu.wav';
inMenu.loop = true;
inMenu.volume = 0.5;
document.body.appendChild(inMenu);

crash.autoplay = false;
crash.src = './audio/crash.mp3';
crash.loop = false;

jungleWin.autoplay = false;
jungleWin.loop = false;
jungleWin.src = "./audio/jingle-win.wav";
// document.body.appendChild()

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

function chooseTraffic() {
	start.classList.add("hide");
	lvl1.classList.remove('hide');
	lvl2.classList.remove('hide');
	lvl3.classList.remove('hide');

}

function chooseLvl1() {
	setting.traffic = 3;
	startGame();
}

function chooseLvl2() {
	setting.traffic = 2;
	startGame();
}

function chooseLvl3() {
	setting.traffic = 1;
	startGame();
}

function startGame() {
	lvl1.classList.add('hide');
	lvl2.classList.add('hide');
	lvl3.classList.add('hide');
	gameArea.innerHTML = '';
	// inMenu.pause();
	// inGame.play();
	for (let i = 0; i < getQuantityElements(100); i++) {
		const line = document.createElement("div");
		line.classList.add("line");
		line.style.top = i * 75 + "px";
		line.y = i * 100;
		gameArea.appendChild(line);
	}
	for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
		const enemy = document.createElement("div");
		enemy.classList.add("enemy");
		enemy.y = -100 * setting.traffic * (i + 1);
		enemy.style.top = enemy.y + "px";
		enemy.style.background =
			"transparent url('./img/enemy2.png') center / cover no-repeat";
		gameArea.appendChild(enemy);
	}

	setting.score = 0;
	setting.start = true;
	gameArea.appendChild(car);
	car.style.left = ((gameArea.offsetWidth / 2) - (car.offsetWidth / 2)) + 'px';
	// console.log();
	car.style.top = 'auto';
    car.style.bottom = '10px';
	setting.x = car.offsetLeft;
	setting.y = car.offsetTop;
	requestAnimationFrame(playGame);
}

function playGame() {
	// console.log("Play game!");
	if (setting.start) {
		setting.score += setting.speed;
		score.innerHTML = "SCORE<br>" + setting.score;
		moveRoad();
		moveEnemy();
		if (keys.ArrowLeft && setting.x > 0) {
			setting.x -= setting.speed;
		}
		if (keys.ArrowRight && setting.x < 250) {
			setting.x += setting.speed;
		}
		if (keys.ArrowDown && setting.y < gameArea.offsetHeight - 110) {
			setting.y += setting.speed;
		}
		if (keys.ArrowUp && setting.y > 0) {
			setting.y -= setting.speed;
		}
		car.style.left = setting.x + "px";
		car.style.top = setting.y + "px";
		requestAnimationFrame(playGame);
	}
}

function startRun(event) {
	event.preventDefault();
	// console.log(event.key in keys);
	if (event.key in keys){
		keys[event.key] = true;
		// console.log(keys);
	}
}

function stopRun(event) {
	event.preventDefault();
	if (event.key in keys){
		keys[event.key] = false;
	}
}

function moveRoad() {
	let lines = document.querySelectorAll(".line");
	lines.forEach(function (line) {
		line.y += setting.speed;
		line.style.top = line.y + "px";

		if (line.y >= document.documentElement.clientHeight) {
			line.y = -100;
		}
	});
}



function moveEnemy() {
	let enemys = document.querySelectorAll(".enemy");

	

	enemys.forEach(function (enemy) {
		let carRect = car.getBoundingClientRect();
		//console.log("carRect: ", carRect);
		let enemyRect = enemy.getBoundingClientRect();
		//console.log("enemyRect: ", enemyRect);

		if (carRect.top <= enemyRect.bottom &&
			carRect.right >= enemyRect.left && 
			carRect.left <= enemyRect.right && 
			carRect.bottom >= enemyRect.top){
				crash.play();
				setting.start = false; 
				if (localStorage.getItem('the_best')){
					if (setting.score > localStorage.getItem('the_best')){
						localStorage.setItem('the_best', setting.score);
						let content = score.innerHTML;
						function backHtml() {
							score.innerHTML = content;
						}
						score.textContent = "Ты побил рекорд";

						setTimeout(backHtml, 2000);
					
				} else {
					localStorage.setItem('the_best', setting.score);
				}
				// console.warn('OH, NO!');
				start.classList.remove('hide');
				
				start.style.top = score.offsetHeight + "px";
				
		
			// inGame.pause();
			// inMenu.play();
			// console.log(start.style.top, score.offsetHeight);
		}}

		enemy.y += setting.speed / 2;
		enemy.style.top = enemy.y + "px";

		if (enemy.y >= document.documentElement.clientHeight) {
			enemy.y = -100 * setting.traffic;
			enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
		}
	} )
}

lvl1.addEventListener("click", chooseLvl1);
lvl2.addEventListener("click", chooseLvl2);
lvl3.addEventListener("click", chooseLvl3);

start.addEventListener('click', chooseTraffic);

document.addEventListener("keydown", startRun);
document.addEventListener("keyup", stopRun);
