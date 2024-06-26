import React from "react";
export default function Header({ title, description, imgUrl }) {
  return (
    <div className="container-fluid header-bg py-3">
      <div className="row align-items-center">
        <div className="col-md-8 p-5">
          <div className="content">
            <h2 className="mx-4">{title}</h2>
            <p className="mx-4">{description}</p>
          </div>
        </div>
        <div className="col-md-3 d-flex justify-content-end">
          <img src={imgUrl} alt="header img" className="img-fluid" />
        </div>
      </div>
    </div>
  );
}
