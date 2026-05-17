import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Routine() {
  const [routine, setRoutine] = useState("");
  const navigate = useNavigate();

  const handleSave = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    await fetch("http://localhost:5000/api/user/routine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: user._id,
        routine
      })
    });

    alert("Routine saved!");

    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      <h2 className="text-2xl mb-4">Describe Your Daily Routine</h2>

      <textarea
        className="p-3 text-black w-80 h-32"
        placeholder="Example: Morning college, evening gym, night study..."
        onChange={(e) => setRoutine(e.target.value)}
      />

      <button
        className="bg-purple-500 px-4 py-2 mt-4"
        onClick={handleSave}
      >
        Save Routine
      </button>
    </div>
  );
}