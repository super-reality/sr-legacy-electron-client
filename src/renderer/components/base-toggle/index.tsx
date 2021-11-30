import Flex from "../flex";
import "../containers.scss";
import Toggle from "../toggle";

interface BaseToggleProps {
  title: string;
  value: boolean;
  callback: (val: boolean) => void;
}

export default function BaseToggle(props: BaseToggleProps): JSX.Element {
  const { title, value, callback } = props;

  return (
    <Flex>
      <div
        className="container-with-desc"
        style={{
          margin: "4px 0",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>{title}</div>
        <Toggle value={value} callback={callback} />
      </div>
    </Flex>
  );
}
