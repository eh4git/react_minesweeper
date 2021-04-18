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
  const difficultyLevels = ["easy", "intermediate", "hard", "expert", "custom"];
  return (
    <div className="difficultySettings">
      {difficultyLevels.map((setting) => (
        <button
          key={setting}
          onClick={() => setDifficulty(setting)}
          className="settingBtn"
        >
          {setting}
        </button>
      ))}
    </div>
  );
};

export default DifficultySettings;
