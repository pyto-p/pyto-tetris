const gridContainer = document.querySelector(".tetris-grid");
const miniContainer = document.querySelector(".mini-grid");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const scoreBoard = document.getElementById("score");
const lvlBoard = document.getElementById("level");
const widthContainer = 10;
const heightContainer = 20;
const colors = [
  '#f94144',
  '#f3722c', 
  '#f8961e',
  '#f9c74f',
  '#90be6d',
  '#43aa8b',
  '#577590'
]
const createGrids = (container, width, height, name) => {
  for (i = 1; i <= width*height; i++) {
    let gridChild = document.createElement("div");
    gridChild.style.width = `calc(100% / ${width})`;
    gridChild.style.height = `calc(100% / ${height})`;
    gridChild.classList.add(name);
    container.appendChild(gridChild);
  }
};


createGrids(gridContainer, widthContainer, heightContainer, "grid-children");
createGrids(gridContainer, 10, 1, "occupied")
createGrids(miniContainer, 4, 4, "mini-grid-children")

const width = widthContainer;

const LBlock = [
  [1, width+1, width*2+1, width*2+2],
  [width+1, width+2, width+3, width*2+1],
  [1, 2, width+2, width*2+2],
  [width*2+1, width*2+2, width*2+3, width+3]
]

const JBlock = [
  [1, 2, width+1, width*2+1],
  [width, width+1, width+2, width*2+2],
  [2, width+2, width*2+2, width*2+1],
  [width, width*2, width*2+1, width*2+2]
]

const TBlock = [
  [1,width,width+1,width+2],
  [1,width+1,width+2,width*2+1],
  [width,width+1,width+2,width*2+1],
  [1,width,width+1,width*2+1]
]

const OBlock = [
  [0,1,width,width+1],
  [0,1,width,width+1],
  [0,1,width,width+1],
  [0,1,width,width+1]
]

const IBlock = [
  [1,width+1,width*2+1,width*3+1],
  [width,width+1,width+2,width+3],
  [1,width+1,width*2+1,width*3+1],
  [width,width+1,width+2,width+3]
]

const SBlock = [
  [0,width,width+1,width*2+1],
  [width+1, width+2,width*2,width*2+1],
  [0,width,width+1,width*2+1],
  [width+1, width+2,width*2,width*2+1]
]
const ZBlock = [
  [1, width+1, width, width*2],
  [width, width+1, width*2+1, width*2+2],
  [1, width+1, width, width*2],
  [width, width+1, width*2+1, width*2+2]
]

const theTetrominoes = [LBlock, JBlock, TBlock, OBlock, IBlock, SBlock, ZBlock];
const displaySquares = document.querySelectorAll('.mini-grid div')
const widthNB = 4
const displayIndex = 0
const nextTetrominoes = [
  [1, widthNB+1, widthNB*2+1, widthNB*2+2],
  [1, 2, widthNB+1, widthNB*2+1],
  [1+widthNB,widthNB*2,widthNB*2+1,widthNB*2+2],
  [0,1,widthNB,widthNB+1], 
  [1,widthNB+1,widthNB*2+1,widthNB*3+1],
  [0,widthNB,widthNB+1,widthNB*2+1], 
  [1, widthNB+1, widthNB, widthNB*2],
]

let nextRandom = 0;
let squares = Array.from(document.querySelectorAll(".tetris-grid div"));
let blockPosition = 4;
let currentRotation = 0;
let timerID;
let randomBlock = Math.floor(Math.random()*theTetrominoes.length);
let current = theTetrominoes[randomBlock][currentRotation];

function drawBlock() {
  current.forEach(index => {
    squares[blockPosition + index].classList.add('tetromino');
    squares[blockPosition + index].style.backgroundColor = colors[randomBlock]
  })
}

function undrawBlock() {
  current.forEach(index => {
    squares[blockPosition + index].classList.remove('tetromino');
    squares[blockPosition + index].style.backgroundColor = ''
  })
}

function stopBlock() {
  current.forEach(index => squares[blockPosition + index].classList.add('occupied'))
  randomBlock = nextRandom
  nextRandom = Math.floor(Math.random() * theTetrominoes.length)
  currentRotation = 0;
  current = theTetrominoes[randomBlock][currentRotation]
  blockPosition = 4;
  addScore();
  drawBlock();
  displayShape();
  gameOver();
}

function stopBlock2() {
  undrawBlock();
  const isAtLeftEdge = (current.some(index => (blockPosition + index) % width === 0));

  if (!isAtLeftEdge) {
    blockPosition -= 1;
  }
  
  if(current.some(index => squares[blockPosition + index].classList.contains('occupied'))) {
    blockPosition += 1;
  }
  drawBlock();
}

function stopBlock3() {
  undrawBlock();
  
  const isAtRightEdge = (current.some(index => (blockPosition + index) % width === width-1));

  if (!isAtRightEdge) {
    blockPosition += 1;
  }
  
  if(current.some(index => squares[blockPosition + index].classList.contains('occupied'))) {
    blockPosition -= 1;
  }
  drawBlock();
}

function isAtRight() {
  return current.some(index=> (blockPosition + index + 1) % width === 0)  
}

function isAtLeft() {
  return current.some(index=> (blockPosition + index) % width === 0)
}

function checkRotatedPosition(pos){
  pos = blockPosition
  if ((pos+1) % width < 4) {   
    if (isAtRight()){  
      blockPosition += 1
      checkRotatedPosition(pos) 
      }
  }
  else if (pos % width > 5) {
    if (isAtLeft()){
      blockPosition -= 1
      checkRotatedPosition(pos)
    }
  }
}

function moveDown() {
  if(!current.some(index => squares[blockPosition + index + widthContainer].classList.contains('occupied'))) {
    undrawBlock();
    blockPosition = blockPosition + width;
    drawBlock();
  } else {
    stopBlock();
  }
}

function rotateBlock() {
  undrawBlock();
  currentRotation++;
  if(currentRotation === current.length) {
    currentRotation = 0;
  }
  current = theTetrominoes[randomBlock][currentRotation]
  checkRotatedPosition();
  drawBlock();
}

// function dropBlock() {
//   undrawBlock()
//   while (!current.some(index => squares[blockPosition + index + width].classList.contains("occupied"))) {
//     moveDown()
//   }
//   drawBlock();
//   stopBlock();
// }

function displayShape() {
  displaySquares.forEach(square => {
    square.classList.remove('tetromino')
    square.style.backgroundColor = ''
  })
  nextTetrominoes[nextRandom].forEach( index => {
    displaySquares[displayIndex + index].classList.add('tetromino')
    displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
  })
}

var score = 0;
var speed = 1000;
var highScore = 100;
var level = 1;

function addScore() {
  for (let i = 0; i < 199; i +=widthContainer) {
    const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

    if(row.every(index => squares[index].classList.contains('occupied'))) {
      if (score >= highScore) {
        level += 1;
        highScore = highScore + 100;
        speed = speed - 100;
        clearInterval(timerID);
        timerID = setInterval(moveDown, speed);
      } else {
        score += 10;
      }
      scoreBoard.textContent = score;
      lvlBoard.textContent = level;
      row.forEach(index => {
        squares[index].classList.remove('occupied');
        squares[index].classList.remove('tetromino');
        squares[index].style.backgroundColor = '';
      })
      const squaresRemoved = squares.splice(i, widthContainer);
      squares = squaresRemoved.concat(squares);
      squares.forEach(cell => gridContainer.appendChild(cell));
    }
  }
}

// function levelUp(speed, highScore) {
//   highScore = highScore + 100;
//   speed = speed - 300;
//   clearInterval(timerID);
//   timerID = setInterval(moveDown, speed);
// }

function keyPresses(e) {
  if (e.key === 'ArrowUp') {
    rotateBlock()
  }

  if (e.key === 'ArrowLeft') {
    stopBlock2();
  }

  if (e.key === 'ArrowRight') {
    stopBlock3();
  }

  // if (e.code === "Space") {
  //   dropBlock();
  // }

  if (e.key === 'ArrowDown') {
    moveDown();
  }
}

function startPause() {
  if (timerID) {
    clearInterval(timerID)
    timerID = null;
    document.removeEventListener('keydown', keyPresses);
  } else {
    drawBlock()
    document.addEventListener('keydown', keyPresses);
    timerID = setInterval(moveDown, speed);
    
    const displaySquaresArray = [...displaySquares];
    if (displaySquaresArray.some(square => square.classList.contains('tetromino'))) {
      displayShape();
    } else {
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  }
}

function gameOver() {
  if(current.some(index => squares[blockPosition + index].classList.contains('occupied'))) {
    scoreBoard.textContent = 'end';
    clearInterval(timerID);
    document.removeEventListener('keydown', keyPresses);
    startBtn.removeEventListener('click', startPause);
  }
}


function resetGame() {
  for (let i = 0; i < 199; i +=widthContainer) {
    const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

    if(row.some(index => squares[index].classList.contains('tetromino'))) {
      row.forEach(index => {
        squares[index].classList.remove('occupied');
        squares[index].classList.remove('tetromino');
        squares[index].style.backgroundColor = ''
      })
    }
    
    displaySquares.forEach(square => {
      square.classList.remove('tetromino');
      square.style.backgroundColor = '';
    })

    clearInterval(timerID);
    document.addEventListener('keydown', keyPresses);
    startBtn.addEventListener('click', startPause);
    
    randomBlock = nextRandom;
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    currentRotation = 0;
    current = theTetrominoes[randomBlock][currentRotation];
    blockPosition = 4;
    // drawBlock()

    highScore = 100;
    score = 0;
    scoreBoard.textContent = score;
    level = 1;
    lvlBoard.textContent = level;
    speed = 1000;
  }
}

startBtn.addEventListener('click', startPause);

resetBtn.addEventListener('click', () => {
  resetGame();
  startPause();
})