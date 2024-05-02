import React from "react";
import { IoClose } from "react-icons/io5";
import Image from "next/image";

function PhotoLibrary({ setImage, hidePhotoLibrary }) {
  const images = [
    "/avatars/1.png",
    "/avatars/2.png",
    "/avatars/3.png",
    "/avatars/4.png",
    "/avatars/5.png",
    "/avatars/6.png",
    "/avatars/7.png",
    "/avatars/8.png",
    "/avatars/9.png",
  ];
  return (
    <div className="fixed top-0 left-0 max-h-[100vh] max-w-[100vw] h-full w-full flex justify-center items-center">
      <div className="h-max w-max bg-gray-900 gap-6 rounded-lg p-2">
        <div
          className="pt-2 pe-2 cursor-pointer flex items-end justify-end"
          onClick={hidePhotoLibrary}
        >
          <IoClose className="h-10 w-10 cursor-pointer" />
        </div>
        <div className="grid grid-cols-3 justify-center items-center gap-6 p-20 w-full">
          {images.map((image, index) => {
            return (
              <div key={index}
                onClick={() => {
                  setImage(images[index]);
                  hidePhotoLibrary(false);
                }}
              >
                <div className="w-24 h-24 cursor-pointer relative">
                  <Image src={image} alt="avatar" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PhotoLibrary;
