import React, { useCallback, useRef, useState } from "react";
import "./index.scss";
import path from 'path';
import fs from 'fs';
import userDataPath from "../../../utils/userDataPath";
import ButtonSimple from "../../components/button-simple";
import createLessonInterface from "../../../utils/createLessonInterface";
import getFace from "../../../utils/getFace";
import getTTS from "../../../utils/getTTS";
import getSTT from "../../../utils/getSTT";
import ipcSend from "../../../utils/ipcSend";
import getAvatar from "../../../utils/getAvatar";

export default function Test(): JSX.Element {
  const onCLose = useCallback(() => console.log("Closed!"), []);
  const imageInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const avatarVideoInput = useRef<HTMLInputElement>(null);
  const textInput = useRef<HTMLInputElement>(null);
  const audioInput = useRef<HTMLInputElement>(null);
  const avatarAudioInput = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(textInput.current?.value);
  const [isVideoPlayer, setIsVideoPlayer] = useState(false);
  const [isFileExist, setIsFileExist] = useState(false);

  // eslint-disable-next-line global-require
  const { remote } = require("electron");
  const WIN = remote.getCurrentWindow();
  const ses = WIN.webContents.session;


  const videoFaceOutput = path.join(userDataPath(), "face_api_output.mp4");
  console.log(videoFaceOutput);
  
  const onClick = useCallback(() => {
    createLessonInterface({}).then(onCLose);
  }, []);

  const testFace = useCallback(() => {
    if (imageInput.current && videoInput.current) {

      ses.clearCache();
      getFace(imageInput.current, videoInput.current);
      
    }
  }, [imageInput, videoInput]);

  // create video player
  const createVideoPlayer = ()=>{
      fs.stat(videoFaceOutput, function(err,stat){
        console.log(stat);
        if(stat.isFile()){
           setIsFileExist(true);
         }
        
      });
      
  };
  console.log(createVideoPlayer);
  // test Avatar API
  const testAvatar = useCallback(() => {
    if (audioInput.current && avatarVideoInput.current) {
      getAvatar(audioInput.current, avatarVideoInput.current);
    }
  }, [audioInput, avatarVideoInput]);

  // test text to speech 
  const onChange = useCallback(() => {
    if(textInput.current && textInput.current?.value)
    setText(textInput.current.value);
    console.log(text);
  }, [text])
  const testTextToSpeech = useCallback(() => {
    if (text) {
      getTTS(text);
    }
    console.log(text)
  }, [text]);
  // test speech to text
  const testSpeechToText = useCallback(() => {
    if (audioInput.current) {
      console.log(audioInput.current.files)
       getSTT(audioInput.current);
    }
  }, [audioInput]);
  const pythonTest = useCallback(() => {
    ipcSend({
      method: "pythonExec",
      arg: ["Test", "Argument"],
      to: "background",
    });
  }, []);

  return (
    <div>
      <div className="mid">
        <ButtonSimple width="200px" height="24px" margin="auto" onClick={onClick}>
          Click me!
      </ButtonSimple>
        <ButtonSimple
          width="200px"
          height="24px"
          margin="auto"
          onClick={pythonTest}
        >
          Test python background
      </ButtonSimple>
        <div className="container-felx">
          <h1>
            Face API
          </h1>
          <ButtonSimple
            width="200px"
            height="24px"
            margin="16px auto"
            onClick={testFace}
          >
            Test Face API
          </ButtonSimple>
          Select Image
          <input ref={imageInput} type="file" accept="image/*" />
          Select Video
          <input ref={videoInput} type="file" accept="video/*" />
         
          <ButtonSimple 
            width="200px"
            height="24px"
            margin="16px auto"
            onClick={createVideoPlayer}
          >
            Open Video Player
            </ButtonSimple>
          {(isFileExist) ? (

            <video controls width="250">
              <source src={videoFaceOutput} 
              type="video/mp4"/>
            </video>
          ): (
            <div>
              {`check the file path ${videoFaceOutput}`}
            </div>
          )
          }

        </div>
      </div>

      <div className="test-buttons mid">
        <h1>
          Text To Speech API
          </h1>
        <ButtonSimple
          width="200px"
          height="24px"
          margin="16px auto"
          onClick={testTextToSpeech}
        >
          Test Text To Speach
      </ButtonSimple>
      Type Text
      <input ref={textInput} type="text" onChange={onChange} />

      </div>
      <div className="test-buttons mid">
        <h1> Speech To Text API</h1>
        <ButtonSimple
          width="200px"
          height="24px"
          margin="16px auto"
          onClick={testSpeechToText}
        >
          Test Speach to Text
      </ButtonSimple>
      Select Audio File
      <input ref={audioInput} type="file" accept="audio/*" />

      </div>
      <div className="test-buttons mid">
        <h1> Avatar API</h1>
        <ButtonSimple
          width="200px"
          height="24px"
          margin="16px auto"
          onClick={testAvatar}
        >
          Test Speach to Text
      </ButtonSimple>
      Select Audio File
      <input ref={avatarAudioInput} type="file" accept="audio/*" />
      Select Video File
      <input ref={avatarVideoInput} type="file" accept="video/*" />

      </div>
    </div>

  );
}
