// import { numberOfColumns, numberOfRows, NO_OF_BOMBS } from "../constants";
import { Cell, CellState, CellValue } from "../types";

const grabAllAdjacentCells = (
  cells: Cell[][],
  rowParam: number,
  colParam: number,
  numberOfRows: number,
  numberOfColumns: number
): {
  topLeftCell: Cell | null;
  topCell: Cell | null;
  topRightCell: Cell | null;
  leftCell: Cell | null;
  rightCell: Cell | null;
  bottomLeftCell: Cell | null;
  bottomCell: Cell | null;
  bottomRightCell: Cell | null;
} => {
  const topLeftCell =
    rowParam > 0 && colParam > 0 ? cells[rowParam - 1][colParam - 1] : null;
  const topCell = rowParam > 0 ? cells[rowParam - 1][colParam] : null;
  const topRightCell =
    rowParam > 0 && colParam < numberOfColumns - 1
      ? cells[rowParam - 1][colParam + 1]
      : null;
  const leftCell = colParam > 0 ? cells[rowParam][colParam - 1] : null;
  const rightCell =
    colParam < numberOfColumns - 1 ? cells[rowParam][colParam + 1] : null;
  const bottomLeftCell =
    rowParam < numberOfRows - 1 && colParam > 0
      ? cells[rowParam + 1][colParam - 1]
      : null;
  const bottomCell =
    rowParam < numberOfRows - 1 ? cells[rowParam + 1][colParam] : null;
  const bottomRightCell =
    rowParam < numberOfRows - 1 && colParam < numberOfColumns - 1
      ? cells[rowParam + 1][colParam + 1]
      : null;

  return {
    topLeftCell,
    topCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomLeftCell,
    bottomCell,
    bottomRightCell,
  };
};

export const generateCells = (
  numberOfRows: number,
  numberOfColumns: number,
  numberOfBombs: number
): Cell[][] => {
  let cells: Cell[][] = [];

  //  --------create all of the individual game tiles--------
  for (let row = 0; row < numberOfRows; row++) {
    cells.push([]);
    for (let col = 0; col < numberOfColumns; col++) {
      cells[row].push({
        value: CellValue.None,
        state: CellState.Open,
      });
    }
  }

  //  --------randomly place 10 bombs--------
  let bombsPlaced = 0;
  while (bombsPlaced < numberOfBombs) {
    //  picking a random row and col to place the bomb
    const randomRow = Math.floor(Math.random() * numberOfRows);
    const randomCol = Math.floor(Math.random() * numberOfColumns);

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
  for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
    for (let colIndex = 0; colIndex < numberOfColumns; colIndex++) {
      const currentCell = cells[rowIndex][colIndex];
      if (currentCell.value === CellValue.Bomb) {
        continue;
      }

      let numberOfBombsPlaced = 0;
      const {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell,
      } = grabAllAdjacentCells(
        cells,
        rowIndex,
        colIndex,
        numberOfRows,
        numberOfColumns
      );

      // (topLeftCell && topLeftCell.value === CellValue.Bomb) SAME AS BELOW
      if (topLeftCell?.value === CellValue.Bomb) {
        numberOfBombsPlaced++;
      }
      if (topCell?.value === CellValue.Bomb) {
        numberOfBombsPlaced++;
      }
      if (topRightCell?.value === CellValue.Bomb) {
        numberOfBombsPlaced++;
      }
      if (leftCell?.value === CellValue.Bomb) {
        numberOfBombsPlaced++;
      }
      if (rightCell?.value === CellValue.Bomb) {
        numberOfBombsPlaced++;
      }
      if (bottomLeftCell?.value === CellValue.Bomb) {
        numberOfBombsPlaced++;
      }
      if (bottomCell?.value === CellValue.Bomb) {
        numberOfBombsPlaced++;
      }
      if (bottomRightCell?.value === CellValue.Bomb) {
        numberOfBombsPlaced++;
      }

      if (numberOfBombsPlaced > 0) {
        cells[rowIndex][colIndex] = {
          ...currentCell,
          value: numberOfBombsPlaced,
        };
      }
    }
  }
  return cells;
};

export const openMultipleCells = (
  cells: Cell[][],
  rowParam: number,
  colParam: number,
  numberOfRows: number,
  numberOfColumns: number
): Cell[][] => {
  const currentCell = cells[rowParam][colParam];

  if (
    currentCell.state === CellState.Visible ||
    currentCell.state === CellState.Flagged
  ) {
    return cells;
  }

  let newCells = cells.slice();
  newCells[rowParam][colParam].state = CellState.Visible;

  const {
    topLeftCell,
    topCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomLeftCell,
    bottomCell,
    bottomRightCell,
  } = grabAllAdjacentCells(
    cells,
    rowParam,
    colParam,
    numberOfRows,
    numberOfColumns
  );

  if (
    topLeftCell?.state === CellState.Open &&
    topLeftCell.value !== CellValue.Bomb
  ) {
    if (topLeftCell.value === CellValue.None) {
      newCells = openMultipleCells(
        newCells,
        rowParam - 1,
        colParam - 1,
        numberOfRows,
        numberOfColumns
      );
    } else {
      newCells[rowParam - 1][colParam - 1].state = CellState.Visible;
    }
  }

  if (topCell?.state === CellState.Open && topCell.value !== CellValue.Bomb) {
    if (topCell.value === CellValue.None) {
      newCells = openMultipleCells(
        newCells,
        rowParam - 1,
        colParam,
        numberOfRows,
        numberOfColumns
      );
    } else {
      newCells[rowParam - 1][colParam].state = CellState.Visible;
    }
  }

  if (
    topRightCell?.state === CellState.Open &&
    topRightCell.value !== CellValue.Bomb
  ) {
    if (topRightCell.value === CellValue.None) {
      newCells = openMultipleCells(
        newCells,
        rowParam - 1,
        colParam + 1,
        numberOfRows,
        numberOfColumns
      );
    } else {
      newCells[rowParam - 1][colParam + 1].state = CellState.Visible;
    }
  }

  if (leftCell?.state === CellState.Open && leftCell.value !== CellValue.Bomb) {
    if (leftCell.value === CellValue.None) {
      newCells = openMultipleCells(
        newCells,
        rowParam,
        colParam - 1,
        numberOfRows,
        numberOfColumns
      );
    } else {
      newCells[rowParam][colParam - 1].state = CellState.Visible;
    }
  }

  if (
    rightCell?.state === CellState.Open &&
    rightCell.value !== CellValue.Bomb
  ) {
    if (rightCell.value === CellValue.None) {
      newCells = openMultipleCells(
        newCells,
        rowParam,
        colParam + 1,
        numberOfRows,
        numberOfColumns
      );
    } else {
      newCells[rowParam][colParam + 1].state = CellState.Visible;
    }
  }

  if (
    bottomLeftCell?.state === CellState.Open &&
    bottomLeftCell.value !== CellValue.Bomb
  ) {
    if (bottomLeftCell.value === CellValue.None) {
      newCells = openMultipleCells(
        newCells,
        rowParam + 1,
        colParam - 1,
        numberOfRows,
        numberOfColumns
      );
    } else {
      newCells[rowParam + 1][colParam - 1].state = CellState.Visible;
    }
  }

  if (
    bottomCell?.state === CellState.Open &&
    bottomCell.value !== CellValue.Bomb
  ) {
    if (bottomCell.value === CellValue.None) {
      newCells = openMultipleCells(
        newCells,
        rowParam + 1,
        colParam,
        numberOfRows,
        numberOfColumns
      );
    } else {
      newCells[rowParam + 1][colParam].state = CellState.Visible;
    }
  }

  if (
    bottomRightCell?.state === CellState.Open &&
    bottomRightCell.value !== CellValue.Bomb
  ) {
    if (bottomRightCell.value === CellValue.None) {
      newCells = openMultipleCells(
        newCells,
        rowParam + 1,
        colParam + 1,
        numberOfRows,
        numberOfColumns
      );
    } else {
      newCells[rowParam + 1][colParam + 1].state = CellState.Visible;
    }
  }

  return newCells;
};
