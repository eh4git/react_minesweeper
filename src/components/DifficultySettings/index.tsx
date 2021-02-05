import React from "react";
import "./DifficultySetting.scss";
// import { CellState, CellValue } from "../../types";

interface DifficultySettingsProps {
  //   row: number;
  //   col: number;
  //   red?: boolean;
  //   onClick(rowParam: number, colParam: number): (...args: any[]) => void;
  //   onContext(rowParam: number, colParam: number): (...args: any[]) => void;
}

const DifficultySettings: React.FC<DifficultySettingsProps> = (
  {
    //   row,
    //   col,
    //   state,
    //   value,
    //   red,
    //   onClick,
    //   onContext,
  }
) => {
  return <div className={`DifficultySettings`}>Easy Medium Hard</div>;
};

export default DifficultySettings;
