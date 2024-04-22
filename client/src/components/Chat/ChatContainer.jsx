import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import React, { useState,useEffect } from "react";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";
import CryptoJS from "crypto-js";
import EthCrypto from "eth-crypto";

function ChatContainer() {
  const [{ messages, userInfo, currentChatUser }] = useStateProvider();
  const privateKey = localStorage.getItem("privateKey");
//  const privateKey= Buffer.from(privateKeyString.slice(2), 'hex');

  const decryptChat = async (secretKey, message) => {
    // try {
      
      const decryptedSecretKey = await EthCrypto.decryptWithPrivateKey(
        privateKey,
        secretKey
      );
      console.log("0 ",typeof(privateKey),privateKey);
      console.log("1 ",typeof(secretKey), secretKey);
      console.log("2 ",typeof(decryptedSecretKey),decryptedSecretKey);
      const decryptedMessage =  CryptoJS.AES.decrypt(
        message,
        decryptedSecretKey
      ).toString(CryptoJS.enc.Utf8);
      console.log("3 ",typeof(decryptedMessage),decryptedMessage);
      return decryptedMessage;
    // } catch (error) {
    //   console.log(error);
    // }
    
  };

  return (
    <div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar">
      <div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed left-0 top-0 z-0"></div>
      <div className="mx-10 my-6 relative bottom-0 z-40 left-0">
        <div className="flex w-full">
          <div className="flex flex-col justify-end w-full gap-1 overflow-auto">
            {messages.map((message, index) => {
              console.log(message);
              const decryptedMessage = decryptChat(message.secretKey, message.message);
              {/* setPlainText(decryptedMessage); */}
              return (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === currentChatUser.id
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  {message.type === "text" && (
                    <div
                      className={`text-white px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[45%] ${
                        message.senderId === currentChatUser.id
                          ? "bg-incoming-background"
                          : "bg-outgoing-background"
                      }`}
                    >
                      {/* <span className="break-all">{decryptedMessage}</span> */}
                      {/* <span className="break-all">{message.message}</span> */}
                      <div className="flex gap-1 items-end">
                        <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                          {calculateTime(message.createdAt)}
                        </span>
                        <span>
                          {message.senderId === userInfo.id && (
                            <MessageStatus
                              messageStatus={message.messageStatus}
                            />
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                  {message.type === "image" && (
                    <ImageMessage message={message} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
