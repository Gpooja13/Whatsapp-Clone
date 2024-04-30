import Avatar from "@/components/common/Avatar";
import Input from "@/components/common/Input";
import { useStateProvider } from "@/context/StateContext";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";
import EthCrypto from "eth-crypto";
import CryptoJS from "crypto-js";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/utils/FirebaseConfig";

function onboarding() {
  const router = useRouter();
  const [{ userInfo, newUser, googleAuthKey }, dispatch] = useStateProvider();
  const [name, setName] = useState(userInfo?.name || "");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState("/default_avatar.png");

  useEffect(() => {
    if (!newUser && !userInfo?.email) {
      router.push("/login");
    } else if (!newUser && userInfo?.email) {
      router.push("/");
    }
  }, [newUser, userInfo, router]);

  const onBoardUserHandler = async () => {
    if (validateDetails()) {
      const email = userInfo.email;
      const { privateKey, publicKey } = EthCrypto.createIdentity();
      const pk = CryptoJS.AES.encrypt(privateKey, googleAuthKey).toString();
      const docRef = await addDoc(collection(db, "whatsapp-clone-data"), {
        email: userInfo.email,
        privateKey: pk,
      });

      try {
        const { data } = await axios.post(ONBOARD_USER_ROUTE, {
          email,
          name,
          about,
          image,
          publicKey: publicKey,
        });

        if (data.status) {
          dispatch({ type: reducerCases.SET_NEW_USER, newUser: false });
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              id: data.data.id,
              name,
              email,
              profileImage: image,
              status: about,
              publicKey: data.data.publicKey,
            },
          });

          router.push("/");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const validateDetails = () => {
    if (name.length < 3) {
      return false;
    }
    return true;
  };

  return (
    <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center ">
      <div className="flex items-center justify-center gap-2">
        <Image src="/whatsapp.gif" alt="whatsapp" height={250} width={250} />
        <span className="text-6xl">Whatsapp</span>
      </div>
      <h2 className="text-2xl">Create your profile</h2>
      <div className="flex gap-6 mt-6">
        <div className="flex flex-col items-center mt-5 gap-6">
          <Input name="Display Name" state={name} setState={setName} label />
          <Input name="About" state={about} setState={setAbout} label />
          <div className="flex items-center justify-center ">
            <button
              className="flex items-center justify-center gap-6 bg-search-input-container-background p-3 px-4 my-2 rounded-lg"
              onClick={onBoardUserHandler}
            >
              Create Profile
            </button>
          </div>
        </div>
        <div>
          <Avatar type="xl" image={image} setImage={setImage} />
        </div>
      </div>
    </div>
  );
}

export default onboarding;
