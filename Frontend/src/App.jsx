import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import VideoChat from "./components/VideoChat";

const App = () => {
  const [roomId, setRoomId] = useState("");

  return (
    <div>
      <h1>Video Chat App</h1>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <Link to={`/room/${roomId}`}>
        <button>Join Room</button>
      </Link>

      <Routes>
        <Route path="/room/:roomId" element={<VideoChat />} />
      </Routes>
    </div>
  );
};

export default App;
