import usePopup from "./usePopup";
import ButtonSimple from "../components/button-simple";

interface ValidationProps {
  sucess: boolean;
  edit?: boolean;
  validationFn: () => string[];
}

export default function usePopupValidation(
  type: string
): [(props: ValidationProps) => JSX.Element, () => void] {
  const [ValidationPopup, doOpen, close] = usePopup(false);

  const Modal = (props: ValidationProps) => {
    const { validationFn, edit, sucess } = props;
    return (
      <ValidationPopup width="400px" height="auto">
        <div className="validation-popup">
          {sucess == true ? (
            <>
              <div className="title green">Sucess</div>
              <div className="line">
                The {type} was {edit ? "edited" : "created"} sucessfuly!
              </div>
            </>
          ) : (
            <>
              <div className="title">
                Please review before {edit ? "editing" : "publishing"}:
              </div>
              {validationFn().map((r) => (
                <div className="line" key={r}>
                  {r}
                </div>
              ))}
              {sucess == false && validationFn().length == 0 ? (
                <div className="line">Creation of this {type} failed.</div>
              ) : (
                <></>
              )}
            </>
          )}
          <ButtonSimple className="button" onClick={close}>
            Ok
          </ButtonSimple>
        </div>
      </ValidationPopup>
    );
  };

  return [Modal, doOpen];
}
