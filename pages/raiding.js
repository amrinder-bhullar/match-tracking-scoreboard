import AdminMode from "@/components/activeRaider/AdminMode";
import ClientMode from "@/components/activeRaider/clientMode";
import { useState, useEffect } from "react";
import io from "socket.io-client";

let socket;

export default function Raiding() {
  const [mode, setMode] = useState("admin");
  const [teams, setTeams] = useState([]);
  const [selectedTeamA, setSelectedTeamA] = useState(null);
  const [selectedTeamB, setSelectedTeamB] = useState(null);
  const [highlightedPlayer, setHighlightedPlayer] = useState(null);

  useEffect(() => {
    fetchTeams();

    if (!socket) {
      socket = io("http://localhost:3000", {
        reconnectionDelay: 1000,
        reconnection: true,
        reconnectionAttemps: 10,
        transports: ["websocket"],
        agent: false,
        upgrade: false,
        rejectUnauthorized: false,
      });

      socket.on("connect", () => {
        console.log(socket);
      });

      socket.on("update", (data) => {
        setTeams((prevTeams) =>
          prevTeams.map((team) => (team._id === data._id ? data : team))
        );
        console.log("update");
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  useEffect(() => {
    let interval;
    if (mode === "client") {
      interval = setInterval(fetchActiveRaid, 1500); // Fetch data every 1.5 seconds in client mode
    }
    return () => clearInterval(interval); // Clear interval on unmount
  }, [mode]);

  const fetchTeams = () => {
    fetch("/api/playing_teams")
      .then((response) => response.json())
      .then((data) => {
        setTeams(data);
      });
  };

  const fetchActiveRaid = () => {
    fetch("/api/playing_teams/active_raid")
      .then((response) => response.json())
      .then((data) => setHighlightedPlayer(data));
  };

  const handleTeamSelection = (teamId, teamSide) => {
    const selectedTeam = teams.find((team) => team._id === teamId);
    if (teamSide === "A") {
      setSelectedTeamA(selectedTeam);
    } else {
      setSelectedTeamB(selectedTeam);
    }
  };

  const handlePlayerHighlight = (teamId, playerId, playerType, playerName) => {
    if (highlightedPlayer) {
      // Hide currently highlighted player immediately
      fetch("/api/playing_teams/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: highlightedPlayer.teamId,
          playerId: highlightedPlayer.playerId,
          playerType: highlightedPlayer.playerType,
          playerName: highlightedPlayer.playerName,
          show: false,
        }),
      });
      //   console.log(highlightedPlayer);
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
      setHighlightedPlayer({ teamId, playerId, playerName, playerType });
      setTimeout(() => {
        fetch("/api/playing_teams/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teamId, playerId, playerType, show: false }),
        }).then(() => {
          setHighlightedPlayer(null);
        });
        socket.emit("update", highlightedPlayer);
      }, 30000); // 30 seconds
    });
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
        </div>
      </div>
      {mode === "admin" ? (
        <AdminMode
          teams={teams}
          selectedTeamA={selectedTeamA}
          selectedTeamB={selectedTeamB}
          handleTeamSelection={handleTeamSelection}
          handlePlayerHighlight={handlePlayerHighlight}
          highlightedPlayer={highlightedPlayer}
        />
      ) : (
        <ClientMode
          highlightedPlayer={highlightedPlayer}
          selectedTeamA={selectedTeamA}
        />
      )}

      {/* {highlightedPlayer && (
        <div className="fixed bottom-0 left-0 right-0 bg-violet-700 text-white py-4 animate-slide-up">
          <div className="flex justify-between items-center px-8">
            <div className="text-2xl font-bold">
              {highlightedPlayer.teamId === selectedTeamA._id
                ? selectedTeamA.name
                : selectedTeamB.name}
            </div>
            <div className="text-4xl font-bold">
              {highlightedPlayer.playerType === "raiders"
                ? "Raider"
                : "Stopper"}
              : {highlightedPlayer.playerName}
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-in-out;
        }
      `}</style> */}
    </div>
  );
}
