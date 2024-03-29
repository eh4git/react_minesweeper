import React from "react";
import { CellState, CellValue } from "../../types";
import "./Button.scss";

interface ButtonProps {
  row: number;
  col: number;
  state: CellState;
  value: CellValue;
  red?: boolean;
  onClick(rowParam: number, colParam: number): (...args: any[]) => void;
  onContext(rowParam: number, colParam: number): (...args: any[]) => void;
}

const Button: React.FC<ButtonProps> = ({
  row,
  col,
  state,
  value,
  red,
  onClick,
  onContext,
}) => {
  const renderContent = (): React.ReactNode => {
    if (state === CellState.Visible) {
      if (value === CellValue.Bomb) {
        return (
          <span role="img" aria-label="bomb">
            💣
          </span>
        );
      } else if (value === CellValue.None) {
        return null;
      }
      return value;
    } else if (state === CellState.Flagged) {
      return (
        <span role="img" aria-label="flag">
          🏴‍☠️
        </span>
      );
    }
    return null;
  };
  return (
    <div
      className={`Button ${
        state === CellState.Visible ? "visible" : ""
      } value-${value} ${red ? "red" : ""}`}
      onClick={onClick(row, col)}
      onContextMenu={onContext(row, col)}
    >
      {renderContent()}
    </div>
  );
};

export default Button;
