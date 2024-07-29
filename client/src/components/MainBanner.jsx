import React, { useEffect, useState } from "react";
import { database } from "./firebaseConfig";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.min.css";
import "owl.carousel/dist/assets/owl.theme.default.min.css";

import tempImg1 from "../assets/images/banner-01.jpg";
import tempImg2 from "../assets/images/banner-02.jpg";
import tempImg3 from "../assets/images/banner-03.jpg";

function MainBanner() {
  const [slides, setSlides] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchMainBannerData = async () => {
      try {

          const snapshot = await database.ref("Main Banner/Slides").once("value");
          if (snapshot.exists()) {
            const data = snapshot.val();
            setSlides(Object.values(data));

            setDataLoaded(true);
          } else {
            console.log("The banner data was not found in the database");
          }
      
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    };

    fetchMainBannerData();
  }, []);

  return (
    <div className="main-banner" id="top">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {dataLoaded ? (
              <OwlCarousel
                className="owl-carousel owl-theme"
                center={true}
                items="1"
                autoplay={true}
                loop
                dots={true}
                nav={false}
                smartSpeed="1500"
                responsive={{
                  992: {
                    items: 1,
                  },
                  1200: {
                    items: 1,
                  },
                }}
              >
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className="item d-flex flex-column flex-md-row justify-content-around  align-items-center align-items-md-stretch flex-wrap gap-5 mt-md-4 mt-lg-0"
                    style={{ backgroundImage: "white" }}
                  >
                    {Object.values(slide).map((card, cardIndex) => (
                      <div
                        key={cardIndex}
                        className="card  mx-2 p-1 shadow"
                        style={{
                          width: "18rem",
                          backgroundColor: "rgb(215, 255, 253)",
                          color: "black",
                          border: "3px solid rgb(23, 133, 130)"
                        }}
                      >
                        <img
                          className="card-img-top"
                          src={
                            cardIndex === 0
                              ? tempImg1
                              : cardIndex === 1
                              ? tempImg2
                              : tempImg3
                          }
                          alt="Card image"
                          style={{
                            height: "150px",
                            width: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                        <div className="card-body text-center">
                          <h5 className="card-title">{card.title}</h5>
                          <p className="card-text text-black w-100">
                            {card.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </OwlCarousel>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainBanner;
