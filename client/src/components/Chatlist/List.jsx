import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect } from "react";
import ChatLIstItem from "./ChatLIstItem";
import CryptoJS from "crypto-js";
import EthCrypto from "eth-crypto";

function List() {
  const [{ userInfo, privateKey, userContacts, filteredContacts }, dispatch] =
    useStateProvider();

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
        type: reducerCases.SET_USERS_CONTACTS,
        userContacts: decrypted,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getContacts = async () => {
    try {
      const {
        data: { users, onlineUsers },
      } = await axios(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo.id}`);

      dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers });
      decryptMessages(users);

      dispatch({ type: reducerCases.SET_USERS_CONTACTS, userContacts: users });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userInfo?.id && privateKey) {
      getContacts();
    }
  }, [userInfo, privateKey]);

  return (
    <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
      {filteredContacts && filteredContacts.length > 0
        ? filteredContacts.map((contact) => (
            <ChatLIstItem data={contact} key={contact.id} />
          ))
        : userContacts.map((contact) => (
            <ChatLIstItem data={contact} key={contact.id} />
          ))}
    </div>
  );
}

export default List;
