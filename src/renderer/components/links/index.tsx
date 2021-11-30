import { Parents } from "../../api/types/lesson/search-parent";

const getParentVal = (p: Parents) => {
  return p.type == "lesson"
    ? `${p.subjectName}/${p.lessonName}`
    : `${p.collectionName}${p.subjectName ? `/${p.subjectName}` : ""}`;
};

const getParentId = (p: Parents) => {
  if (p.type == "lesson") return p.lessonId;
  if (p.type == "subject") return p.subjectId;
  return p.collectionId;
};

const renderParent = (p: Parents) => <div>{getParentVal(p)}</div>;

export { getParentVal, getParentId, renderParent };
