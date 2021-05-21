import ButtonSimple from "../button-simple";
import "./search-categories.scss";

const categories = [
  "Web",
  "People",
  "Institutions",
  "Animals",
  "Plants",
  "Objects",
];
interface CategoriesProps {
  onClick: (id: string) => void;
  activeId?: string;
}
export default function SearchCategories(props: CategoriesProps) {
  const { onClick, activeId } = props;
  return (
    <div className="categories-container">
      <div className="categories-buttons">
        {categories.map((category) => {
          return (
            <ButtonSimple
              key={category}
              className={`category-button-wraper ${
                activeId === category ? "active" : ""
              }`}
              id={category}
              onClick={() => {
                onClick(category);
              }}
            >
              <div className="categories-btn">{category}</div>
            </ButtonSimple>
          );
        })}
      </div>
    </div>
  );
}
/** 
  <ButtonSimple
        className="category-button-wraper active"
        id="Web"
        onClick={onClick}
      >
        <div className="categories-btn">Web</div>
      </ButtonSimple>
      <ButtonSimple
        className={`category-button ${activeId}`}
        id="People"
        onClick={onClick}
      >
        People
      </ButtonSimple>
      <ButtonSimple
        className="category-button"
        id="Institutions"
        onClick={onClick}
      >
        Institutions
      </ButtonSimple>
      <ButtonSimple className="category-button" id="Animals" onClick={onClick}>
        Animals
      </ButtonSimple>
      <ButtonSimple className="category-button" id="Plants" onClick={onClick}>
        Plants
      </ButtonSimple>
      <ButtonSimple className="category-button" id="Objects" onClick={onClick}>
        Objects
      </ButtonSimple>
 */
