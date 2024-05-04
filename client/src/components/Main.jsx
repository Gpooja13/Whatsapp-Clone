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
import Profile from "./Chatlist/Profile";

function Main() {
  const router = useRouter();
  const [
    {
      userInfo,
      privateKey,
      googleAuthKey,
      currentChatUser,
      messages,
      messagesSearch,
      showProfile,
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
  const chatAudioRef = useRef(null);
  const callAudioRef = useRef(null);

  useEffect(() => {
    // Initialize chat audio
    chatAudioRef.current = new Audio("facebookchat.mp3");
    callAudioRef.current = new Audio("call-sound.mp3");
  }, []);

  const playChatAudio = () => {
    if (chatAudioRef.current) {
      chatAudioRef.current.play();
    }
  };

  const playCallAudio = () => {
    if (callAudioRef.current) {
      callAudioRef.current.play();
    }
  };

  const stopCallAudio = () => {
    if (callAudioRef.current) {
      callAudioRef.current.pause();
      callAudioRef.current.currentTime = 0;
    }
  };

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

          const pk = CryptoJS.AES.decrypt(
            privateKeyFromDoc,
            googleAuthKey
          ).toString(CryptoJS.enc.Utf8);

          dispatch({
            type: reducerCases.SET_PRIVATE_KEY,
            privateKey: pk,
          });
        });
      };
      fetchPrivateKey();
    }
  }, [userInfo]);

  useEffect(() => {
    if (redirectLogin) router.push("/login");
  }, [redirectLogin]);

  const decryptChat = async (secretKey, message) => {
    try {
      const decryptedSecretKey = await EthCrypto.decryptWithPrivateKey(
        privateKey,
        secretKey
      );

      const decryptedMessage = CryptoJS.AES.decrypt(
        message,
        decryptedSecretKey
      ).toString(CryptoJS.enc.Utf8);

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

        decryptMessages(messages);
      } catch (error) {
        console.error("Error fetching or decrypting messages:", error);
      }
    };

    if (currentChatUser?.id) {
      getMessages();
    }
  }, [currentChatUser, messages, privateKey]);

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
        playChatAudio();
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...data.message,
          },
        });
      });

      socket.current.on("incoming-voice-call", ({ from, roomId, callType }) => {
        playCallAudio();
        dispatch({
          type: reducerCases.SET_INCOMING_VOICE_CALL,
          incomingVoiceCall: { ...from, roomId, callType },
        });
      });

      socket.current.on("incoming-video-call", ({ from, roomId, callType }) => {
        playCallAudio();
        dispatch({
          type: reducerCases.SET_INCOMING_VIDEO_CALL,
          incomingVideoCall: { ...from, roomId, callType },
        });
      });

      socket.current.on("voice-call-rejected", () => {
        stopCallAudio();
        dispatch({ type: reducerCases.END_CALL });
        
      });

      socket.current.on("video-call-rejected", () => {
        stopCallAudio();
        dispatch({ type: reducerCases.END_CALL });
      });

      socket.current.on("onlineUsers", ({ onlineUsers }) => {
        dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers });
      });

      setSocketEvent(true);
    }
  }, [socket.current]);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
      if (!currentUser) setRedirectLogin(true);
      if (!userInfo && currentUser?.email) {
        dispatch({
          type: reducerCases.SET_GOOGLE_AUTH_KEY,
          googleAuthKey: currentUser?.uid,
        });
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
            about,
            publicKey,
          } = data.data;
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              id,
              name,
              email,
              profileImage,
              status: about,
              publicKey,
            },
          });
        }
  
        router.push("/");
      }
    });
  
    // Cleanup function to unsubscribe from listener on component unmount
    return () => unsubscribe();
  }, [firebaseAuth]); // Add firebaseAuth as a dependency

  // onAuthStateChanged(firebaseAuth, async (currentUser) => {
  //   if (!currentUser) setRedirectLogin(true);
  //   if (!userInfo && currentUser?.email) {
  //     dispatch({
  //       type: reducerCases.SET_GOOGLE_AUTH_KEY,
  //       googleAuthKey: currentUser?.uid,
  //     });
  //     const { data } = await axios.post(CHECK_USER_ROUTE, {
  //       email: currentUser.email,
  //     });

  //     if (!data.status) {
  //       router.push("/login");
  //     }
  //     if (data?.data) {
  //       const {
  //         id,
  //         name,
  //         email,
  //         profilePicture: profileImage,
  //         about,
  //         publicKey,
  //       } = data.data;
  //       dispatch({
  //         type: reducerCases.SET_USER_INFO,
  //         userInfo: {
  //           id,
  //           name,
  //           email,
  //           profileImage,
  //           status: about,
  //           publicKey,
  //         },
  //       });
  //     }

  //     router.push("/");
  //   }
  // });

  return (
    <>
      {incomingVideoCall && <IncomingVideoCall stopCallAudio={stopCallAudio} />}
      {incomingVoiceCall && <IncomingCall stopCallAudio={stopCallAudio} />}

      {videoCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VideoCall stopCallAudio={stopCallAudio} />
        </div>
      )}
      {voiceCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VoiceCall stopCallAudio={stopCallAudio} />
        </div>
      )}
      {!videoCall && !voiceCall && (
        <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full">
          {showProfile ? <Profile /> : <ChatList />}
          {/* <ChatList /> */}
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
