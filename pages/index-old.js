import { useState, useEffect } from "react";

export default function Home() {
  const [teamA, setTeamA] = useState({
    _id: "",
    name: "Team A",
    raids: 0,
    stops: 0,
    totalPoints: 0,
  });
  const [teamB, setTeamB] = useState({
    _id: "",
    name: "Team B",
    raids: 0,
    stops: 0,
    totalPoints: 0,
  });
  const [inputA, setInputA] = useState("Team A");
  const [inputB, setInputB] = useState("Team B");

  useEffect(() => {
    fetch("/api/teams")
      .then((response) => response.json())
      .then((data) => {
        const teamAData = data.find((team) => team.team === "teamA") || {
          _id: "",
          name: "Team A",
          raids: 0,
          stops: 0,
          totalPoints: 0,
        };
        const teamBData = data.find((team) => team.team === "teamB") || {
          _id: "",
          name: "Team B",
          raids: 0,
          stops: 0,
          totalPoints: 0,
        };
        setTeamA(teamAData);
        setTeamB(teamBData);
      });
  }, []);

  const updateTeam = (team, action, amount) => {
    const updatedTeam = { ...team, [action]: team[action] + amount };
    updatedTeam.totalPoints = updatedTeam.raids + updatedTeam.stops;
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

  const handleSaveTeams = () => {
    const newTeamA = {
      ...teamA,
      name: inputA,
      totalPoints: teamA.raids + teamA.stops,
    };
    const newTeamB = {
      ...teamB,
      name: inputB,
      totalPoints: teamB.raids + teamB.stops,
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
          totalPoints: 0,
        };
        const teamBData = data.find((team) => team.team === "teamB") || {
          _id: "",
          name: "Team B",
          raids: 0,
          stops: 0,
          totalPoints: 0,
        };
        setTeamA(teamAData);
        setTeamB(teamBData);
        setInputA("Team A");
        setInputB("Team B");
      });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <input
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
        />
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
      <div className="grid grid-cols-2 gap-4">
        {[teamA, teamB].map((team, index) => (
          <div key={index} className="border p-4">
            <h2 className="text-xl font-bold mb-4">{team.name}</h2>
            <p>Total Points: {team.totalPoints}</p>
            <div className="flex justify-between mt-4">
              <div>
                <h3>Raids: {team.raids}</h3>
                <button
                  onClick={() => updateTeam(team, "raids", 1.5)}
                  className="bg-blue-500 text-white px-2 py-1"
                >
                  First Point 1.5
                </button>
                <button
                  onClick={() => updateTeam(team, "raids", 1)}
                  className="bg-green-500 text-white px-2 py-1"
                >
                  +
                </button>
                <button
                  onClick={() => updateTeam(team, "raids", -1)}
                  className="bg-red-500 text-white px-2 py-1"
                >
                  -
                </button>
              </div>
              <div>
                <h3>Stops: {team.stops}</h3>
                <button
                  onClick={() => updateTeam(team, "raids", 1.5)}
                  className="bg-blue-500 text-white px-2 py-1"
                >
                  First Point 1.5
                </button>
                <button
                  onClick={() => updateTeam(team, "stops", 1)}
                  className="bg-green-500 text-white px-2 py-1"
                >
                  +
                </button>
                <button
                  onClick={() => updateTeam(team, "stops", -1)}
                  className="bg-red-500 text-white px-2 py-1"
                >
                  -
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-violet-700 text-white py-4">
        <div className="flex justify-between items-center px-8">
          <div className="text-2xl font-bold">{teamA.name}</div>
          <div className="text-4xl font-bold">
            {teamA.totalPoints} vs {teamB.totalPoints}
          </div>
          <div className="text-2xl font-bold">{teamB.name}</div>
        </div>
        <div className="flex justify-between items-center px-8">
          <div className="text-2xl font-bold">
            <div className="flex">Raids: {teamA.raids}</div>
            <div className="flex">Stops: {teamA.stops}</div>
          </div>
          <div className="text-2xl font-bold">
            <div className="flex">Raids: {teamB.raids}</div>
            <div className="flex">Stops: {teamB.stops}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
