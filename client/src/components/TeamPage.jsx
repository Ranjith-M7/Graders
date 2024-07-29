import React from "react";

import Header from "./Header";
import Team from "./Team";
import Footer from "./Footer";
import Loader from "./Loader";

function TeamPage() {
  return (
    <>
      <Loader />
      <Header />
      <Team />
      <Footer />
    </>
  );
}

export default TeamPage;
