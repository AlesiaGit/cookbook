import React from "react";
import { withRouter } from "react-router-dom";

const BackButton = ({ history }) => (
	<div className="back-btn" onClick={history.goBack} />
);

export default withRouter(BackButton);
