import Axios from "axios";
import handleGenericDelete from "../../../api/handleGenericDelete";
import { ApiError } from "../../../api/types";
import GenericDelete from "../../../api/types/delete";
import { API_URL } from "../../../constants";
import { TreeTypes } from "../../../redux/slices/createLessonSliceV2";

export default function deleteGeneric(
  type: TreeTypes,
  id: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    Axios.delete<GenericDelete | ApiError>(`${API_URL}${type}/${id}`)
      .then(handleGenericDelete)
      .then(resolve)
      .catch(reject);
  });
}
