import axios from "axios";
import { CollectiveAI } from "../../../api/types/collective-ai/create-collective-ai";

export const createCollectiveAI = (collectiveParams: CollectiveAI) => {
  console.log(collectiveParams);
  axios
    .post("https://", {
      body: collectiveParams,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
    .then((response) => {
      console.log("test Ai post", response);
    })
    .catch((err) => {
      console.log("error", err);
    });
};
export const getCollectiveAI = (id?: string) => {
  console.log("test ai collective get", "id", id);
  axios.get("https://", { params: id });
};
