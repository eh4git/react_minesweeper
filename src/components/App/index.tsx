import React, { useState, useEffect } from "react";
import Button from "../Button";
import NumberDisplay from "../NumberDispaly";
import DifficultySettings from "../DifficultySettings";
import { generateCells, openMultipleCells } from "../../utils";
import { Cell, CellState, CellValue, Face } from "../../types";
import "./App.scss";
const { REACT_APP_MY_ENV } = process.env;
const App: React.FC = () => {
  const [totalRows, setTotalRows] = useState(18);
  const [totalColumns, setTotalColumns] = useState(24);
  const [totalBombs, setTotalBombs] = useState(65);
  const [difficulty, setDifficulty] = useState("hard");
  const [face, setFace] = useState<Face>(Face.Smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [bombCounter, setBombCounter] = useState<number>(totalBombs);
  const [hasLost, setHasLost] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState(false);
  const [cells, setCells] = useState<Cell[][]>(
    generateCells(totalRows, totalColumns, totalBombs)
  );
  const [gameBoardStyle, setGameBoardStyle] = useState(
    document.documentElement.getElementsByClassName("custom")
  );

  //  ------ In this file ------
  //Make a variable that holds the value of the current difficulty **
  // Make a variable that holds the number of rows **
  // Make a variable that holds the number of columns **
  // Make a variable that holds the number of bombs **
  // Replace the constants that are imported with the matching state that was created throughout the document **
  // Pass the difficulty and setDifficulty to the DifficultySetting component as props **
  // Inside of a useEffect, that waits for changes in difficulty, create the logic to set the # of rows,cols, and bombs based on difficulty **
  // Inside of a useEffect, that waits for changes in # of rows, cols, and bombs, create the logic to produces and sets the required style variable !!! Could not get to work, had to set a className with the difficulty setting

  //  ------ In Difficulty Settings ------
  //inside of the DifficultySetting component create settings for easy medium hard expert and custom (checkboxes) **!!completed with buttons and no custom input

  // //////------------Ice Box---------Need to Find Way to Set CSS/SCSS to Custom Inputs---/////////////
  // when custom setting is selected open three inputs for the user to enter # of cols, rows, & bombs //
  // do not allow for the number of bombs to be greater than 80% of total tiles (cols*rows*.8)        //
  // if total bombs > than allowed tell the user "The max amount of bombs is " + cols*rows*.8         //
  //--------------------------------------------------------------------------------------------------//

  //  ------When changing Difficulty Settings Adjust the Game Board and Bomb Count------
  useEffect(() => {
    switch (difficulty) {
      case "easy":
        setTotalRows(9);
        setTotalColumns(9);
        setTotalBombs(10);
        break;
      case "intermediate":
        setTotalRows(14);
        setTotalColumns(16);
        setTotalBombs(40);
        break;
      case "hard":
        setTotalRows(18);
        setTotalColumns(24);
        setTotalBombs(65);
        break;
      case "expert":
        setTotalRows(16);
        setTotalColumns(30);
        setTotalBombs(99);
        break;
      case "custom":
        setTotalRows(16);
        setTotalColumns(30);
        setTotalBombs(99);
        console.log(REACT_APP_MY_ENV);
        break;
      default:
        alert("incorrect difficulty value");
        break;
    }
  }, [difficulty]);

  //  ------When Changing Difficulty Settings Reset the Game------
  useEffect(() => {
    setCells(generateCells(totalRows, totalColumns, totalBombs));
    setBombCounter(totalBombs);
    setLive(false);
    setTime(0);
    setHasWon(false);
    setHasLost(false);
  }, [totalRows, totalColumns, totalBombs]);

  useEffect(() => {
    const handleMouseDown = (e: any): void => {
      const { className } = e.target;
      if (hasWon || hasLost) return;
      if (className.includes("Button") && !className.includes("visible")) {
        setFace(Face.Oh);
      }
    };

    const handleMouseUp = (): void => {
      if (hasWon || hasLost) return;
      setFace(Face.Smile);
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [hasLost, hasWon]);

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
    } else {
      setFace(Face.Smile);
    }
  }, [hasLost]);

  useEffect(() => {
    if (hasWon) {
      setFace(Face.Won);
      setLive(false);
    } else {
      setFace(Face.Smile);
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
    //  ------Starting the Game on Click & Always Open Multiple Cells on First Click------
    if (hasLost || hasWon) return;
    if (!live) {
      if (
        newCells[rowParam][colParam].value === CellValue.Bomb ||
        newCells[rowParam][colParam].value !== CellValue.None
      ) {
        let badStart = true;
        while (badStart) {
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
      <DifficultySettings
        difficulty={difficulty}
        setDifficulty={setDifficulty}
      />
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
          id="Body"
          className={`Body ${difficulty}`}
          // style={{
          //   display: "grid",
          //   gridTemplateColumns: `${gridColsStyle}`,
          //   gridTemplateRows: `${gridRowsStyle}`,
          // }}
        >
          {renderCells(totalRows, totalColumns, totalBombs)}
        </div>
      </div>
    </div>
  );
};

export default App;
