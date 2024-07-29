import React from "react";

import Header from "./Header";
import Courses from "./Courses";
import Footer from "./Footer";
import Loader from "./Loader";

function CoursePage() {
  return (
    <>
      <Loader /> 
      <Header />
      <Courses />
      <Footer />
    </>
  );
}

export default CoursePage;
