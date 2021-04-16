import {
  useEffect,
  useState,
  useCallback,
  useRef,
  FunctionComponent,
  SVGProps,
} from "react";
import "./index.scss";

import { useSelector } from "react-redux";
import { ReactComponent as Happy } from "../../../assets/svg/face-happy.svg";
import { ReactComponent as Blink } from "../../../assets/svg/face-blink.svg";
import { AppState } from "../../redux/stores/renderer";

type Expressions = "HAPPY" | "BLINK";

type Modes = "FACE" | "POINTS";

const expressions: Record<
  Expressions,
  FunctionComponent<SVGProps<SVGSVGElement>>
> = {
  HAPPY: Happy,
  BLINK: Blink,
};

export default function TeacherBotTop(): JSX.Element {
  const points = useSelector((state: AppState) => state.auth.points);
  const [mode, setMode] = useState<Modes>("FACE");
  const [face, setFace] = useState<Expressions>("HAPPY");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const DoBlink = useCallback(() => {
    setFace("BLINK");
    setTimeout(() => setFace("HAPPY"), 100);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(
      () => DoBlink(),
      1000 + Math.floor(Math.random() * 15000)
    );
  }, []);

  const onClick = useCallback(() => {
    DoBlink();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setTimeout(() => setMode(mode == "FACE" ? "POINTS" : "FACE"), 50);
  }, [mode]);

  useEffect(() => {
    DoBlink();
  }, []);

  const Face = expressions[face];

  return (
    <div className="teacher-bot-top" onClick={onClick}>
      {mode == "FACE" ? (
        <div className="face">
          <Face width="40px" height="40px" />
        </div>
      ) : (
        <div className="points">{points}</div>
      )}
    </div>
  );
}
