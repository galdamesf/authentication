import PropTypes from "prop-types";
import "../BurguerButton.css";

function BurguerButton(props) {
  return (
    <div
      onClick={props.handleClick}
      className={`icon nav-icon-5 ${props.clicked ? "open" : ""}`}
    >
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}

BurguerButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  clicked: PropTypes.bool.isRequired,
};

export default BurguerButton;
