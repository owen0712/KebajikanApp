import React, { useState } from "react";
import "./tnc.css";
import tnc from "../../assets/doc/terms_and_condition.pdf";
import CloseIcon from '@mui/icons-material/Close';

const TNC = (props) => {
  const [isView, setIsView] = useState(false);
  const height = props.height;

  const handleTNCOnClick = () => {
    setIsView(true);
  };

  const handleCloseButtonOnClick = () => {
    setIsView(false);
  }

  return (
    <React.Fragment>
      <a className="tnc" onClick={handleTNCOnClick}>Term and Condition</a>
      {isView&&<>
      <div style={{height:height}} className="cover"></div>
      <button onClick={handleCloseButtonOnClick} className="close-button"><CloseIcon/></button>
      <iframe className="tnc-content" src={tnc}/>
      </>}
      
    </React.Fragment>
  );
};

export default TNC;
