import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "@reach/router";
import reduxAction from "../../../../../redux/reduxAction";
import { AppState } from "../../../../../redux/stores/renderer";
import PostSkill from "../../support-help-utils/postSkill";
import createGPT3Document from "../../../../../../utils/api/createGPT3Document";
import { StepSectionProps } from "..";
import "./index.scss";
import {
  ImagesPreview,
  SkillsRenderer,
  VibesRenderer,
  getSingleName,
} from "../../../../forms";
import postSupportTicket from "../../support-help-utils/postSupportTicket";
import { IPostDocument } from "../../../../../api/types/gpt-3/GPT3";
import { supportTicketPayload } from "../../../../../api/types/support-ticket/supportTicket";
import { uploadFiles } from "../../../../forms/DropFile";
import usePopUp from "../../../../../hooks/usePopup";
import useNotification from "../../../../../hooks/useNotification";
import Support from "../../../../../../assets/images/support.png";
import SupperSpinner from "../../../../super-spinner";
// https://rules.sonarsource.com/typescript/RSPEC-2966
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable camelcase */

export default function StepReview(props: StepSectionProps): JSX.Element {
  const { goBack, index } = props;

  const {
    title,
    category,
    skills,
    description,
    images,
    categoryData,
    supportType,
    newCategory,
    newCategoryName,
    newSkill,
    newSkills,
    vibes,
  } = useSelector((state: AppState) => state.createSupportTicket);

  const navigate = useNavigate();

  const [PopUp, openPopup, closePopup] = usePopUp(false);

  const [popupLoading, setPopupLoading] = useState(false);

  const dispatch = useDispatch();

  const sendSupportTicket = async (): Promise<void> => {
    const vibesList = vibes.map((vibe) => vibe._id);
    const vibesLevelList = vibes.map((vibe) => vibe.level);
    let payload: supportTicketPayload = {
      title: title,
      description: description,
      supportType: supportType,
      skills: skills
        .filter((s) => {
          const { _id, name } = JSON.parse(s);
          return _id != name;
        })
        .map((skill) => JSON.parse(skill)._id),
      supportCategory: category,
      newCategory: newCategory,
      newSkill: newSkill,
      vibes: vibesList,
      vibesLevels: vibesLevelList,
    };

    const skillsArray = skills.map((skill) => {
      const { name, _id } = JSON.parse(skill);
      return { name, _id };
    });
    let filesArray: string[] = [];

    if (images && images?.length > 0) {
      await uploadFiles(images)
        .then((files) => {
          filesArray = [...files];
        })
        .catch((e) => console.log(e));
      payload = Object.assign(payload, { files: filesArray });
    }
    let newSkillsArray: string[] = [];
    if (newSkills && newSkills?.length > 0 && newSkill) {
      const promises = await newSkills.map(async (skill) => {
        const { name } = JSON.parse(skill);
        return PostSkill(name);
      });

      await Promise.all(promises).then((skillsRes) => {
        newSkillsArray = [...skillsRes.map((s) => s._id)];
      });

      payload = Object.assign(payload, {
        skills: payload.skills.concat(newSkillsArray),
      });
    }

    if (newCategoryName !== "" && newCategory) {
      payload = Object.assign(payload, { newCategoryName: newCategoryName });
      delete payload.supportCategory;
    }

    console.log(payload);

    let document_context = `You are a teacher expert in ${getSingleName(
      category,
      categoryData
    )}. You have skills in `;

    skillsArray.forEach((skill, ind) => {
      if (ind == 0) {
        document_context += skill.name;
      } else if (skillsArray.length - 1 == ind) {
        document_context += ` and ${skill.name}.`;
      } else {
        document_context += `, ${skill.name}`;
      }
    });

    document_context += ` And the problem your student is telling you about is ${description}.`;

    vibes.forEach((vibe, ind) => {
      const levels = [
        "a little bit of",
        "a considerable amount of",
        "a lot of",
      ];
      if (ind == 0) {
        document_context += ` Also your student is feeling ${
          levels[vibe.level - 1]
        } ${vibe.title}`;
      } else if (ind == vibes.length - 1) {
        document_context += ` and ${levels[vibe.level - 1]} ${vibe.title}.`;
      } else {
        document_context += `, ${levels[vibe.level - 1]} ${vibe.title}`;
      }
    });

    document_context += `\n\nq: What can I learn?\na: You can learn ${getSingleName(
      category,
      categoryData
    )}`;

    console.log(document_context);

    await postSupportTicket(payload)
      .then((res: supportTicketPayload) => {
        const document: IPostDocument = {
          document_name: res._id ?? "name",
          engine: "davinci",
          document_context: document_context,
        };

        (async () => {
          await createGPT3Document(document)
            .then((doc) => console.log(doc))
            .catch((e: any) => console.log(e));
        })();
        console.log(document);
        console.log(res);
      })
      .catch((e: any) => console.log(e));
  };

  const [showNotification] = useNotification({
    title: "Support ticket added!",
    subtitle: title!,
    body: title!,
    icon: "/icons/logo-os-notification.png",
  });

  const ManageTicket = async (): Promise<void> => {
    setPopupLoading(true);
    await sendSupportTicket();
    closePopup();
    showNotification();
    reduxAction(dispatch, {
      type: "SUPPORT_TICKET_RESET",
      arg: null,
    });

    navigate("/");
    setPopupLoading(false);
  };
  return (
    <>
      <div>
        <PopUp width="350px" height="170px">
          <div className="review-modal">
            {popupLoading ? (
              <>
                <div>
                  <SupperSpinner size="80px" text="Uploading" />
                </div>
              </>
            ) : (
              <>
                <img src={Support} />
                <div className="step-title">
                  Ready for sending a support ticket?
                </div>
                <div className="support-buttons">
                  <button onClick={closePopup} type="button">
                    No
                  </button>
                  <button onClick={ManageTicket} type="button">
                    Send It!
                  </button>
                </div>
              </>
            )}
          </div>
        </PopUp>

        <div className="title">Step {index} of 5</div>

        <div className="step">
          <div className="review-step">
            <div className="step-title">Title</div>
            <p>{title}</p>
            <span>Requested category</span>
            <p>{getSingleName(category, categoryData)}</p>
          </div>

          <div className="review-step imageslist">
            <div className="step-title">Description</div>
            <p>{description}</p>
            <span>Images</span>
            {/* <ul>{getImages}</ul> */}
            {images && images.length > 0 ? (
              <ImagesPreview values={images} removable="false" columns={3} />
            ) : (
              <p>No images selected</p>
            )}
          </div>

          <div className="review-step">
            <div className="step-title">Skills</div>
            <SkillsRenderer skills={skills.map((skill) => JSON.parse(skill))} />
          </div>

          <div className="review-step">
            <div className="step-title">Vibes</div>
            <VibesRenderer vibes={vibes} />
          </div>

          <div className="support-buttons">
            <button onClick={goBack} type="button">
              Back
            </button>
            <button onClick={openPopup} type="button">
              Ask for help
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
