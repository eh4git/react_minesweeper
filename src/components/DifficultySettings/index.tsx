import React from "react";
import "./DifficultySetting.scss";
interface DifficultySettingsProps {
  difficulty: string;
  setDifficulty(difficulty: string): any;
}

const DifficultySettings: React.FC<DifficultySettingsProps> = ({
  difficulty,
  setDifficulty,
}) => {
  const difficultyLevels = ["easy", "intermediate", "hard", "expert"];
  return (
    <div className={`DifficultySettings`}>
      {difficultyLevels.map((item) => (
        <button key={item} onClick={() => setDifficulty(item)}>
          {item}
        </button>
      ))}
    </div>
  );
};

export default DifficultySettings;
