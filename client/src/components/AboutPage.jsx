import React from "react";

import Loader from "./Loader";
import Header from "./Header";
import About from "./About";
import Footer from "./Footer";
import ScrollTop from "./ScrollTop";

function AboutPage() {
  return (
    <>
      <Loader />
      <Header />
      <About />
      <Footer />
      <ScrollTop />
    </>
  );
}

export default AboutPage;
