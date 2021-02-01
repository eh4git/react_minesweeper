import { MAX_COLS, MAX_ROWS, NO_OF_BOMBS } from "../constants";
import { Cell, CellState, CellValue } from "../types";

export const generateCells = (): Cell[][] => {
  let cells: Cell[][] = [];

  //  --------create all of the individual game tiles--------
  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLS; col++) {
      cells[row].push({
        value: CellValue.None,
        state: CellState.Open,
      });
    }
  }

  //  --------randomly place 10 bombs--------
  let bombsPlaced = 0;
  while (bombsPlaced < NO_OF_BOMBS) {
    //  picking a random row and col to place the bomb
    const randomRow = Math.floor(Math.random() * MAX_ROWS);
    const randomCol = Math.floor(Math.random() * MAX_COLS);

    const currentCell = cells[randomRow][randomCol];
    //  check if the is already a bomb inside the cell
    if (currentCell.value !== CellValue.Bomb) {
      cells = cells.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (randomRow === rowIndex && randomCol === colIndex) {
            return {
              ...cell,
              value: CellValue.Bomb,
            };
          }

          return cell;
        })
      );
      bombsPlaced++;
    }
  }

  //  ------Calculate numbers for tiles touching bombs------
  for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
    for (let colIndex = 0; colIndex < MAX_COLS; colIndex++) {
      const currentCell = cells[rowIndex][colIndex];
      if (currentCell.value === CellValue.Bomb) {
        continue;
      }

      let numberOfBombs = 0;

      //video 2 37min
      const topLeftBomb =
        rowIndex > 0 && colIndex > 0 ? cells[rowIndex - 1][colIndex - 1] : null;
      const topBomb = rowIndex > 0 ? cells[rowIndex - 1][colIndex] : null;
      const topRightBomb =
        rowIndex > 0 && colIndex < MAX_COLS - 1
          ? cells[rowIndex - 1][colIndex + 1]
          : null;
      const leftBomb = colIndex > 0 ? cells[rowIndex][colIndex - 1] : null;
      const rightBomb =
        colIndex < MAX_COLS - 1 ? cells[rowIndex][colIndex + 1] : null;
      const bottomLeftBomb =
        rowIndex < MAX_ROWS - 1 && colIndex > 0
          ? cells[rowIndex + 1][colIndex - 1]
          : null;
      const bottomBomb =
        rowIndex < MAX_ROWS - 1 ? cells[rowIndex + 1][colIndex] : null;
      const bottomRightBomb =
        rowIndex < MAX_ROWS - 1 && colIndex < MAX_COLS - 1
          ? cells[rowIndex + 1][colIndex + 1]
          : null;

      // (topLeftBomb && topLeftBomb.value === CellValue.Bomb) SAME AS BELOW
      if (topLeftBomb?.value === CellValue.Bomb) {
        numberOfBombs++;
      }
      if (topBomb?.value === CellValue.Bomb) {
        numberOfBombs++;
      }
      if (topRightBomb?.value === CellValue.Bomb) {
        numberOfBombs++;
      }
      if (leftBomb?.value === CellValue.Bomb) {
        numberOfBombs++;
      }
      if (rightBomb?.value === CellValue.Bomb) {
        numberOfBombs++;
      }
      if (bottomLeftBomb?.value === CellValue.Bomb) {
        numberOfBombs++;
      }
      if (bottomBomb?.value === CellValue.Bomb) {
        numberOfBombs++;
      }
      if (bottomRightBomb?.value === CellValue.Bomb) {
        numberOfBombs++;
      }

      if (numberOfBombs > 0) {
        cells[rowIndex][colIndex] = {
          ...currentCell,
          value: numberOfBombs,
        };
      }
    }
  }
  return cells;
};
