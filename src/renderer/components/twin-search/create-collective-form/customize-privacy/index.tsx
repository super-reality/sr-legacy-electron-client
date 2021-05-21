import { RouteComponentProps, useLocation, useNavigate } from "@reach/router";
import { useState } from "react";
import { ReactComponent as RightArrow } from "../../../../../assets/svg/right-arrow-icon.svg";
import ButtonSimple from "../../../button-simple";
import "./index.scss";

export default function CustomizePrivacy(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: RouteComponentProps
): JSX.Element {
  const [privacy, setPrivacy] = useState<string>("own");
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleOptionClick = (option: string) => {
    setPrivacy(option);
    setOpenDropdown(false);
  };

  return (
    <>
      <div className="form-header">
        <div className="title">Tell us more</div>
        <div className="description">
          Is this Neural network going to be private or open to all.
        </div>
      </div>
      <div className="form-body">
        <ButtonSimple
          className="options-btn"
          onClick={() => setOpenDropdown(!openDropdown)}
        >
          <div className="btn-title">
            {privacy === "public" ? "Create Public" : "Create My Own"}
          </div>
        </ButtonSimple>
        {openDropdown && (
          <div className="privacy-dropdown">
            {privacy === "public" ? (
              <div
                className="privacy-dropdown-options"
                onClick={() => handleOptionClick("own")}
              >
                Create My Own
              </div>
            ) : (
              <div
                className="privacy-dropdown-options"
                onClick={() => handleOptionClick("public")}
              >
                Create Public
              </div>
            )}
          </div>
        )}
        <ButtonSimple
          className="options-btn"
          onClick={() => {
            navigate("/customize/name");
            console.log(location.pathname);
          }}
        >
          <div className="btn-title">
            {privacy === "public" ? "Create Public" : "Create My Own"}
          </div>
          <RightArrow fill="var(--color-text))" />
        </ButtonSimple>
      </div>
      <div className="form-footer">
        <ButtonSimple
          className="back-btn"
          onClick={() => {
            navigate("/");
            console.log(location.pathname);
          }}
        >
          Back
        </ButtonSimple>
        <ButtonSimple
          className="next-btn"
          onClick={() => {
            navigate("/customize/name");
          }}
        >
          Skip
        </ButtonSimple>
      </div>
    </>
  );
}
