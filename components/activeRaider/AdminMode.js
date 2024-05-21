import React from "react";

const AdminMode = ({
  teams,
  selectedTeamA,
  selectedTeamB,
  handleTeamSelection,
  handlePlayerHighlight,
  highlightedPlayer,
}) => {
  return (
    <div>
      <div className="flex justify-between mb-4">
        <select
          onChange={(e) => handleTeamSelection(e.target.value, "A")}
          className="border p-2"
        >
          <option value="">Select Team A</option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.name}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => handleTeamSelection(e.target.value, "B")}
          className="border p-2"
        >
          <option value="">Select Team B</option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {selectedTeamA && (
          <div className="border p-4">
            <h2 className="text-xl font-bold mb-4">{selectedTeamA.name}</h2>
            <h3 className="font-bold">Raiders</h3>
            {selectedTeamA.raiders.map((player, idx) => (
              <p
                key={idx}
                onClick={() =>
                  handlePlayerHighlight(
                    selectedTeamA._id,
                    player._id,
                    "raiders",
                    player.name
                  )
                }
                className={
                  `${
                    highlightedPlayer &&
                    highlightedPlayer.playerId === player._id &&
                    "bg-blue-500 text-white"
                  }` + "cursor-pointer hover:bg-gray-200"
                }
              >
                {player.name}
              </p>
            ))}
            <h3 className="font-bold">Stoppers</h3>
            {selectedTeamA.stoppers.map((player, idx) => (
              <p key={idx} className="cursor-pointer hover:bg-gray-200">
                {player.name}
              </p>
            ))}
          </div>
        )}
        {selectedTeamB && (
          <div className="border p-4">
            <h2 className="text-xl font-bold mb-4">{selectedTeamB.name}</h2>
            <h3 className="font-bold">Raiders</h3>
            {selectedTeamB.raiders.map((player, idx) => (
              <p
                key={idx}
                onClick={() =>
                  handlePlayerHighlight(
                    selectedTeamB._id,
                    player._id,
                    "raiders",
                    player.name
                  )
                }
                className={
                  `${
                    highlightedPlayer &&
                    highlightedPlayer.playerId === player._id &&
                    "bg-blue-500 text-white"
                  }` + "cursor-pointer hover:bg-gray-200"
                }
              >
                {player.name}
              </p>
            ))}
            <h3 className="font-bold">Stoppers</h3>
            {selectedTeamB.stoppers.map((player, idx) => (
              <p key={idx} className="cursor-pointer hover:bg-gray-200">
                {player.name}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMode;
