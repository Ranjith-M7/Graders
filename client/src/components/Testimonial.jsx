import React, { useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { database, firestore, storage } from "./firebaseConfig";

function Testimonial() {
  const [testimonialData, setTestimonialData] = useState({
    title: "",
    subtitle: "",
    description: "",
    testimonials: [],
  });
  const [imageUrls, setImageUrls] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch images from storage
  useEffect(() => {
    const fetchImageUrls = async () => {
      try {
        const storageRef = storage.ref("Testimonial Section");

        // Get list of items (images) in the directory
        const listResult = await storageRef.listAll();

        // Fetch download URL for each item (image) in the directory
        const urls = await Promise.all(
          listResult.items.map(async (itemRef) => {
            return await itemRef.getDownloadURL();
          })
        );
        setImageUrls(urls);
      } catch (error) {
        console.error("Error fetching image URLs:", error);
      }
    };

    fetchImageUrls();
  }, []);

  useEffect(() => {
    const fetchTestimonialData = async () => {
      try {
        const snapshot = await database
          .ref("Testimonial Section")
          .once("value");
        if (snapshot.exists()) {
          const data = snapshot.val();
          const { Title, Subtitle, Description, Testimonials } = data;

          setTestimonialData({
            title: Title || "",
            subtitle: Subtitle || "",
            description: Description || "",
            testimonials: Testimonials || [],
          });
          setDataLoaded(true);
        } else {
          console.log("The testimonial data was not found in the database");
        }
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    };

    fetchTestimonialData();
  }, []);

  const options = {
    center: true,
    items: 1,
    autoplay: true,
    loop: true,
    dots: false,
    smartSpeed: 1500,
    nav: true,
    navText: [
      `<i class="fa fa-angle-left" aria-hidden="true"></i>`,
      `<i class="fa fa-angle-right" aria-hidden="true"></i>`,
    ],
    margin: 30,
    responsive: {
      992: {
        items: 1,
      },
      1200: {
        items: 1,
      },
    },
  };

  return (
    <div className="section testimonials">
      <div className="container">
        <div className="row">
          <div className="col-lg-7">
            {dataLoaded && (
              <OwlCarousel className="owl-carousel" {...options}>
                {testimonialData.testimonials.map((item, index) => (
                  <div key={index} className="item">
                    <p>{item.description}</p>
                    <div className="author">
                      {/* <img src={imageUrls[index]} alt={`Image ${index + 1}`} /> */}
                      {/* <span className="category">{item.Category}</span> */}
                      <h4>{item.name}</h4>
                    </div>
                  </div>
                ))}
              </OwlCarousel>
            )}
          </div>
          <div className="col-lg-5 align-self-center">
            <div className="section-heading">
              <h6>{testimonialData.subtitle}</h6>
              <h2>{testimonialData.title}</h2>
              <p>{testimonialData.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonial;
