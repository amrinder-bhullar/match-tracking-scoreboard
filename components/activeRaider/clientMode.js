import { useEffect } from "react";
import { useState } from "react";

const ClientMode = ({ highlightedPlayer }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (highlightedPlayer !== null) {
      setShow(true);
      console.log(show);
    } else {
      setShow(false);
    }
  }, [highlightedPlayer]);
  return (
    <div>
      {highlightedPlayer && (
        <div className="fixed bottom-0 left-0 right-0 bg-violet-700 text-white py-4 animate-slide-up">
          <div className="flex justify-between items-center px-8">
            <div className="text-2xl font-bold">
              {highlightedPlayer.teamName}
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
      `}</style>
    </div>
  );
};

export default ClientMode;
