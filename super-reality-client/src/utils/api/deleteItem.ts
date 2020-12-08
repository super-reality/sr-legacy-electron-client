import Axios from "axios";
import setLoading from "../../renderer/redux/utils/setLoading";
import { ApiError, ApiOk } from "../../renderer/api/types";
import { API_URL } from "../../renderer/constants";

export default function deleteItem(type: string, id: string): Promise<void> {
  setLoading(true);
  return new Promise((resolve, reject) => {
    Axios.delete<ApiOk | ApiError>(`${API_URL}${type}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: "",
    })
      .then((d) => {
        if (d.data.err_code == 0) resolve();
        else reject(d.data.message);
        setLoading(false);
      })
      .catch((err) => {
        reject(err);
        setLoading(false);
      });
  });
}
