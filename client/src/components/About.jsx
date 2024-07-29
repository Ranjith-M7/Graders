import React, { useEffect, useState } from "react";
import { database } from "./firebaseConfig";

function About() {
  const [aboutData, setAboutData] = useState({
    aboutContent: {
      title: "",
      subtitle: "",
      description: "",
      button: {
        text: "",
        link: "",
      },
    },
    faqContent: [],
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const snapshot = await database.ref("About Section").once("value");
        if (snapshot.exists()) {
          const data = snapshot.val();
          const { About_Content, FAQ_Section } = data;

          // Filter out empty FAQ items
          const filteredFaqContent = FAQ_Section
            ? FAQ_Section.filter((item) => item.Question && item.Answers)
            : [];

          const newAboutData = {
            aboutContent: {
              title: About_Content.Title || "",
              subtitle: About_Content.Subtitle || "",
              description: About_Content.Description || "",
              button: {
                text: About_Content.Button.Text || "",
                link: About_Content.Button.Link || "",
              },
            },
            faqContent: filteredFaqContent || [],
          };

          setAboutData(newAboutData);
        } else {
          console.log("The about data was not found in the database");
        }
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    };

    fetchAboutData();
  }, []);

  return (
    <div className="about-us py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 offset-lg-1">
            <div className="accordion" id="accordionExample">
              {aboutData.faqContent.map((item, index) => (
                <div key={index} className="accordion-item">
                  <h2 className="accordion-header" id={`heading${index}`}>
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${index}`}
                      aria-expanded={false}
                      aria-controls={`collapse${index}`}
                    >
                      {item.Question}
                    </button>
                  </h2>
                  <div
                    id={`collapse${index}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`heading${index}`}
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <p className="mb-2">{item.Title}</p>
                      {Object.values(item.Answers).map((answer, ansIndex) => (
                        <p
                          key={ansIndex}
                          dangerouslySetInnerHTML={{ __html: answer }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-5 align-self-center">
            <div className="section-heading">
              <h6>{aboutData.aboutContent.subtitle}</h6>
              <h2>{aboutData.aboutContent.title}</h2>
              <p>{aboutData.aboutContent.description}</p>
              {/* Uncomment this if you want to include the button */}
              {/* <div className="main-button">
                <a href={aboutData.aboutContent.button.link}>
                  {aboutData.aboutContent.button.text}
                </a>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
