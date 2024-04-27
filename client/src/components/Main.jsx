import React, { useEffect, useState, useRef } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { useRouter } from "next/router";
import { useStateProvider } from "@/context/StateContext";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth, db } from "@/utils/FirebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import axios from "axios";
import { reducerCases } from "@/context/constants";
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
import CryptoJS from "crypto-js";
import EthCrypto from "eth-crypto";
import Chat from "./Chat/Chat";
import { io } from "socket.io-client";
import SearchMessages from "./Chat/SearchMessages";
import VideoCall from "./Call/VideoCall";
import VoiceCall from "./Call/VoiceCall";
import IncomingVideoCall from "./common/IncomingVideoCall";
import IncomingCall from "./common/IncomingCall";

function Main() {
  const router = useRouter();
  const [
    {
      userInfo,
      currentChatUser,
      messages,
      messagesSearch,
      videoCall,
      voiceCall,
      incomingVoiceCall,
      incomingVideoCall,
    },
    dispatch,
  ] = useStateProvider();
  const [redirectLogin, setRedirectLogin] = useState(false);
  const socket = useRef();
  const [socketEvent, setSocketEvent] = useState(false);
  const [privateKey, setPrivateKey] = useState("");

  useEffect(() => {
    if (userInfo) {
      const fetchPrivateKey = async () => {
        const q = query(
          collection(db, "whatsapp-clone-data"),
          where("email", "==", userInfo.email)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const privateKeyFromDoc = doc.data().privateKey;
          setPrivateKey(privateKeyFromDoc);
          console.log(`${doc.id} => ${privateKeyFromDoc}`);
        });
      };
      fetchPrivateKey();
    }
  }, [userInfo]);

  useEffect(() => {
    if (redirectLogin) router.push("/login");
  }, [redirectLogin]);

  const decryptChat = async (secretKey, message) => {
    console.log("1message ", message);
    try {
      const decryptedSecretKey = await EthCrypto.decryptWithPrivateKey(
        privateKey,
        secretKey
      );
      console.log("decry1 ", decryptedSecretKey);
      const decryptedMessage = CryptoJS.AES.decrypt(
        message,
        decryptedSecretKey
      ).toString(CryptoJS.enc.Utf8);
      console.log("decry2 ", decryptedMessage);

      return decryptedMessage;
    } catch (error) {
      console.log(error);
    }
  };

  const decryptMessages = async (messages) => {
    try {
      const decryptedMessages = messages.map(async (message) => {
        if (message.senderId === userInfo.id) {
          const decryptedMessage = await decryptChat(
            message.senderSecretKey,
            message.message
          );
          return { ...message, message: decryptedMessage };
        } else if (message.senderId === currentChatUser.id) {
          const decryptedMessage = await decryptChat(
            message.receiverSecretKey,
            message.message
          );
          return { ...message, message: decryptedMessage };
        }
      });
      const decrypted = await Promise.all(decryptedMessages);
      dispatch({
        type: reducerCases.SET_DECRYPTED_MESSAGES,
        decryptedMessage: decrypted,
      });
      console.log(decrypted);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        const {
          data: { messages },
        } = await axios.get(
          `${GET_MESSAGES_ROUTE}/${userInfo.id}/${currentChatUser.id}`
        );
        console.log(messages, userInfo, currentChatUser);
        decryptMessages(messages);
      } catch (error) {
        console.error("Error fetching or decrypting messages:", error);
      }
    };

    if (currentChatUser?.id) {
      getMessages();
    }
  }, [currentChatUser, messages]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const {
          data: { messages },
        } = await axios.get(
          `${GET_MESSAGES_ROUTE}/${userInfo.id}/${currentChatUser.id}`
        );

        dispatch({ type: reducerCases.SET_MESSAGES, messages: messages });
      } catch (error) {
        console.error("Error fetching or decrypting messages:", error);
      }
    };

    if (currentChatUser?.id) {
      getMessages();
    }
  }, [currentChatUser]);

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST);
      socket.current.emit("add-user", userInfo.id);
      dispatch({ type: reducerCases.SET_SOCKET, socket });
    }
  }, [userInfo]);

  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("msg-receiver", (data) => {
        console.log("socket.........................");
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...data.message,
          },
        });
      });

      socket.current.on("incoming-voice-call", ({ from, roomId, callType }) => {
        dispatch({
          type: reducerCases.SET_INCOMING_VOICE_CALL,
          incomingVoiceCall: { ...from, roomId, callType },
        });
      });

      socket.current.on("incoming-video-call", ({ from, roomId, callType }) => {
        dispatch({
          type: reducerCases.SET_INCOMING_VIDEO_CALL,
          incomingVideoCall: { ...from, roomId, callType },
        });
      });

      socket.current.on("voice-call-rejected", () => {
        dispatch({ type: reducerCases.END_CALL });
      });

      socket.current.on("video-call-rejected", () => {
        dispatch({ type: reducerCases.END_CALL });
      });

      socket.current.on("onlineUsers", ({ onlineUsers }) => {
        dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers });
      });

      setSocketEvent(true);
    }
  }, [socket.current]);

  onAuthStateChanged(firebaseAuth, async (currentUser) => {
    if (!currentUser) setRedirectLogin(true);
    if (!userInfo && currentUser?.email) {
      const { data } = await axios.post(CHECK_USER_ROUTE, {
        email: currentUser.email,
      });
      if (!data.status) {
        router.push("/login");
      }
      if (data?.data) {
        const {
          id,
          name,
          email,
          profilePicture: profileImage,
          status,
          publicKey,
        } = data.data;
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            id,
            name,
            email,
            profileImage,
            status,
            publicKey,
          },
        });
      }
      router.push("/");
    }
  });

  return (
    <>
      {incomingVideoCall && <IncomingVideoCall />}
      {incomingVoiceCall && <IncomingCall />}

      {videoCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VideoCall />
        </div>
      )}
      {voiceCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VoiceCall />
        </div>
      )}
      {!videoCall && !voiceCall && (
        <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full">
          <ChatList />
          {currentChatUser ? (
            <div
              className={messagesSearch ? "grid grid-cols-2" : "grid-cols-2"}
            >
              <Chat />
              {messagesSearch && <SearchMessages />}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      )}
    </>
  );
}

export default Main;
