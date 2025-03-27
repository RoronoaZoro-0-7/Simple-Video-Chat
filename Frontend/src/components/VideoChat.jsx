import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Peer from "peerjs";

const socket = io("http://localhost:5000");

const VideoChat = () => {
  const { roomId } = useParams();
  const myVideoRef = useRef();
  const userVideoRef = useRef();
  const peerRef = useRef();
  const [peerId, setPeerId] = useState("");

  useEffect(() => {
    const myPeer = new Peer();
    peerRef.current = myPeer;

    myPeer.on("open", (id) => {
      setPeerId(id);
      socket.emit("join-room", roomId, id);
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      myVideoRef.current.srcObject = stream;

      socket.on("user-connected", (userId) => {
        const call = myPeer.call(userId, stream);
        call.on("stream", (userStream) => {
          userVideoRef.current.srcObject = userStream;
        });
      });

      myPeer.on("call", (call) => {
        call.answer(stream);
        call.on("stream", (userStream) => {
          userVideoRef.current.srcObject = userStream;
        });
      });
    });

    socket.on("user-disconnected", (userId) => {
      console.log(`User ${userId} disconnected`);
    });

  }, [roomId]);

  return (
    <div>
      <h2>Room ID: {roomId}</h2>
      <video ref={myVideoRef} autoPlay playsInline muted />
      <video ref={userVideoRef} autoPlay playsInline />
    </div>
  );
};

export default VideoChat;