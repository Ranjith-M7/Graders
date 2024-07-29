import React from "react";
import Loader from "./Loader";
import Header from "./Header";
import MainBanner from "./MainBanner";
import Services from "./Services";
import About from "./About";
import Courses from "./Courses";
import Statistics from "./Statistics";
import Team from "./Team";
import Testimonial from "./Testimonial";
import Events from "./Events";
import Contact from "./Contact";
import Footer from "./Footer";
import ScrollTop from "./ScrollTop";

function HomePage() {
  return (
    <>
      <Loader />
      <Header />
      <MainBanner />
      <Services />
      <About />
      <Courses />
      <Statistics />
      <Team />
      <Testimonial />
      <Events />
      <Contact />
      <Footer />
      <ScrollTop />
    </>
  );
}

export default HomePage;
