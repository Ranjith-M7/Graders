import React from "react";

import Header from "./Header";
import Events from "./Events";
import Footer from "./Footer";
import Loader from "./Loader";

function EventPage() {
  return (
    <>
      <Loader />
      <Header />
      <Events />
      <Footer />
    </>
  );
}

export default EventPage;
