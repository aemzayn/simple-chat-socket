import { useState, useEffect, FormEvent, useRef } from "react";
import io, { Socket } from "socket.io-client";
import classNames from "classnames";
import "./App.css";

type Message = {
  userId: string;
  text: string;
  time: string;
};

function formatDate(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
}

function App() {
  const [text, setText] = useState<string>("");
  const [roomInput, setRoomInput] = useState<string>("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      userId: "admin",
      text: "Welcome to the chat!",
      time: formatDate(new Date()),
    },
    {
      userId: "admin",
      text: "Type your message below",
      time: formatDate(new Date()),
    },
  ]);
  const [userId, setUserId] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:8080");
    socket.on("connect", () => {
      const userId = socket.id;
      setUserId(socket.id as string);
      socketRef.current = socket;

      socket.emit("join", "General");
      setRoomId("General");

      socket.on("message", (message: Message) => {
        if (message.userId !== userId) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const onSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!socketRef.current || !userId) return;
    const time = formatDate(new Date());
    socketRef.current.emit("message", roomId, {
      text,
      userId,
      time,
    });
    setText("");
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text,
        userId,
        time,
      },
    ]);
    console.log("Message sent", text);
  };

  const onJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!socketRef.current || !userId) return;
    socketRef.current.emit("join", roomInput);
    setMessages([]);
    setRoomId(roomInput);
  };

  return (
    <div className="container">
      <form className="form" onSubmit={onSendMessage}>
        <p>My ID: {userId ?? "-"}</p>

        <label htmlFor="message">message</label>
        <textarea
          id="message"
          cols={50}
          rows={5}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <button type="submit">Send</button>
      </form>

      <form className="form" onSubmit={onJoinRoom}>
        <p>Current room: {roomId ?? "General"}</p>

        <label htmlFor="room">join room</label>
        <input
          id="room"
          type="text"
          onChange={(e) => {
            setRoomInput(e.target.value);
          }}
        />
        <button type="submit">Join</button>
      </form>

      <div className="messages">
        {messages.map((message, index, all) => {
          const prevMessage = all[index - 1];
          const nextMessage = all[index + 1];
          const sameUserWithPrev = prevMessage?.userId === message.userId;
          const sameUserWithNext = nextMessage?.userId === message.userId;

          const showSender = !sameUserWithPrev && message.userId !== userId;

          return (
            <div
              key={index}
              className={classNames("message", {
                "message--me": message.userId === userId,
                "message--same-user-next": sameUserWithNext,
                "message--same-user-prev": sameUserWithPrev,
              })}
            >
              {showSender && <p className="message-sender">{message.userId}</p>}
              <p className="message-text">{message.text}</p>
              <p className="message-time">{message.time}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
