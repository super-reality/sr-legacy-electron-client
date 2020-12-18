import { BaseBoxProps } from "./boxes/boxes";
import DialogBox from "./boxes/dialog-box";
import FindBox from "./boxes/find-box";
import FXBox from "./boxes/fx-box";
import ImageBox from "./boxes/image-box";
import VideoBox from "./boxes/video-box";
import { BaseItem } from "./item";

type RefDivComponent<T extends BaseItem> = React.ForwardRefExoticComponent<
  BaseBoxProps<T> & React.RefAttributes<HTMLDivElement>
>;

export default function getItemComponent<T extends BaseItem>(
  item: T
): RefDivComponent<T> | undefined {
  let ItemComponent: RefDivComponent<T> | undefined;

  // We instantiate to any because TS does not like to do this
  if (item) {
    switch (item?.type) {
      case "dialog":
        ItemComponent = DialogBox as any;
        break;
      case "focus_highlight":
        ItemComponent = FindBox as any;
        break;
      case "fx":
        ItemComponent = FXBox as any;
        break;
      case "image":
        ItemComponent = ImageBox as any;
        break;
      case "video":
        ItemComponent = VideoBox as any;
        break;
      default:
        break;
    }
  }

  return ItemComponent;
}
