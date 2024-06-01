import PlayersList from "@/components/playersList/PlayersList";
import Scoreboard from "@/components/scoreboard/Scoreboard";
import { useRef } from "react";
import { useState, useEffect } from "react";

export default function Home() {
  const [mode, setMode] = useState("admin"); // Mode state to switch between admin and client mode
  const [teams, setTeams] = useState([]);
  const [teamA, setTeamA] = useState({
    _id: "",
    name: "Team A",
    raids: 0,
    stops: 0,
    out: 0,
    doubleTouch: 0,
    totalPoints: 0,
    team: "teamA",
  });
  const [teamB, setTeamB] = useState({
    _id: "",
    name: "Team B",
    raids: 0,
    stops: 0,
    out: 0,
    doubleTouch: 0,
    totalPoints: 0,
    team: "teamB",
  });
  const [inputA, setInputA] = useState("Team A");
  const [inputB, setInputB] = useState("Team B");
  const [selectedTeamA, setSelectedTeamA] = useState(null);
  const [selectedTeamB, setSelectedTeamB] = useState(null);
  // const [highlightedPlayer, setHighlightedPlayer] = useState(null);
  const [highlightedRaider, setHighlightedRaider] = useState(null);
  const [highlightedStopper, setHighlightedStopper] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    fetchTeams();
    fetchTeamsList();

    let interval;
    if (mode === "client") {
      interval = setInterval(() => {
        fetchTeams();
        fetchActiveRaid();
      }, 1500); // Fetch data every 1.5 seconds in client mode
    }
    return () => clearInterval(interval); // Clear interval on unmount
  }, [mode]);

  const fetchTeams = () => {
    fetch("/api/teams")
      .then((response) => response.json())
      .then((data) => {
        const teamAData = data.find((team) => team.team === "teamA") || {
          _id: "",
          name: "Team A",
          raids: 0,
          stops: 0,
          out: 0,
          doubleTouch: 0,
          totalPoints: 0,
        };
        const teamBData = data.find((team) => team.team === "teamB") || {
          _id: "",
          name: "Team B",
          raids: 0,
          stops: 0,
          out: 0,
          doubleTouch: 0,
          totalPoints: 0,
        };
        setTeamA(teamAData);
        setTeamB(teamBData);
      });
  };
  const fetchTeamsList = () => {
    fetch("/api/playing_teams")
      .then((response) => response.json())
      .then((data) => {
        setTeams(data);
      });
  };

  const updateTeam = (team, action, amount) => {
    const updatedTeam = { ...team, [action]: team[action] + amount };
    updatedTeam.totalPoints =
      updatedTeam.raids +
      updatedTeam.stops +
      updatedTeam.out +
      updatedTeam.doubleTouch;
    fetch("/api/teams/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTeam),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data._id === teamA._id) {
          setTeamA(data);
        } else if (data._id === teamB._id) {
          setTeamB(data);
        }
      });
  };

  const handleTeamSelection = (teamId, teamSide) => {
    const selectedTeam = teams.find((team) => team._id === teamId);
    if (teamSide === "A") {
      setSelectedTeamA(selectedTeam);
      setInputA(selectedTeam.name);
    } else {
      setSelectedTeamB(selectedTeam);
      setInputB(selectedTeam.name);
    }
  };

  const handleFirstPoint = (team, action) => {
    updateTeam(team, action, 1.5);
  };

  const handleRegularPoint = (team, action, amount) => {
    updateTeam(team, action, amount);
  };

  const handleSaveTeams = () => {
    const newTeamA = {
      ...teamA,
      name: selectedTeamA.name,
      slectedTeamId: selectedTeamA._id,
      totalPoints: teamA.raids + teamA.stops + teamA.out + teamA.doubleTouch,
    };
    const newTeamB = {
      ...teamB,
      name: selectedTeamB.name,
      slectedTeamId: selectedTeamB._id,
      totalPoints: teamB.raids + teamB.stops + teamA.out + teamA.doubleTouch,
    };
    setTeamA(newTeamA);
    setTeamB(newTeamB);
    fetch("/api/teams/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTeamA),
    }).then((response) => response.json());
    fetch("/api/teams/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTeamB),
    }).then((response) => response.json());
  };

  const handleResetTeams = () => {
    fetch("/api/teams/reset", { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        const teamAData = data.find((team) => team.team === "teamA") || {
          _id: "",
          name: "Team A",
          raids: 0,
          stops: 0,
          out: 0,
          doubleTouch: 0,
          totalPoints: 0,
        };
        const teamBData = data.find((team) => team.team === "teamB") || {
          _id: "",
          name: "Team B",
          raids: 0,
          stops: 0,
          out: 0,
          doubleTouch: 0,
          totalPoints: 0,
        };
        setTeamA(teamAData);
        setTeamB(teamBData);
        setInputA("Team A");
        setInputB("Team B");
      });
  };

  const handlePlayerHighlight = (teamId, playerId, playerType, playerName) => {
    if (highlightedRaider) {
      // Hide currently highlighted player immediately
      fetch("/api/playing_teams/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: highlightedRaider.teamId,
          playerId: highlightedRaider.playerId,
          playerType: highlightedRaider.playerType,
          playerName: highlightedRaider.playerName,
          show: false,
        }),
      });
    }
    // Clear the previous timeout if it exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Highlight new player
    fetch("/api/playing_teams/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamId,
        playerId,
        playerType,
        playerName,
        show: true,
      }),
    }).then(() => {
      setHighlightedRaider({
        teamId,
        playerId,
        playerName,
        playerType,
      });
      // Set a new timeout
      timeoutRef.current = setTimeout(() => {
        fetch("/api/playing_teams/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teamId, playerId, playerType, show: false }),
        }).then(() => {
          setHighlightedRaider(null);
        });
      }, 30000);
    });
  };

  const handleStopperHighlight = (teamId, playerId, playerType, playerName) => {
    if (highlightedRaider && highlightedRaider.playerType === "raiders") {
      fetch("/api/playing_teams/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: highlightedRaider.teamId,
          playerId: highlightedRaider.playerId,
          playerType: "raiders",
          show: false,
        }),
      });
    }

    fetch("/api/playing_teams/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamId,
        playerId,
        playerType,
        playerName,
        show: true,
      }),
    }).then(() => {
      setHighlightedStopper({
        teamId,
        playerId,
        playerName,
        playerType,
      });
    });
  };

  const fetchActiveRaid = () => {
    fetch("/api/playing_teams/active_raid")
      .then((response) => response.json())
      .then((data) => {
        setHighlightedRaider(data.raider);
        setHighlightedStopper(data.stopper);
      });
  };

  const hideAllHighlightedPlayers = () => {
    // Hide highlighted raider if any
    if (highlightedRaider && highlightedRaider.playerType === "raiders") {
      fetch("/api/playing_teams/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: highlightedRaider.teamId,
          playerId: highlightedRaider.playerId,
          playerType: "raiders",
          show: false,
        }),
      });
    }

    // Hide highlighted stopper if any
    if (highlightedStopper && highlightedStopper.playerType === "stoppers") {
      fetch("/api/playing_teams/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: highlightedStopper.teamId,
          playerId: highlightedStopper.playerId,
          playerType: "stoppers",
          show: false,
        }),
      });
    }

    // Clear highlighted player states
    setHighlightedRaider(null);
    setHighlightedStopper(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <button
            onClick={() => setMode("admin")}
            className={`px-4 py-2 ${
              mode === "admin"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Admin Mode
          </button>
          <button
            onClick={() => setMode("client")}
            className={`ml-2 px-4 py-2 ${
              mode === "client"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Client Mode
          </button>
          <button
            onClick={hideAllHighlightedPlayers}
            className="ml-2 px-4 py-2 bg-gray-200 text-gray-800"
          >
            Hide Players
          </button>
        </div>
      </div>
      {mode === "admin" && (
        <div className="flex flex-col md:flex-row md:justify-between mb-4 space-y-4 md:space-y-0">
          {/* <input
            type="text"
            value={inputA}
            onChange={(e) => setInputA(e.target.value)}
            className="border p-2"
          />
          <input
            type="text"
            value={inputB}
            onChange={(e) => setInputB(e.target.value)}
            className="border p-2"
          /> */}
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
          <button
            onClick={handleSaveTeams}
            className="bg-blue-500 text-white px-4 py-2"
          >
            Save
          </button>
          <button
            onClick={handleResetTeams}
            className="bg-red-500 text-white px-4 py-2"
          >
            Reset
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {[teamA, teamB].map((team, index) => (
          <>
            <div key={index} className="border p-4">
              <h2 className="text-xl font-bold mb-4">{team.name}</h2>
              <p>Total Points: {team.totalPoints}</p>
              <div className="flex flex-wrap justify-between mt-4">
                <div>
                  <h3>Raids: {team.raids}</h3>
                  {mode === "admin" && (
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
                  )}
                </div>
                <div>
                  <h3>Stops: {team.stops}</h3>
                  {mode === "admin" && (
                    <>
                      <div className="w-full min-w-32 flex">
                        <button
                          onClick={() => handleFirstPoint(team, "stops")}
                          className="bg-blue-500 text-white  w-1/2 py-3"
                        >
                          +1.5
                        </button>
                        <button
                          onClick={() => handleRegularPoint(team, "stops", -1)}
                          className="bg-red-500 text-white  w-1/2 py-3"
                        >
                          -
                        </button>
                      </div>
                      <button
                        onClick={() => handleRegularPoint(team, "stops", 1)}
                        className="bg-green-500 text-white w-full py-3"
                      >
                        +
                      </button>
                    </>
                  )}
                </div>
                <div>
                  <h3>Out: {team.out}</h3>
                  {mode === "admin" && (
                    <>
                      <div className="w-full min-w-32 flex">
                        <button
                          onClick={() => handleFirstPoint(team, "out")}
                          className="bg-blue-500 text-white  w-1/2 py-3"
                        >
                          +1.5
                        </button>
                        <button
                          onClick={() => handleRegularPoint(team, "out", -1)}
                          className="bg-red-500 text-white w-1/2 py-3"
                        >
                          -
                        </button>
                      </div>
                      <button
                        onClick={() => handleRegularPoint(team, "out", 1)}
                        className="bg-green-500 text-white w-full py-3"
                      >
                        +
                      </button>
                    </>
                  )}
                </div>
                <div>
                  <h3>Double Touch: {team.doubleTouch}</h3>
                  {mode === "admin" && (
                    <>
                      <div className="w-full min-w-32 flex">
                        <button
                          onClick={() => handleFirstPoint(team, "doubleTouch")}
                          className="bg-blue-500 text-white w-1/2 py-3"
                        >
                          +1.5
                        </button>
                        <button
                          onClick={() =>
                            handleRegularPoint(team, "doubleTouch", -1)
                          }
                          className="bg-red-500 text-white w-1/2 py-3"
                        >
                          -
                        </button>
                      </div>
                      <button
                        onClick={() =>
                          handleRegularPoint(team, "doubleTouch", 1)
                        }
                        className="bg-green-500 text-white w-full py-3"
                      >
                        +
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {selectedTeamA && (
          <div className="border p-4">
            <h2 className="text-xl font-bold mb-4">{selectedTeamA.name}</h2>
            <h3 className="font-bold">Raiders</h3>
            {selectedTeamA.raiders.map((player, idx) => (
              <div className="flex justify-between my-1">
                <p
                  key={idx}
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
                </div>
              </div>
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
              <div className="flex justify-between my-1">
                <p
                  key={idx}
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
              <div>
                <p key={idx} className="cursor-pointer hover:bg-gray-200">
                  {player.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div> */}
      <PlayersList
        selectedTeamA={selectedTeamA}
        highlightedPlayer={highlightedRaider}
        handlePlayerHighlight={handlePlayerHighlight}
        selectedTeamB={selectedTeamB}
        handleStopperHighlight={handleStopperHighlight}
        handleFirstPoint={handleFirstPoint}
        handleRegularPoint={handleRegularPoint}
      />
      {mode === "client" && (
        <Scoreboard
          teamA={teamA}
          teamB={teamB}
          selectedTeamA={selectedTeamA}
          selectedTeamB={selectedTeamB}
          highlightedStopper={highlightedStopper}
          highlightedRaider={highlightedRaider}
        />
      )}
    </div>
  );
}
