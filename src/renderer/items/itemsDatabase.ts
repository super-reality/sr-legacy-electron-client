import {
  ForwardRefExoticComponent,
  FunctionComponent,
  RefAttributes,
  SVGProps,
} from "react";
import { Item } from "./item";

import SettingsDialog from "./settings/settings-dialog";
import SettingsFocusHighlight from "./settings/settings-focus-highlight";
import SettingsFX from "./settings/settings-fx";
import SettingsImage from "./settings/settings-image";
import SettingsVideo from "./settings/settings-video";

import { ReactComponent as IconAddAudio } from "../../assets/svg/add-audio.svg";
import { ReactComponent as IconAddDialog } from "../../assets/svg/add-tts.svg";
import { ReactComponent as IconAddFocus } from "../../assets/svg/add-focus.svg";
import { ReactComponent as IconAddImage } from "../../assets/svg/add-image.svg";
import { ReactComponent as IconAddVideo } from "../../assets/svg/add-video.svg";
import { ReactComponent as IconAddFX } from "../../assets/svg/new-fx-icon.svg";
import FindBox from "./boxes/find-box";
import FXBox from "./boxes/fx-box";
import ImageBox from "./boxes/image-box";
import VideoBox from "./boxes/video-box";
import DialogBox from "./boxes/dialog-box";

type ItemIcon = FunctionComponent<
  SVGProps<SVGSVGElement> & {
    title?: string | undefined;
  }
>;

interface ItemDatabaseEntry {
  name: string;
  component: ForwardRefExoticComponent<any & RefAttributes<HTMLDivElement>>;
  settings: (props: any) => JSX.Element;
  icon: ItemIcon;
}

const itemsDatabase: Record<Item["type"], ItemDatabaseEntry> = {
  focus_highlight: {
    name: "Focus Highlight",
    settings: SettingsFocusHighlight,
    component: FindBox,
    icon: IconAddFocus,
  },
  fx: {
    name: "Effect",
    settings: SettingsFX,
    component: FXBox,
    icon: IconAddFX,
  },
  audio: {
    name: "Audio",
    settings: SettingsImage,
    component: ImageBox,
    icon: IconAddAudio,
  },
  image: {
    name: "Image",
    settings: SettingsImage,
    component: ImageBox,
    icon: IconAddImage,
  },
  video: {
    name: "Video",
    settings: SettingsVideo,
    component: VideoBox,
    icon: IconAddVideo,
  },
  dialog: {
    name: "Dialog",
    settings: SettingsDialog,
    component: DialogBox,
    icon: IconAddDialog,
  },
};

export default itemsDatabase;
