import React, { useEffect } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import { useRouter } from "next/router";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";

function login() {
  const router = useRouter();

  const [{ userInfo, newUser }, dispatch] = useStateProvider();

  useEffect(() => {
    if (userInfo?.id && !newUser) {
      router.push("/");
    }
  }, [userInfo, newUser]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const data=await signInWithPopup(firebaseAuth, provider);
    const uid=data.user.uid;
    dispatch({
      type: reducerCases.SET_GOOGLE_AUTH_KEY,
      googleAuthKey: uid,
    });
    const {
      user: { displayName: name, email, photoURL: profileImage },
    } = await signInWithPopup(firebaseAuth, provider);
    try {
      if (email) {
        const { data } = await axios.post(CHECK_USER_ROUTE, { email });
        if (!data.status) {
          dispatch({ type: reducerCases.SET_NEW_USER, newUser: true });
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              name,
              email,
              profileImage,
            },
          });
          router.push("/onboarding");
        } else {
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
            //  userInfo: data.data
            userInfo: {
              id,
              name,
              email,
              profileImage,
              publicKey,
              status,
            },
          });
         
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
      <div className="flex items-center justify-center gap-2 text-white">
        <Image src="/whatsapp.gif" alt="whatsapp" height="250" width="250" />
        <span className="text-6xl">Whatsapp</span>
      </div>
      <button
        className="flex items-center justify-center gap-6 bg-search-input-container-background p-3 px-4 my-5 rounded-lg"
        onClick={handleLogin}
      >
        <FcGoogle className="text-4xl" />
        <span className="text-white text-xl">Login with Google</span>
      </button>
    </div>
  );
}

export default login;
