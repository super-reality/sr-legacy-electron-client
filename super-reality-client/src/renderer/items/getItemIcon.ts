import { ReactComponent as IconAddAudio } from "../../assets/svg/add-audio.svg";
import { ReactComponent as IconAddDialog } from "../../assets/svg/add-dialog.svg";
import { ReactComponent as IconAddFocus } from "../../assets/svg/add-focus.svg";
import { ReactComponent as IconAddImage } from "../../assets/svg/add-image.svg";
import { ReactComponent as IconAddVideo } from "../../assets/svg/add-video.svg";
import { ReactComponent as IconAddFX } from "../../assets/svg/new-fx-icon.svg";
import { Item } from "./item";

export default function getItemIcon(
  itemData: Item
): React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
  }
> {
  let Icon = IconAddFocus;
  if (itemData) {
    switch (itemData.type) {
      case "audio":
        Icon = IconAddAudio;
        break;
      case "dialog":
        Icon = IconAddDialog;
        break;
      case "image":
        Icon = IconAddImage;
        break;
      case "video":
        Icon = IconAddVideo;
        break;
      case "youtube":
        Icon = IconAddVideo;
        break;
      case "fx":
        Icon = IconAddFX;
        break;
      default:
        Icon = IconAddFocus;
    }
  }
  return Icon;
}
