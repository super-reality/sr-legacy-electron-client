import fs from "fs";
import setLoading from "../renderer/redux/utils/setLoading";

export default function getSTT(audioFile: string): Promise<any> {
  // setLoading(true);
  const getText = async (form: FormData) => {
    const response = await fetch("http://54.219.193.178:5000/speech_to_text", {
      method: "POST",
      body: form,
    });
    const json = await response.json();
    setLoading(false);
    return json.text;
  };

  const form = new FormData();
  try {
    const fileContent = fs.readFileSync(audioFile);
    const file = new File([fileContent], audioFile);
    form.append("audio", file);
  } catch (e) {
    console.error(e);
  }
  return getText(form);
}
