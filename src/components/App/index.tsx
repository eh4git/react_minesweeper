import React, { useState, useEffect } from "react";
import Button from "../Button";
import NumberDisplay from "../NumberDispaly";
import DifficultySettings from "../DifficultySettings";
import { generateCells, openMultipleCells } from "../../utils";
import { Cell, CellState, CellValue, Face } from "../../types";
import "./App.scss";

const App: React.FC = () => {
  const [totalRows, setTotalRows] = useState(19);
  const [totalColumns, setTotalColumns] = useState(19);
  const [totalBombs, setTotalBombs] = useState(70);
  const [difficulty, setDifficulty] = useState("easy");
  const [face, setFace] = useState<Face>(Face.Smile);
  const [time, setTime] = useState<number>(0);
  const [firstClick, setFirstClick] = useState<boolean>(true);
  const [live, setLive] = useState<boolean>(false);
  const [bombCounter, setBombCounter] = useState<number>(totalBombs);
  const [hasLost, setHasLost] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState(false);
  const [cells, setCells] = useState<Cell[][]>(
    generateCells(totalRows, totalColumns, totalBombs)
  );

  //  ------ In this file ------
  //Make a variable that holds the value of the current difficulty **
  // Make a variable that holds the number of rows **
  // Make a variable that holds the number of columns **
  // Make a variable that holds the number of bombs **
  // Replace the constants that are imported with the matching state that was created throughout the document
  // !!!!!!!! pass additional arguments to the functions inside of the utils file in order to remove the dependency on the old constants !!!!!!!!!!!!!!!!
  // Pass the difficulty and setDifficulty to the DifficultySetting component as props
  // Inside of a useEffect, that waits for changes in difficulty, create the logic to set the # of rows,cols, and bombs based on difficulty
  // Inside of a useEffect, that waits for changes in # of rows, cols, and bombs, create the logic to produces and sets the required style variable

  //  ------ In Difficulty Settings ------
  //inside of the DifficultySetting component create settings for easy medium hard expert and custom (checkboxes)
  // when custom setting is selected open three inputs for the user to enter # of cols, rows, & bombs
  // do not allow for the number of bombs to be greater than 80% of total tiles (cols*rows*.8)
  // if total bombs > than allowed tell the user "The max amount of bombs is " + cols*rows*.8

  useEffect(() => {
    const handleMouseDown = (e: any): void => {
      const { className } = e.target;
      if (className.includes("Button") && !className.includes("visible")) {
        setFace(Face.Oh);
      }
    };

    const handleMouseUp = (): void => {
      setFace(Face.Smile);
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (live && time < 999) {
      const timer = setInterval(() => {
        setTime(time + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [live, time]);

  useEffect(() => {
    if (hasLost) {
      setFace(Face.Lost);
      setLive(false);
    }
  }, [hasLost]);

  useEffect(() => {
    if (hasWon) {
      setFace(Face.Won);
    }
  }, [hasWon]);

  const handleCellClick = (
    rowParam: number,
    colParam: number,
    numberOfRows: number,
    numberOfColumns: number,
    numberOfBombs: number
  ) => (): void => {
    let newCells = cells.slice();
    console.log(newCells[rowParam][colParam]);
    //  ------Starting the Game on Click if there No Time & Always Open Multiple Cells on First Click------
    // !!!!!!!!!!! NOT WORKING AS EXPECTED !!!!!!!!!!!!!!!!!!
    if (!live) {
      setFirstClick(false);
      if (
        newCells[rowParam][colParam].value === CellValue.Bomb ||
        newCells[rowParam][colParam].value !== CellValue.None
      ) {
        let badStart = true;
        while (badStart) {
          console.log(badStart);
          newCells = generateCells(
            numberOfRows,
            numberOfColumns,
            numberOfBombs
          );
          if (newCells[rowParam][colParam].value === CellValue.None) {
            badStart = false;
            break;
          }
        }
      }
      setLive(true);
    }
    if (!firstClick) {
    }
    const currentCell = newCells[rowParam][colParam];

    //  ------If the Cell is Flagged or Visible Do Nothing------
    if ([CellState.Flagged, CellState.Visible].includes(currentCell.state)) {
      return;
    }

    //  ------Clicking on a Bomb Tile------
    if (currentCell.value === CellValue.Bomb) {
      setHasLost(true);
      newCells[rowParam][colParam].red = true;
      newCells = showAllBombs();
      setCells(newCells);
      return;
      //  ------Clicking on a Tile that is Empty------
    } else if (currentCell.value === CellValue.None) {
      newCells = openMultipleCells(
        newCells,
        rowParam,
        colParam,
        numberOfRows,
        numberOfColumns
      );
      //  ------Clicking on a Tile that has a Number------
    } else {
      newCells[rowParam][colParam].state = CellState.Visible;
      setCells(newCells);
    }

    //  ------Check if the Win Conditions Exist------
    let safeOpenCellsExist = false;
    for (let row = 0; row < numberOfRows; row++) {
      for (let col = 0; col < numberOfColumns; col++) {
        const currentCell = newCells[row][col];

        if (
          currentCell.value !== CellValue.Bomb &&
          currentCell.state === CellState.Open
        ) {
          safeOpenCellsExist = true;
          break;
        }
      }
    }

    if (!safeOpenCellsExist) {
      newCells = newCells.map((row) =>
        row.map((cell) => {
          if (cell.value === CellValue.Bomb) {
            return {
              ...cell,
              state: CellState.Flagged,
            };
          }
          return cell;
        })
      );
      setHasWon(true);
    }

    setCells(newCells);
  };

  // ------Right Clicking and Placing Flags------
  const handleCellContext = (rowParam: number, colParam: number) => (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();

    if (!live) {
      return;
    }

    const currentCells = cells.slice();
    const currentCell = cells[rowParam][colParam];

    if (currentCell.state === CellState.Visible) {
      return;
    } else if (currentCell.state === CellState.Open) {
      currentCells[rowParam][colParam].state = CellState.Flagged;
      setCells(currentCells);
      setBombCounter(bombCounter - 1);
    } else if (currentCell.state === CellState.Flagged) {
      currentCells[rowParam][colParam].state = CellState.Open;
      setCells(currentCells);
      setBombCounter(bombCounter + 1);
    }
  };

  const handleFaceClick = (
    numberOfRows: number,
    numberOfColumns: number,
    numberOfBombs: number
  ): void => {
    setLive(false);
    setTime(0);
    setBombCounter(numberOfBombs);
    setCells(generateCells(numberOfRows, numberOfColumns, numberOfBombs));
    setHasLost(false);
    setHasWon(false);
  };

  const renderCells = (
    numberOfRows: number,
    numberOfColumns: number,
    numberOfBombs: number
  ): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Button
          key={`${rowIndex}-${colIndex}`}
          state={cell.state}
          value={cell.value}
          onClick={() =>
            handleCellClick(
              rowIndex,
              colIndex,
              numberOfRows,
              numberOfColumns,
              numberOfBombs
            )
          }
          onContext={handleCellContext}
          red={cell.red}
          row={rowIndex}
          col={colIndex}
        />
      ))
    );
  };

  const showAllBombs = (): Cell[][] => {
    const currentCells = cells.slice();
    return currentCells.map((row) =>
      row.map((cell) => {
        if (cell.value === CellValue.Bomb) {
          return {
            ...cell,
            state: CellState.Visible,
          };
        }
        return cell;
      })
    );
  };

  return (
    <div>
      <DifficultySettings />
      <div className="App">
        <div className="Header">
          <NumberDisplay value={bombCounter} />
          <div
            className="Face"
            onClick={() => handleFaceClick(totalRows, totalColumns, totalBombs)}
          >
            <span role="img" aria-label="face">
              {face}
            </span>
          </div>
          <NumberDisplay value={time} />
        </div>
        <div
          className="Body"
          // style={{
          //   display: "grid",
          //   gridTemplateColumns: `1fr`,
          //   gridTemplateRows: "1fr",
          // }}
        >
          {renderCells(totalRows, totalColumns, totalBombs)}
        </div>
      </div>
    </div>
  );
};

export default App;
