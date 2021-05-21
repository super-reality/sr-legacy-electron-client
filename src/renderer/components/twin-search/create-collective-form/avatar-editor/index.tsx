import { useState } from "react";
import Avatar from "react-avatar-editor";
import ButtonSimple from "../../../button-simple";

interface PreviewProps {
  filePath: string;
  setImage: (image: string) => void;
  openEditor: (open: boolean) => void;
  width?: number;
  height?: number;
}

export default function AvatarEditor(props: PreviewProps) {
  const { filePath, width, height, setImage, openEditor } = props;
  const [scale, setScale] = useState<number>(1);
  const [rotate, setRotate] = useState<number>(0);
  const [editor, setEditor] = useState<Avatar>();
  const editorRef = (reference: any) => {
    setEditor(reference);
    console.log("reference", reference);
  };
  //   const onCrop = (preview: any) => {
  //     setAvatarState(Object.assign(avatarState, { preview }));
  //   };
  //   const onClose = () => {
  //     setAvatarState({ preview: null, src: "" });
  //   };

  const saveImage = () => {
    if (editor) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      //   const canvas = editor?.getImage();

      // If you want the image resized to the canvas size (also a HTMLCanvasElement)
      const canvasScaled = editor.getImageScaledToCanvas().toDataURL();
      setImage(canvasScaled);
      openEditor(false);
      console.log("editor", canvasScaled);
    }
    console.log("editor", editor);
  };
  const handleScale = (e: any) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
  };
  const rotateLeft = (e: React.MouseEvent) => {
    e.preventDefault();
    setRotate(rotate - 90);
  };
  const rotateRight = (e: React.MouseEvent) => {
    e.preventDefault();
    setRotate(rotate + 90);
  };
  return (
    <div className="avatar-editor">
      <Avatar
        ref={editorRef}
        // style={{ width: "100%" }}
        image={filePath}
        width={width}
        height={height}
        borderRadius={500}
        scale={scale}
        rotate={rotate}
        disableBoundaryChecks
      />
      <br />
      Zoom:
      <input
        name="scale"
        type="range"
        onChange={handleScale}
        min="0.1"
        max="2"
        step="0.01"
        defaultValue="1"
      />
      <br />
      <br />
      Rotate:
      <ButtonSimple onClick={rotateLeft}>Left</ButtonSimple>
      <ButtonSimple onClick={rotateRight}>Right</ButtonSimple>
      <br />
      <ButtonSimple onClick={saveImage}>Ok</ButtonSimple>
    </div>
  );
}
