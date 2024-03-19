// import { useStateProvider } from "@/context/StateContext";
// import React, { useState, useEffect } from "react";
// import { FaMicrophone, FaPauseCircle, FaTrash } from "react-icons/fa";
// import { MdSend } from "react-icons/md";
// import WaveSurfer from "wavesurfer.js";

// function CaptureAudio({ hide }) {
//   const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordedAudio, setRecordedAudio] = useState(null);
//   const [waveForm, setWaveForm] = useState(null);
//   const [recordingDuration, setRecordingDuration] = useState(0);
//   const [currentPlayBackTime, setCurrentPlayBackTime] = useState(0);
//   const [totalDuration, setTotalDuration] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [renderAudio, setRenderAudio] = useState(null);

//   const audioRef = useRef(null);
//   const mediaRecordedRef = useRef(null);
//   const waveFormRef = useRef(null);

//   const handleStartRecording = () => {
//     setRecordingDuration(0);
//     setCurrentPlayBackTime(0);
//     setTotalDuration(0);
//     setIsRecording(true);
//     navigator.mediaDevices
//       .getUserMedia({ audio: true })
//       .then((stream) => {
//         const mediaRecorder = new MediaRecorder(stream);
//         mediaRecordedRef.current = mediaRecorder;
//         audioRef.current.srcObject = stream;

//         const chunks = [];
//         mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
//         mediaRecorder.onstop = () => {
//           const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
//           const audioURL = URL.createObjectURL(blob);
//           const audio = new Audio(audioURL);
//           isRecordingAudio(audio);

//           waveForm.load(audioURL);
//         };
//         mediaRecorder.start();
//       })
//       .catch((error) => {
//         console.log("Error acessing microphone: ", error);
//       });
//   };
//   const handleStopRecording = () => {};
//   const handlePlayRecording = () => {};
//   const handlePauseRecording = () => {};

//   const sendRecording = () => {};

//   const formatTime = (time) => {
//     if (isNaN(time)) return "00:00";
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes.toString().padStart(2, "0")}:${seconds.toString.padStart(
//       2,
//       "0"
//     )}`;
//   };

//   useEffect(() => {
//     const waveSurface = WaveSurfer.create({
//       container: waveFormRef.current,
//       waveColor: "#ccc",
//       progressColor: "#4a9eff",
//       cursorColor: "#7ae3c3",
//       barWidth: 2,
//       height: 30,
//       responsive: true,
//     });
//     setWaveForm(waveSurface);
//     waveSurface.on("finish", () => {
//       setIsPlaying(false);
//     });
//     return () => {
//       waveForm.destroy();
//     };
//   }, []);

//   useEffect(() => {
//     if (waveForm) handleStartRecording();
//   }, [waveForm]);

//   useEffect(() => {
//     let interval;
//     if (isRecording) {
//       interval = setInterval(() => {
//         setRecordingDuration((prevDuration) => {
//           setTotalDuration(prevDuration + 1);
//           return prevDuration + 1;
//         });
//       }, 1000);
//     }

//     return () => {
//       clearInterval(interval);
//     };
//   }, [isRecording]);

//   return (
//     <div className="flex text-2xl w-full justify-end items-center">
//       <div className="pt-1">
//         <FaTrash className="text-panel-header-icon" onClick={() => hide()} />
//       </div>
//       <div className="mx-4 py-2 px-4 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg">
//         {isRecording ? (
//           <div className="text-red-500 animate-pulse w-60 text-center">
//             Recording <span>{recordingDuration}s</span>
//           </div>
//         ) : (
//           <div>
//             {recordedAudio && (
//               <>
//                 {!isPlaying ? (
//                   <FaPlay onClick={handlePlayRecording} />
//                 ) : (
//                   <FaStop onClick={handlePauseRecording} />
//                 )}
//               </>
//             )}
//           </div>
//         )}
//         <div className="w-60" ref={waveFormRef} hidden={isRecording} />
//         {recordedAudio && isPlaying && (
//           <span>{formatTime(currentPlayBackTime)}</span>
//         )}
//         {recordedAudio && !isPlaying && (
//           <span>{formatTime(currentPlayBackTime)}</span>
//         )}
//         <audio ref={audioRef} hidden />
//         <div className="mr-4">
//           {!isRecording ? (
//             <FaMicrophone
//               className="text-red-500"
//               onClick={handleStartRecording}
//             />
//           ) : (
//             <FaPauseCircle
//               className="text-red-500"
//               onClick={handleStopRecording}
//             />
//           )}
//         </div>
//         <div>
//           <MdSend
//             className="text-panel-header-icon cursor-pointer mr-4"
//             title="Send"
//             onClick={sendRecording}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CaptureAudio;
