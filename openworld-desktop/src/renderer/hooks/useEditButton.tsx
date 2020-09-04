import React, { useCallback } from "react";
import Axios from "axios";
import { ReactComponent as EditButton } from "../../assets/svg/edit.svg";
import { ApiError, ApiJoin } from "../api/types";
import handleGenericGet from "../api/handleGenericGet";
import { API_URL } from "../constants";
import { ICollectionGet } from "../api/types/collection/get";

function triggerEditCollection(data: ICollectionGet) {
  console.log("triggerEditCollection", data);
}

type EditArg = ApiJoin & { id: string };

function fetchData<A>(arg: EditArg): Promise<A> {
  return new Promise((resolve, reject) => {
    Axios.get<NonNullable<typeof arg["api"]> | ApiError>(
      `${API_URL}${arg.type}/${arg.id}`
    )
      .then(handleGenericGet)
      .then((d: any) => resolve(d))
      .catch(reject);
  });
}

export default function useEditButton(arg: EditArg): () => JSX.Element {
  const callback = useCallback(() => {
    if (arg.type == "collection") {
      fetchData<NonNullable<typeof arg["api"]>>(arg).then((getData) => {
        triggerEditCollection(getData.collection);
      });
    }
  }, []);

  const Component = () => (
    <div
      className="icon-button"
      style={{
        margin: "auto",
        display: "flex",
      }}
      onClick={(e) => {
        e.stopPropagation();
        callback();
      }}
    >
      <EditButton
        width="20px"
        height="20px"
        fill="var(--color-icon)"
        style={{ margin: "auto" }}
      />
    </div>
  );

  return Component;
}
