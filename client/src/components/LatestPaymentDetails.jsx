import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Loader from "./Loader";

function LatestPaymentDetails() {
  return (
    <>
      <Loader />
      <Header />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "500px" }}
      >
        <h3>LOADING PAYMENT DETAILS</h3>
      </div>
      <div className="text-center">
        <button className="btn btn-success">View All Payments</button>
      </div>

      <Footer />
    </>
  );
}

export default LatestPaymentDetails;
