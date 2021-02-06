import React, { useState, useEffect } from "react";
import Button from "../Button";
import NumberDisplay from "../NumberDispaly";
import DifficultySettings from "../DifficultySettings";
import { generateCells, openMultipleCells } from "../../utils";
import { Cell, CellState, CellValue, Face } from "../../types";
import { MAX_ROWS, MAX_COLS, NO_OF_BOMBS } from "../../constants";
import "./App.scss";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<Face>(Face.Smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [bombCounter, setBombCounter] = useState<number>(NO_OF_BOMBS);
  const [hasLost, setHasLost] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState(false);

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
      setLive(false);
      setFace(Face.Won);
    }
  }, [hasWon]);

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    let newCells = cells.slice();
    console.log(newCells[rowParam][colParam]);
    //  ------Starting the Game------
    if (!live) {
      if (
        newCells[rowParam][colParam].value === CellValue.Bomb ||
        newCells[rowParam][colParam].value !== CellValue.None
      ) {
        let isABomb = true;
        while (isABomb) {
          console.log(isABomb);
          newCells = generateCells();
          if (newCells[rowParam][colParam].value === CellValue.None) {
            isABomb = false;
            break;
          }
        }
      }
      setLive(true);
    }

    const currentCell = newCells[rowParam][colParam];

    if ([CellState.Flagged, CellState.Visible].includes(currentCell.state)) {
      return;
    }

    //  ------Clicking on a Bomb tile------
    if (currentCell.value === CellValue.Bomb) {
      setHasLost(true);
      newCells[rowParam][colParam].red = true;
      newCells = showAllBombs();
      setCells(newCells);
      return;
      //  ------Clicking on a tile that is empty------
    } else if (currentCell.value === CellValue.None) {
      newCells = openMultipleCells(newCells, rowParam, colParam);
      //  ------Clicking on a tile that has a number------
    } else {
      newCells[rowParam][colParam].state = CellState.Visible;
      setCells(newCells);
    }

    let safeOpenCellsExist = false;
    for (let row = 0; row < MAX_ROWS; row++) {
      for (let col = 0; col < MAX_COLS; col++) {
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

  const handleFaceClick = (): void => {
    setLive(false);
    setTime(0);
    setBombCounter(NO_OF_BOMBS);
    setCells(generateCells());
    setHasLost(false);
    setHasWon(false);
  };

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Button
          key={`${rowIndex}-${colIndex}`}
          state={cell.state}
          value={cell.value}
          onClick={handleCellClick}
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
          <div className="Face" onClick={handleFaceClick}>
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
          //   gridTemplateColumns: repeat(19, 1fr),
          //   gridTemplateRows: repeat(19, 1fr),
          // }}
        >
          {renderCells()}
        </div>
      </div>
    </div>
  );
};

export default App;