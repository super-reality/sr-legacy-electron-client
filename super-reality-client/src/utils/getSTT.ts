import { isThisTypeNode } from "typescript";
import setLoading from "../renderer/redux/utils/setLoading";

// function to get the text from the audio-video file
export default function getSTT(inAudio: HTMLInputElement): Promise<any> {
  // eslint-disable-next-line global-require
  const { formData } = require("form-data");
  const form = new FormData();
  const getText = async () => {
    const response = await fetch("http://54.219.193.178:5000/speech_to_text", {
      method: "POST",
      body: form,
    });
    const json = await response.json();
    setLoading(false);
    console.log(json.text);

    return json.text;
  };

  if (inAudio && inAudio.files) {
    console.log("inAudio", inAudio.files[0]);

    setLoading(true);

    form.append("audio", inAudio.files[0]);

    console.log(form.get("Headers"));
  }
  const text = getText();
  return text;
}
