const gridContainer = document.querySelector(".tetris-grid");
const widthContainer = 10;
const heightContainer = 20;

const createGrids = (container, width, height) => {
  for (i = 1; i <= width*height; i++) {
    let gridChild = document.createElement("div");
    gridChild.style.width = `calc(100% / ${width})`;
    gridChild.style.height = `calc(100% / ${height})`;
    gridChild.classList.add("grid-children");
    container.appendChild(gridChild);
  }

  for (let i = 0; i < 10; i++) {
    let occupied = document.createElement("div");
    occupied.style.width = `calc(100% / ${width})`;
    occupied.style.height = `calc(100% / ${height})`;
    occupied.classList.add("occupied");
    container.appendChild(occupied);
  }
};

createGrids(gridContainer, widthContainer, heightContainer);

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


let squares = Array.from(document.querySelectorAll(".tetris-grid div"));
console.log(squares);

const theTetrominoes = [LBlock, JBlock, TBlock, OBlock, IBlock, SBlock, ZBlock];

let blockPosition = 4;
let currentRotation = 0;
let timerID;
let randomBlock = Math.floor(Math.random()*theTetrominoes.length);
let current = theTetrominoes[randomBlock][currentRotation];

function drawBlock() {
  current.forEach(index => {
    squares[blockPosition + index].classList.add('tetromino');
  })
}

function undrawBlock() {
  current.forEach(index => {
    squares[blockPosition + index].classList.remove('tetromino');
  })
}


drawBlock();
// stopBlock();
function moveDown() {
  undrawBlock();
  blockPosition = blockPosition + width;
  drawBlock();
  stopBlock();
}

function stopBlock() {
  console.log(blockPosition + width);
  if (current.some(index => squares[blockPosition + index + width].classList.contains("occupied"))) {
    current.forEach(index => squares[blockPosition + index].classList.add('occupied'))
  
    randomBlock = Math.floor(Math.random() * theTetrominoes.length)
    current = theTetrominoes[randomBlock][currentRotation]
    blockPosition = 4;
    drawBlock();
  }
}

// timerID = setInterval(moveDown, 1000);

let counter = 0;
document.addEventListener('keyup', (e) => {
  console.log("Up");
  if (e.key === 'ArrowUp') {
    if (counter >= 3) {
      counter = 0;
      currentRotation = 0;
    } else {
      counter+=1;
      currentRotation += 1;
    }
    undrawBlock()
    current = theTetrominoes[randomBlock][currentRotation];
    drawBlock();
  }

  if (e.key === 'ArrowLeft') {
    console.log("Left");
  }

  // if (e.key === 'ArrowRight') {
  //   console.log("Right");
  // }

  if (e.code === "Space") {
    while (blockPosition < 164) {
      blockPosition+=10; 
    }
    undrawBlock()
    drawBlock()
    console.log("hey")
  }
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    moveDown();
  }
})