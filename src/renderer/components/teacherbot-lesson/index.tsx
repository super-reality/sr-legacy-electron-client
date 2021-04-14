import {
  useEffect,
  useState,
  useCallback,
  useRef,
  FunctionComponent,
  SVGProps,
} from "react";
import "./index.scss";

import { ReactComponent as Happy } from "../../../assets/svg/face-happy.svg";
import { ReactComponent as Blink } from "../../../assets/svg/face-blink.svg";

type Expressions = "HAPPY" | "BLINK";

const expressions: Record<
  Expressions,
  FunctionComponent<SVGProps<SVGSVGElement>>
> = {
  HAPPY: Happy,
  BLINK: Blink,
};

export default function TeacherBotLesson(): JSX.Element {
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
  }, []);

  useEffect(() => {
    DoBlink();
  }, []);

  const Face = expressions[face];

  return (
    <div className="teacher-bot-lesson" onClick={onClick}>
      <Face width="120px" height="60px" />
    </div>
  );
}
