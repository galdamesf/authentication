import { useState } from "react";
import BurguerButton from "./BurguerButton";
import "../MyNavbar.css";

function MyNavbar() {
  const [clicked, setClicked] = useState(false);
  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <nav className="nav-container">
      <h2>
        Navbar <span>Responsive</span>
      </h2>
      <div className={`links ${clicked ? "active" : ""}`}>
        <a href="/">Home</a>
        <a href="/">Shop</a>
        <a href="/">About</a>
        <a href="/">Contact</a>
        <a href="/">Blog</a>
      </div>
      <div className="burguer">
        <BurguerButton clicked={clicked} handleClick={handleClick} />
      </div>
      <div className={`bg-div initial ${clicked ? "active" : ""}`}></div>
    </nav>
  );
}

export default MyNavbar;
