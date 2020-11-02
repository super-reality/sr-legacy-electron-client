import fs from "fs";
import path from "path";
import http from "http";
import Axios from "axios";
import FormData from 'form-data';
import setLoading from "../renderer/redux/utils/setLoading";
import userDataPath from "./userDataPath";

// export default function getFace(image: string, video: string): void {
export default function getSTT(
  inAudio: HTMLInputElement,
 
): void {
  
  if(inAudio && inAudio.files){
    console.log(inAudio.files[0].path)
  }
  setLoading(true);
  const data = new FormData();
data.append('audio', fs.createReadStream('C:/Users/denis/OneDrive/Pictures/SuperReality/Face/voice_test1.m4a'));

const config = {
  
  headers: { 
    "content-type":"multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
  },
  data : data
};

Axios.post<string>("http://54.219.193.178:5000/speech_to_text", config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  
  console.log(error);

});


}
/*
method: "POST",
  url: 'http://54.219.193.178:5000/speech_to_text',
  */

//   const options = {
//     method: "POST",
//     hostname: "54.219.193.178",
//     port: 8080,
//     path: "/face_api",
//     headers: {},
//     maxRedirects: 20,
//   };

//   const req = http.request(options, (res) => {
//     console.log(res);
//     setLoading(false);
//     });

//   if (inAudio && inAudio.files) {
//     console.log(inAudio.files[0])
//     const postData = `------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="audio"; filename="${
//       inAudio.files[0].path
//     }"\r\nContent-Type: "audio/x-m4a"\r\n\r\n${fs.readFileSync(
//       inAudio.files[0].path
//     )}\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW`;

//     req.setHeader(
//       "content-type",
//       "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
//     );

//     req.write(postData);
//   }
//   req.end();