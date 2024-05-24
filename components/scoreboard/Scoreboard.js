import React, { useState, useEffect } from "react";

const Scoreboard = ({
  teamA,
  teamB,
  highlightedRaider,
  highlightedStopper,
}) => {
  const [TextTeamA, setTextTeamA] = useState("");
  const [TextTeamB, setTextTeamB] = useState("");
  const [animationClassA, setAnimationClassA] = useState("");
  const [animationClassB, setAnimationClassB] = useState("");

  useEffect(() => {
    if (!highlightedRaider && !highlightedStopper) {
      if (TextTeamA || TextTeamB) {
        setAnimationClassA("animate-slide-down");
        setAnimationClassB("animate-slide-down");
        setTimeout(() => {
          setTextTeamA("");
          setTextTeamB("");
          setAnimationClassA("");
          setAnimationClassB("");
        }, 500); // Match this duration with the slide-down animation duration
      }
    } else {
      if (highlightedRaider && highlightedRaider.teamName === teamA.name) {
        setTextTeamA(highlightedRaider);
        setAnimationClassA("animate-slide-up");
        setAnimationClassB("animate-slide-down");
        if (highlightedRaider.playerType === "raiders") {
          setTextTeamB("");
        }
      } else if (highlightedRaider) {
        setTextTeamB(highlightedRaider);
        setAnimationClassB("animate-slide-up");
        setAnimationClassA("animate-slide-down");
        if (highlightedRaider.playerType === "raiders") {
          setTextTeamA("");
        }
      }

      if (highlightedStopper && highlightedStopper.teamName === teamA.name) {
        setTextTeamA(highlightedStopper);
        setAnimationClassA("animate-slide-up");
      } else if (highlightedStopper) {
        setTextTeamB(highlightedStopper);
        setAnimationClassB("animate-slide-up");
      }
    }
  }, [highlightedRaider, highlightedStopper]);

  return (
    <div>
      <div className="fixed bottom-0 left-0 right-0 bg-golden text-black min-h-28 py-4 hidden md:block">
        <div className="flex justify-center items-center px-4">
          <div
            className={`w-72 h-11 mr-10 flex items-center ${animationClassA}`}
          >
            {TextTeamA && (
              <div className="text-3xl font-bold">
                {TextTeamA.playerType === "raiders" ? "On Raid" : "Stopped By"}:{" "}
                {TextTeamA.playerName}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-2 w-72 justify-end text-2xl font-bold">
            <div className="w-60">Raids: {teamA.raids}</div>
            <div>Stops: {teamA.stops}</div>
            <div>Out: {teamA.out}</div>
            <div>DT: {teamA.doubleTouch}</div>
          </div>
          <div className="text-4xl font-bold text-right w-80 mr-4">
            {teamA.name}
          </div>
          <div className="text-4xl min-w-52 font-bold flex justify-center bg-white text-black py-2">
            {teamA.totalPoints} vs {teamB.totalPoints}
          </div>
          <div className="text-4xl font-bold ml-4 w-80">{teamB.name}</div>
          <div className="grid grid-cols-2 w-72 text-2xl font-bold ml-4">
            <div className="w-60">Raids: {teamB.raids}</div>
            <div>Stops: {teamB.stops}</div>
            <div>Out: {teamB.out}</div>
            <div>DT: {teamB.doubleTouch}</div>
          </div>
          <div
            className={`w-72 h-11 ml-10 flex items-center ${animationClassB}`}
          >
            {TextTeamB && (
              <div className="text-3xl font-bold">
                {TextTeamB.playerType === "raiders" ? "On Raid" : "Stopped By"}:{" "}
                {TextTeamB.playerName}
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes slide-down {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(100%);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-in-out;
        }
        .animate-slide-down {
          animation: slide-down 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Scoreboard;
