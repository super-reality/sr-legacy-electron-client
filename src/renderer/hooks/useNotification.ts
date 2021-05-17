import { useState, useCallback, useEffect } from "react";
import os from "os";
import path from "path";
import getPublicPath from "../../utils/electron/getPublicPath";
import isElectron from "../../utils/electron/isElectron";

type Turgency = "normal" | "critical";

type TtimeoutType = "default" | "never";

interface INotification {
  title: string;
  body: string;
  subtitle?: string;
  icon?: string;
  silent?: boolean;
  hasReply?: boolean;
  timeoutType?: TtimeoutType;
  replyPlaceholder?: string;
  sound?: string;
  urgency?: Turgency;
  closeButtonText?: string;
}

export default function useNotification(notificationProps: INotification) {
  const {
    title,
    body,
    subtitle,
    icon,
    silent,
    hasReply,
    timeoutType,
    replyPlaceholder,
    sound,
    urgency,
    closeButtonText,
  } = notificationProps;

  const [open, setOpen] = useState(false);

  const showNotification = useCallback(() => {
    setOpen(true);
  }, [open]);

  const setNotification = () => {
    if (os.platform() === "win32" && isElectron()) {
      // eslint-disable-next-line global-require
      const { Notification, app } = require("electron").remote;
      app.setAppUserModelId("Super Reality");

      const notify = {
        title,
        body,
        subtitle,
        icon: icon && path.join(getPublicPath(), icon),
        silent,
        hasReply,
        timeoutType,
        replyPlaceholder,
        sound,
        urgency,
        closeButtonText,
      };
      new Notification(notify).show();
    }
  };

  useEffect(() => {
    if (open === true) {
      setNotification();
      setOpen(!open);
    }
  }, [open]);

  return [showNotification];
}
