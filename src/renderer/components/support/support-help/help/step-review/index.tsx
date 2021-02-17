import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import reduxAction from "../../../../../redux/reduxAction";
import { AppState } from "../../../../../redux/stores/renderer";
import { StepSectionProps, getNames, getSingleName } from "..";
import "./index.scss";
import { ImagesPreview } from "../../../../forms";
/* import postSupportTicket from "../../support-help-utils/postSupportTicket"; */
import { supportTicketPayload } from "../../../../../api/types/support-ticket/supportTicket";
import { uploadFiles } from "../../../../forms/DropFile";
import usePopUp from "../../../../../hooks/usePopup";
import useNotification from "../../../../../hooks/useNotification";
import Support from "../../../../../../assets/images/support.png";
import SupperSpinner from "../../../../super-spinner";

// https://rules.sonarsource.com/typescript/RSPEC-2966
/* eslint-disable @typescript-eslint/no-non-null-assertion */

export default function StepReview(props: StepSectionProps): JSX.Element {
  const { goBack, index } = props;

  const {
    title,
    category,
    skills,
    description,
    images,
    skillsData,
    categoryData,
    supportType,
    newCategory,
    newCategoryName,
    newSkill,
    newSkillName,
    vibes,
  } = useSelector((state: AppState) => state.createSupportTicket);

  const [PopUp, openPopup, closePopup] = usePopUp(false);

  const [popupLoading, setPopupLoading] = useState(false);

  const dispatch = useDispatch();

  const getSkills =
    skills &&
    skillsData &&
    getNames(skills, skillsData).map((skill) => (
      <li className="review-skill" key={skill._id}>
        {skill.name}
      </li>
    ));

  const getVibes =
    vibes &&
    vibes.map((vibe) => (
      <li className="review-skill" key={vibe._id}>
        {vibe.name}
      </li>
    ));

  const sendSupportTicket = async (): Promise<void> => {
    const skillArray: string[] = [...skills!];

    const i = skillArray.indexOf(newSkillName!);

    if (i !== -1) skillArray.splice(i, 1);

    const vibesList = vibes && vibes.map((vibe) => vibe._id);
    const vibesLevelList = vibes && vibes.map((vibe) => vibe.level);
    let payload: supportTicketPayload = {
      title: title!,
      description: description!,
      supportType: supportType!,
      skills: skillArray!,
      supportCategory: category!,
      newCategory: newCategory!,
      newSkill: newSkill!,
      vibes: vibesList!,
      vibesLevels: vibesLevelList!,
    };
    let filesArray: string[] = [];

    if (images && images?.length > 0) {
      await uploadFiles(images)
        .then((files) => {
          filesArray = [...files];
        })
        .catch((e) => console.log(e));
      payload = Object.assign(payload, { files: filesArray });
    }

    if (newSkillName !== "" && newSkill) {
      payload = Object.assign(payload, { newSkillName: newSkillName });
    }

    if (newCategoryName !== "" && newCategory) {
      payload = Object.assign(payload, { newCategoryName: newCategoryName });
      delete payload.supportCategory;
    }

    console.log(payload);
    /*     await postSupportTicket(payload)
      .then((res: supportTicketPayload) => {
        console.log(res);
      })
      .catch((e: any) => console.log(e)); */
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

    reduxAction(dispatch, {
      type: "SET_SUPPORT_TICKET",
      arg: {
        supportScreen: 0,
      },
    });
    setPopupLoading(false);
  };
  return (
    <div>
      <div className="title">Step {index} of 5</div>

      <div className="step">
        <PopUp
          /* style={{ position: "absolute", top: "30%", left: "6%" }} */
          width="350px"
          height="170px"
        >
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
        <div className="review-step">
          <div className="step-title">Title</div>
          <p>{title}</p>
          <span>Requested category</span>
          <p>
            {category && categoryData && getSingleName(category, categoryData)}
          </p>
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
          <ul className="skills-list">{getSkills}</ul>
        </div>

        <div className="review-step">
          <div className="step-title">Vibes</div>
          <ul className="skills-list">{getVibes}</ul>
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
  );
}
