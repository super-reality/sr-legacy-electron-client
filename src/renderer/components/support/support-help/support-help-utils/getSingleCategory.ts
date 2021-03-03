import Axios from "axios";
import handleSupportSingleCategoryGet from "../../../../api/handleSupportSingleCategoryGet";
import { ApiError } from "../../../../api/types";
import { ISingleCategoryGet } from "../../../../api/types/support-ticket/supportTicket";
import { API_URL } from "../../../../constants";

export default function getCategories(
  id: string
): Promise<ISingleCategoryGet["category"]> {
  return new Promise((resolve, reject) => {
    Axios.get<ISingleCategoryGet | ApiError>(`${API_URL}category/${id}`)
      .then(handleSupportSingleCategoryGet)
      .then(resolve)
      .catch(reject);
  });
}
