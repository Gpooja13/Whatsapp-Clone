import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import React, { useEffect, useRef } from "react";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";

function ChatContainer() {
  const [{ messages, userInfo, currentChatUser,  decryptedMessage}] =
    useStateProvider();
  const scrollRef = useRef(null);

  useEffect(() => {
    // Scroll down when the component mounts or when new messages are received
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [decryptedMessage]); // Trigger effect when decryptedMessage changes

  return (
    <div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar">
      <div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed left-0 top-0 z-0"></div>
      <div className="mx-10 my-6 relative bottom-0 z-9 left-0"> 
      {/* z-40 */}
        <div className="flex w-full">
          <div className="flex flex-col justify-end w-full gap-1 overflow-auto">
            {decryptedMessage.map((message, index) => {
              return (
                <div
                  key={message?.id}
                  className={`flex ${
                    message?.senderId === currentChatUser?.id
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  {message?.type === "text" && (
                    <div
                      className={`text-white px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[45%] ${
                        message?.senderId === currentChatUser?.id
                          ? "bg-incoming-background"
                          : "bg-outgoing-background"
                      }`}
                    >
                      <span className="break-all">{message?.message}</span>
                      <div className="flex gap-1 items-end">
                        <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                          {calculateTime(message?.createdAt)}
                        </span>
                        <span>
                          {message?.senderId === userInfo.id && (
                            <MessageStatus
                              messageStatus={message?.messageStatus}
                            />
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                  {message?.type === "image" && <ImageMessage message={message} />}
                </div>
              );
            })}
            {/* Empty div for scrolling to bottom */}
            <div ref={scrollRef}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
