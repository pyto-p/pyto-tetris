const gridContainer = document.querySelector(".tetris-grid");
const widthContainer = 10;
const heightContainer = 20;
let squares;

const createGrids = (container, width, height) => {
  for (i = 1; i <= width*height; i++) {
    let gridChild = document.createElement("div");
    gridChild.style.width = `calc(100% / ${width})`;
    gridChild.style.height = `calc(100% / ${height})`;
    gridChild.classList.add("grid-children");
    container.appendChild(gridChild);
  }
};

createGrids(gridContainer, widthContainer, heightContainer);