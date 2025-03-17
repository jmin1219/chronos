import React from "react";
import DeepWorkTimer from "./components/deepwork-timer/DeepWorkTimer";
import NotesPanel from "./components/deepwork-notes/NotesPanel";

export default function DeepWorkPage() {
  return (
    <div className="flex h-screen bg-black text-white">
      <div className="flex-1 flex justify-center items-center p-6 border-r border-gray-700">
        <DeepWorkTimer />
      </div>
      <div className="w-1/2 p-6 flex flex-col">
        <NotesPanel />
      </div>
    </div>
  );
}
