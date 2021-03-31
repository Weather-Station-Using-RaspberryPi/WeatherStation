import React from "react";
import LJU from "../Assets/LOGO/LJKU_logo_Full.png";
import LJE from "../Assets/LOGO/LJIET_LOGO.png";
import LJS from "../Assets/LOGO/LJ Smart LabZ Logo.png";

import "../App/App.css";

function Header() {
  return (
    <section className="Header">
      <div className="header-logo">
        <img className="ljs" src={LJS} className="headerImg1"></img>
        <img className="lju" src={LJU} className="headerImg2"></img>
        <img className="lje" src={LJE} className="headerImg3"></img>
      </div>
    </section>
  );
}

export default Header;
