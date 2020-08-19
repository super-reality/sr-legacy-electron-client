import React, { useCallback, useState } from "react";
import "./index.scss";
import "../containers.scss";
import "../create-lesson/index.scss";
import InsertMedia from "../insert-media";
import Flex from "../flex";
import Select from "../select";
import { InputChangeEv, AreaChangeEv } from "../../../types/utils";
import ButtonSimple from "../button-simple";
import { IStep } from "../../../types/api";

const CVFnOptions = ["Computer vision On", "Computer vision Off"];

type FnOptions = "And" | "Or" | "Ignore";

const ImageFnOptions: FnOptions[] = ["And", "Or", "Ignore"];

interface ImageFnData {
  url: string;
  fn: FnOptions;
}

const CVNextStepOptions = ["On Highlight clicked", "On Text reading finished"];

export default function StepAuthoring(): JSX.Element {
  const [CVFnImage, setCVFnImage] = useState("");
  const [CVFn, setCVFn] = useState(CVFnOptions[0]);

  const [CVNextStep, setCVNextStep] = useState(CVNextStepOptions[0]);
  const [stepname, setStepname] = useState("");
  const [description, setDescription] = useState("");
  const [CVImageData, setCVImageData] = useState<ImageFnData[]>([]);

  const setImageCVFn = (fn: FnOptions, index: number) => {
    const arr = [...CVImageData];
    arr[index].fn = fn;
    setCVImageData(arr);
  };

  const insertCVImage = (image: string, index: number) => {
    const arr = [...CVImageData];
    arr.splice(index, 1, { url: image, fn: "Or" });
    setCVImageData(arr);
  };

  const handleStepnameChange = useCallback((e: InputChangeEv): void => {
    setStepname(e.currentTarget.value);
  }, []);

  const handleDescriptionChange = useCallback((e: AreaChangeEv): void => {
    setDescription(e.currentTarget.value);
  }, []);

  const addStep = useCallback(() => {
    const newStep: IStep = {
      id: "randomid",
      media: CVImageData.map((d) => d.url),
      description,
      name: stepname,
      avatarUrl: "",
      creator: "",
      rating: 0,
      checkState: false,
    };
    // code to add to the steps list here
  }, []);

  const datekey = new Date().getTime();

  return (
    <div className="step-authoring-grid">
      <InsertMedia
        snip
        imgUrl={CVFnImage}
        style={{
          marginBottom: "8px",
          width: "100%",
          height: CVFnImage ? "140px" : "auto",
        }}
        callback={setCVFnImage}
      />
      {CVFnImage ? (
        <>
          <Flex>
            <div className="container-with-desc">
              <div>CV Function</div>
              <Select current={CVFn} options={CVFnOptions} callback={setCVFn} />
            </div>
          </Flex>
          <Flex>
            <div className="container-with-desc" style={{ marginTop: "8px" }}>
              <div>CV Targets</div>
              <Flex style={{ flexDirection: "column" }}>
                {[...CVImageData, undefined].map((d, i) => {
                  const fn = d?.fn;
                  const url = d?.url || undefined;
                  return (
                    <>
                      <InsertMedia
                        snip
                        // eslint-disable-next-line react/no-array-index-key
                        key={`insert-media-${datekey}-${i}`}
                        imgUrl={url}
                        style={{
                          marginBottom: "8px",
                          width: "100%",
                          height: url ? "140px" : "auto",
                        }}
                        callback={(str) => {
                          insertCVImage(str, i);
                        }}
                      />
                      {fn ? (
                        <div
                          className="container-with-desc"
                          style={{ marginBottom: "16px" }}
                        >
                          <div>Image Function</div>
                          <Select
                            current={fn}
                            options={ImageFnOptions}
                            callback={(f) => {
                              setImageCVFn(f, i);
                            }}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </>
                  );
                })}
              </Flex>
            </div>
          </Flex>
        </>
      ) : (
        <></>
      )}

      <Flex>
        <div className="container-with-desc">
          <div>Step Name</div>
          <input
            placeholder="Step name"
            value={stepname}
            onChange={handleStepnameChange}
            onKeyDown={handleStepnameChange}
          />
        </div>
      </Flex>

      <Flex>
        <div className="container-with-desc">
          <div>Step Description</div>
          <textarea
            style={{ resize: "vertical", minHeight: "64px" }}
            placeholder=""
            value={description}
            onChange={handleDescriptionChange}
            onKeyDown={handleDescriptionChange}
          />
        </div>
      </Flex>

      <Flex>
        <div className="container-with-desc">
          <div>Next Step</div>
          <Select
            current={CVNextStep}
            options={CVNextStepOptions}
            callback={setCVNextStep}
          />
        </div>
      </Flex>
      <Flex>
        <ButtonSimple
          margin="8px auto"
          width="200px"
          height="24px"
          onClick={addStep}
        >
          Save and add new step
        </ButtonSimple>
      </Flex>
    </div>
  );
}
