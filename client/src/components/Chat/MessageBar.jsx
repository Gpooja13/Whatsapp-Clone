import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import {  ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
// ADD_IMAGE_MESSAGE_ROUTE,
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useState, useRef } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import PhotoPicker from "../common/PhotoPicker";
import EthCrypto from "eth-crypto";
import { nanoid } from "nanoid";
import CryptoJS from "crypto-js";

function MessageBar() {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);

  const handleEmojiModal = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiObj) => {
    setMessage((prevMessage) => prevMessage + emojiObj.emoji);
  };

  // const photoPickerChange = async (e) => {
  //   try {
  //     const file = e.target.files[0];
  //     const formData = new FormData();
  //     formData.append("image", file);
  //     const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //       params: {
  //         from: userInfo.id,
  //         to: currentChatUser.id,
  //       },
  //     });
  //     if (response.status === 201) {
  //       socket.current.emit("send-msg", {
  //         to: currentChatUser?.id,
  //         from: userInfo?.id,
  //         message: response.data.message,
  //       });
  //       dispatch({
  //         type: reducerCases.ADD_MESSAGE,
  //         newMessage: {
  //           ...response.data.message,
  //         },
  //         fromSelf: true,
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  
  const resizeAndCompressImage = async (file, maxWidth, maxHeight, quality) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;
  
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
  
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
  
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
  
          canvas.toBlob(
            (blob) => {
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => {
                const base64String = reader.result;
                resolve(base64String);
              };
            },
            file.type,
            quality
          );
        };
        img.onerror = (error) => {
          reject(error);
        };
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };
  
  

  const photoPickerChange = async (e) => {
    try {
      // const file = e.target.files[0];
      // var reader = new FileReader();
      // reader.readAsDataURL(file);
  
      // reader.onload = async() => {
      //   const base64=reader.result;
      //  console.log("base64 ",base64);

      const file = e.target.files[0];
      // var reader = new FileReader();
      // reader.readAsDataURL(file);
      const base64=await resizeAndCompressImage(file, 800, 600, 0.7);
      // reader.onload = async() => {
      //   const base64=reader.result;


       const secretKey = nanoid();
       const cipherMessage = CryptoJS.AES.encrypt(base64, secretKey).toString();
    
   
       const encryptedReceiverKey = await EthCrypto.encryptWithPublicKey(
         currentChatUser?.publicKey,
         secretKey
       );
       const encryptedReceiverSecretKey =
         EthCrypto.cipher.stringify(encryptedReceiverKey);
 
       const encryptedSenderKey = await EthCrypto.encryptWithPublicKey(
         userInfo?.publicKey,
         secretKey
       );
       const encryptedSenderSecretKey =
         EthCrypto.cipher.stringify(encryptedSenderKey);
 
       const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
         to: currentChatUser?.id,
         from: userInfo?.id,
         message: cipherMessage,
         type:"image",
         receiverSecretKey: encryptedReceiverSecretKey,
         senderSecretKey: encryptedSenderSecretKey,
       });
 
       socket.current.emit("send-msg", {
         to: currentChatUser?.id,
         from: userInfo?.id,
         message: data.message,
         receiverSecretKey: data.encryptedReceiverSecretKey,
         senderSecretKey: data.encryptedSenderSecretKey,
       });
 
       dispatch({
         type: reducerCases.ADD_MESSAGE,
         newMessage: {
           ...data.message,
         },
         fromSelf: true,
       });
      
      // };
      // reader.onerror = error => {
      //   console.log("Error: ", error);
      // };
     
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    try {
      const secretKey = nanoid();
      const cipherMessage = CryptoJS.AES.encrypt(message, secretKey).toString();
     
      const encryptedReceiverKey = await EthCrypto.encryptWithPublicKey(
        currentChatUser?.publicKey,
        secretKey
      );
      const encryptedReceiverSecretKey =
        EthCrypto.cipher.stringify(encryptedReceiverKey);

      const encryptedSenderKey = await EthCrypto.encryptWithPublicKey(
        userInfo?.publicKey,
        secretKey
      );
      const encryptedSenderSecretKey =
        EthCrypto.cipher.stringify(encryptedSenderKey);

      const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message: cipherMessage,
        receiverSecretKey: encryptedReceiverSecretKey,
        senderSecretKey: encryptedSenderSecretKey,
      });

      socket.current.emit("send-msg", {
        to: currentChatUser?.id,
        from: userInfo?.id,
        message: data.message,
        receiverSecretKey: data.encryptedReceiverSecretKey,
        senderSecretKey: data.encryptedSenderSecretKey,
      });

      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage: {
          ...data.message,
        },
        fromSelf: true,
      });
     
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.id !== "emoji-open") {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(e.target)
        ) {
          setShowEmojiPicker(false);
        }
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      };
    }
  }, [grabPhoto]);

  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      {!showAudioRecorder && (
        <>
          <div className="flex gap-6">
            <BsEmojiSmile
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Emoji"
              id="emoji-open"
              onClick={handleEmojiModal}
            />
            {showEmojiPicker && (
              <div
                className="absolute bottom-24 left-16 z-40"
                ref={emojiPickerRef}
              >
                <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
              </div>
            )}
            <ImAttachment
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Attach File"
              onClick={() => setGrabPhoto(true)}
            />
          </div>
          <div className="w-full rounded-lg h-10 flex items-center">
            <input
              type="text"
              placeholder="Type a message"
              className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
          </div>
          <div className="flex w-10 items-center justify-center">
            <button>
              <MdSend
                className="text-panel-header-icon cursor-pointer text-xl"
                title="Send Message"
                onClick={sendMessage}
              />
            
            </button>
          </div>
        </>
      )}
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
      {showAudioRecorder && <CaptureAudio hide={setShowAudioRecorder} />}
    </div>
  );
}

export default MessageBar;
