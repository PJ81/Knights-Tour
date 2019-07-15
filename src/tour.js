//--------------------------------------------------------------
// knight's tour by PJ81
//--------------------------------------------------------------
// constants
const count = 32,
	size = Math.floor(800 / count),
	width = count * size,
	height = width,
	knight = "\u2658";

// variables
let ctx = null,
	knightX, knightY, step = 0,
	textFoot,
	lastTime = 0,
	delay = 0,
	directions = [],
	visited = [],
	path = [];


function drawVisited() {
	if (path.length < 1) return;

	let s = step / 2,
		a, b;

	ctx.lineWidth = 3;
	ctx.fillStyle = "black";
	ctx.beginPath();
	ctx.moveTo(step * knightX + s, step * knightY + s);

	for (let v = path.length - 1; v > -1; v--) {
		a = path[v].x * step + s;
		b = path[v].y * step + s;
		ctx.lineTo(a, b);
		ctx.stroke();
		ctx.fillRect(a - 5, b - 5, 10, 10);
	}
}

function drawBoard() {
	let a = false;
	for (let y = 0; y < height; y += step) {
		for (let x = 0; x < width; x += step) {
			if (a) {
				ctx.fillStyle = "#007acc";
			} else {
				ctx.fillStyle = "#e6f5ff";
			}
			a = !a;
			ctx.fillRect(x, y, x + step, y + step);
		}
		if (!(count & 1)) a = !a;
	}
	drawVisited();
}

function moveSorter(a, b) {
	return b.len - a.len;
}

// create all possible moves from x, y
function createMoves(x, y) {
	let possibles = [];
	let a = 0,
		b = 0;
	for (let m = 0; m < directions.length; m++) {
		a = x + directions[m].x;
		b = y + directions[m].y;
		if (a > -1 && a < count && b > -1 && b < count && !visited[a + b * count]) {
			possibles.push({
				x: a,
				y: b
			})
		}
	}
	return possibles;
}

function warnsdorff(x, y) {
	let possibles = createMoves(x, y);
	if (possibles.length < 1) return null;

	let moves = [];
	for (let p = 0; p < possibles.length; p++) {
		let ps = createMoves(possibles[p].x, possibles[p].y);
		moves.push({
			len: ps.length,
			x: possibles[p].x,
			y: possibles[p].y
		});
	}
	moves.sort(moveSorter);
	return moves;
}

function mainLoop(time = 0) {
	let dif = time - lastTime;
	lastTime = time;
	delay -= dif;
	if (delay > 0) {
		requestAnimationFrame(mainLoop);
		return;
	}

	delay = 100;
	drawBoard();
	ctx.fillStyle = "#000";
	ctx.fillText(knight, knightX * step, knightY * step + textFoot);

	let moves = warnsdorff(knightX, knightY);
	if (moves != null) {
		let move = moves.pop();
		visited[knightX + knightY * count] = true;
		path.push({
			x: knightX,
			y: knightY
		});
		knightX = move.x;
		knightY = move.y;
		requestAnimationFrame(mainLoop);
	} else {
		if (path.length == count * count - 1) {
			console.log("Tour finished!");
		} else {
			console.log("Need backtracking!");
		}
	}
}

function startTour() {
	knightX = Math.floor(Math.random() * count);
	knightY = Math.floor(Math.random() * count);

	for (let a = 0; a < count * count; a++) {
		visited.push(false);
	}

	mainLoop();
}

// initializes all program stuff
function init() {
	// canvas
	let canvas = document.createElement("canvas");
	canvas.id = "cv";
	canvas.width = width;
	canvas.height = height;
	ctx = canvas.getContext("2d");
	ctx.fillStyle = "#000";
	ctx.font = size + "px Arial";
	document.body.appendChild(canvas);

	// init moves array -> all 8 directions the knight can go
	directions.push({
		x: -1,
		y: -2
	});
	directions.push({
		x: -2,
		y: -1
	});
	directions.push({
		x: 1,
		y: -2
	});
	directions.push({
		x: 2,
		y: -1
	});
	directions.push({
		x: -1,
		y: 2
	});
	directions.push({
		x: -2,
		y: 1
	});
	directions.push({
		x: 1,
		y: 2
	});
	directions.push({
		x: 2,
		y: 1
	});

	// positioning vars
	step = width / count;
	textFoot = step - step / 8;

	// start
	startTour();
}