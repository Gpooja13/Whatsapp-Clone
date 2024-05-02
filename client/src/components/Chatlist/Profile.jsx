import { reducerCases } from "@/context/constants";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useStateProvider } from "@/context/StateContext";
import Avatar from "@/components/common/Avatar";
import Input from "@/components/common/Input";
import axios from "axios";
import { UPDATE_USERINFO } from "@/utils/ApiRoutes";

const Profile = () => {
  const [{ userInfo }, dispatch] = useStateProvider();
  const [name, setName] = useState(userInfo?.name || "");
  const [email, setEmail] = useState("");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState("/default_avatar.png");

  const updateInfo = async () => {
    if (validateDetails()) {
      try {
        const { data } = await axios.post(UPDATE_USERINFO, {
          email,
          name,
          about,
          image,
        });

        if (data.msg) {
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
          dispatch({ type: reducerCases.SET_PROFILE });
        }
      } catch (error) {
        console.log(error);
      }
    }
    else{
      alert("Name can't be of less than 3 characters");
    }
  };

  const validateDetails = () => {
    if (name.length < 3) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
    setAbout(userInfo.status);
    setImage(userInfo.profileImage);
  }, []);

  return (
    <div className="border-conversation-border border-1 w-full bg-conversation-panel-background flex flex-col z-10 max-h-screen overflow-hidden">
      <div className="h-16 px-4 py-5 flex gap-10 items-center justify-between bg-panel-header-background  text-primary-strong">
        <span>User Profile</span>
        <IoClose
          className="cursor-pointer text-icon-lighter text-2xl"
          onClick={() => dispatch({ type: reducerCases.SET_PROFILE })}
          title="Close"
        />
      </div>
      <div className="flex flex-col h-full bg-search-input-container-background">
        <div className="m-6">
          <div>
            <Avatar type="xl" image={image} setImage={setImage} />
          </div>
          <div className="flex h-full flex-col mt-8 gap-4">
            <Input name="Display Name" state={name} setState={setName} label />
            <Input name="Email" state={email} setState={setEmail} disabledInput={true} label />
            <Input name="About" state={about} setState={setAbout} label />
            <div className="flex items-center justify-center ">
              <button
                className="flex items-center justify-center gap-6 p-3 px-4 my-2 rounded-lg bg-conversation-panel-background text-lg text-primary-strong"
                onClick={updateInfo}
              >
                Save Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
