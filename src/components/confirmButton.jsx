import React from "react";
import { withRouter } from "react-router-dom";

const ConfirmButton = ({ history }) => (
  <div className="confirm-btn" onClick={history.goBack}></div>
);

export default withRouter(ConfirmButton);