// src/components/ChatContainer.jsx
import { useEffect, useRef } from "react";
import useChatStore from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    isMessagesLoading,
    getMessages,
    setMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // ---- load messages -------------------------------------------------
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    } else {
      setMessages([]);
    }
    subscribeToMessages();
    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser, getMessages, setMessages, subscribeToMessages, unsubscribeFromMessages]);

  // ---- smooth scroll to bottom ----------------------------------------
  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ---- render --------------------------------------------------------
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <ChatHeader />

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isMessagesLoading ? (
          <MessageSkeleton />
        ) : selectedUser ? (
          messages.length > 0 ? (
            <>
              {messages.map((msg) => {
                const isSender = msg.senderId === authUser._id;

                return (
                  <div
                    key={msg._id}
                    className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                  >
                    {/* Avatar (only on the left for receiver, right for sender) */}
                    {!isSender && (
                      <div className="chat-image avatar mr-2">
                        <div className="size-8 rounded-full border">
                          <img
                            src={selectedUser.profilePic || "/avatar.png"}
                            alt="profile"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col">
                      {/* Message Bubble */}
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          isSender
                            ? "bg-black text-white"
                            : "bg-gray-700 text-white"
                        }`}
                      >
                        {/* Text */}
                        {msg.text && <p>{msg.text}</p>}

                        {/* Image (Existing) */}
                        {msg.image && (
                          <img
                            src={msg.image}
                            alt="sent"
                            className="mt-2 max-w-full rounded-md"
                          />
                        )}

                        {/* New: Video */}
                        {msg.video && (
                          <video
                            src={msg.video}
                            controls
                            className="mt-2 max-w-full rounded-md"
                            preload="metadata"
                          >
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>

                      {/* Time */}
                      <time className="text-xs opacity-60 mt-1 px-1">
                        {formatMessageTime(msg.createdAt)}
                      </time>
                    </div>

                    {/* Sender's avatar on the right */}
                    {isSender && (
                      <div className="chat-image avatar ml-2">
                        <div className="size-8 rounded-full border">
                          <img
                            src={authUser.profilePic || "/avatar.png"}
                            alt="profile"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messageEndRef} />
            </>
          ) : (
            <p className="text-center text-gray-400">No messages yet</p>
          )
        ) : (
          <p className="text-center text-gray-400">
            Select a user to start chatting
          </p>
        )}
      </div>

      {/* Input */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;