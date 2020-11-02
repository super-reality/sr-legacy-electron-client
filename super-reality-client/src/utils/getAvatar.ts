import Axios from 'axios';
import FormData from 'form-data';
import handleGetTTS from "../renderer/api/handleGetTTS";
import setLoading from "../renderer/redux/utils/setLoading";


export default function getAvatar(
    inAudio: HTMLInputElement,
    video: HTMLInputElement,

): void {





    if (inAudio && inAudio.files && video && video.files) {
        const form = new FormData();
        form.append('audio_file', inAudio.files[0]);
        form.append('video_file', video.files[0]);

        setLoading(true);
    Axios.post<string>(`http://54.219.193.178:5000/speech_to_text`,
        form, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    }
    )
        .then(handleGetTTS)
        .then((res) => {
            setLoading(false);
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
            setLoading(false);
        });

    }else{
        console.log("no audio or video", inAudio, video);
    }


    
}
