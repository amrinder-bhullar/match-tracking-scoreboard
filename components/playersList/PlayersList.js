import React from "react";

const PlayersList = ({
  selectedTeamA,
  highlightedPlayer,
  handlePlayerHighlight,
  handleStopperHighlight,
  selectedTeamB,
  handleFirstPoint,
  handleRegularPoint,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-28">
      {selectedTeamA && (
        <div className="border p-4">
          <h2 className="text-xl font-bold mb-4">{selectedTeamA.name}</h2>
          <h3 className="font-bold">Raiders</h3>
          {selectedTeamA.raiders.map((player, idx) => (
            <div key={idx} className="flex justify-between my-1">
              <p
                className={`${
                  highlightedPlayer &&
                  highlightedPlayer.playerId === player._id &&
                  "bg-blue-500 text-white"
                } cursor-pointer hover:bg-gray-200`}
              >
                {player.name}
              </p>
              <div>
                <button
                  onClick={() =>
                    handlePlayerHighlight(
                      selectedTeamA._id,
                      player._id,
                      "raiders",
                      player.name
                    )
                  }
                  className="bg-blue-500 text-white px-2 py-1"
                >
                  on Raid
                </button>
                <>
                  <div className="w-full min-w-32 flex">
                    <button
                      onClick={() => handleFirstPoint(team, "raids")}
                      className="bg-blue-500 text-white w-1/2 py-3"
                    >
                      +1.5
                    </button>
                    <button
                      onClick={() => handleRegularPoint(team, "raids", -1)}
                      className="bg-red-500 text-white py-3 w-1/2"
                    >
                      -
                    </button>
                  </div>
                  <button
                    onClick={() => handleRegularPoint(team, "raids", 1)}
                    className="bg-green-500 text-white w-full py-3"
                  >
                    +
                  </button>
                </>
              </div>
            </div>
          ))}
          <h3 className="font-bold">Stoppers</h3>
          {selectedTeamA.stoppers.map((player, idx) => (
            <div key={idx} className="flex justify-between my-1">
              <p
                className={`${
                  highlightedPlayer &&
                  highlightedPlayer.playerId === player._id &&
                  "bg-blue-500 text-white"
                } cursor-pointer hover:bg-gray-200`}
              >
                {player.name}
              </p>
              <div>
                <button
                  onClick={() =>
                    handleStopperHighlight(
                      selectedTeamA._id,
                      player._id,
                      "stoppers",
                      player.name
                    )
                  }
                  className="bg-red-500 text-white px-2 py-1"
                >
                  Stopped By
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedTeamB && (
        <div className="border p-4">
          <h2 className="text-xl font-bold mb-4">{selectedTeamB.name}</h2>
          <h3 className="font-bold">Raiders</h3>
          {selectedTeamB.raiders.map((player, idx) => (
            <div key={idx} className="flex justify-between my-1">
              <p
                className={`${
                  highlightedPlayer &&
                  highlightedPlayer.playerId === player._id &&
                  "bg-blue-500 text-white"
                } cursor-pointer hover:bg-gray-200`}
              >
                {player.name}
              </p>
              <div>
                <button
                  onClick={() =>
                    handlePlayerHighlight(
                      selectedTeamB._id,
                      player._id,
                      "raiders",
                      player.name
                    )
                  }
                  className="bg-blue-500 text-white px-2 py-1"
                >
                  on Raid
                </button>
              </div>
            </div>
          ))}
          <h3 className="font-bold">Stoppers</h3>
          {selectedTeamB.stoppers.map((player, idx) => (
            <div key={idx} className="flex justify-between my-1">
              <p
                className={`${
                  highlightedPlayer &&
                  highlightedPlayer.playerId === player._id &&
                  "bg-blue-500 text-white"
                } cursor-pointer hover:bg-gray-200`}
              >
                {player.name}
              </p>
              <div>
                <button
                  onClick={() =>
                    handleStopperHighlight(
                      selectedTeamB._id,
                      player._id,
                      "stoppers",
                      player.name
                    )
                  }
                  className="bg-red-500 text-white px-2 py-1"
                >
                  Stopped By
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayersList;
