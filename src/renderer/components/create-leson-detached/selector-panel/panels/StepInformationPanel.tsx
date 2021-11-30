import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "../../../../hooks/useDebounce";
import reduxAction from "../../../../redux/reduxAction";
import { AppState } from "../../../../redux/stores/renderer";
import BaseInput from "../../../base-input";
import updateStep from "../../lesson-utils/updateStep";
import useBasePanel from "../useBasePanel";

import { ReactComponent as IconInfo } from "../../../../../assets/svg/information.svg";

interface StepInformationPanelProps {
  stepId: string;
}

export default function StepInformationPanel(props: StepInformationPanelProps) {
  const { stepId } = props;
  const dispatch = useDispatch();
  const { treeSteps } = useSelector((state: AppState) => state.createLessonV2);

  const step = useMemo(() => (stepId ? treeSteps[stepId] : undefined), [
    stepId,
    treeSteps,
  ]);

  const [stepName, setStepName] = useState(step?.name || "");

  const debouncer = useDebounce(1000);
  const handleNameChange = useCallback(
    (e) => {
      const newName = e.currentTarget.value;
      setStepName(newName);

      if (step) {
        debouncer(() => {
          updateStep({ name: newName }, step._id).then((newStep) => {
            if (newStep) {
              reduxAction(dispatch, {
                type: "CREATE_LESSON_V2_SETSTEP",
                arg: { step: newStep },
              });
            }
          });
        });
      }
    },
    [step, stepName, debouncer]
  );

  const Panel = useBasePanel("Information", IconInfo, {});

  return (
    <Panel>
      <div className="panel-wide">
        <BaseInput
          title="Step Name"
          value={stepName}
          onChange={handleNameChange}
        />
      </div>
    </Panel>
  );
}
