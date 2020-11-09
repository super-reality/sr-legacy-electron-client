import { isThisTypeNode } from "typescript";
import setLoading from "../renderer/redux/utils/setLoading";

export default function getSTT(inAudio: HTMLInputElement): void {
  if (inAudio && inAudio.files) {
    console.log("inAudio", inAudio.files[0]);
    // eslint-disable-next-line
    const { formData } = require("form-data");
    

    setLoading(true);
    const form = new FormData();
    form.append("audio", inAudio.files[0]);
    
    console.log(form.get("Headers"));
    const getText = async () => {
      const response = await fetch(
        "http://54.219.193.178:5000/speech_to_text",
        {
          method: "POST",
          body: form,
        }
      );
      const json = await response.json();
      setLoading(false);
      console.log(json.text);

      return json.text;
    };
    getText();
  }
}
