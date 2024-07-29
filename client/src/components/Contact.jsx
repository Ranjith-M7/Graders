import React, { useEffect, useState } from "react";

import { database } from "./firebaseConfig";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [latestId, setLatestId] = useState(0);

  useEffect(() => {
    const fetchLatestId = async () => {
      try {
        const snapshot = await database
          .ref("Contact Form")
          .orderByChild("Contact_id")
          .limitToLast(1)
          .once("value");
        if (snapshot.exists()) {
          const latestEntry = snapshot.val();
          const latestIdValue = Object.values(latestEntry)[0].Contact_id;
          setLatestId(latestIdValue);
        } else {
          setLatestId(0);
        }
      } catch (error) {
        console.error("Error fetching latest ID:", error);
      }
    };

    fetchLatestId();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const db = database;

    try {
      console.log("Latest ID:", latestId);
      const newId = latestId + 1;
      console.log("New ID:", newId);
      // Push form data to the database
      await db.ref("Contact Form").push({
        Contact_id: newId,
        Contact_name: name,
        Contact_email: email,
        Contact_subject: subject,
        Contact_message: message,
      });

      // Clear form fields and set success message
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      toast.success(`Message sent successfully`);
    } catch (error) {
      console.error("Error storing form data:", error);
      toast.error(`Failed to send message. Please try again.`);
    }
  };
  const [contactData, setContactData] = useState({
    sectionHeading: {
      title: "",
      subTitle: "",
      description: "",
    },
    specialOffer: {
      date: "",
      label: "",
      description: "",
      offerDiscount: "",
      offerText: "",
    },
  });

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const snapshot = await database.ref("Contact Section").once("value");
        if (snapshot.exists()) {
          const data = snapshot.val();
          const { Section_Heading, Special_Offer } = data;
          setContactData({
            sectionHeading: {
              title: Section_Heading.Title || "",
              subTitle: Section_Heading.Subtitle || "",
              description: Section_Heading.Description || "",
            },
            specialOffer: {
              description: Special_Offer.Description || "",
              date: Special_Offer.Date || "",
              label: Special_Offer.Label || "",
              offerDiscount: Special_Offer.Offer_Discount || "",
              offerText: Special_Offer.Offer_Text || "",
            },
          });
        } else {
          console.log("The contact data was not found in the database");
        }
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    };

    fetchContactData();
  }, []);
  return (
    <div className="contact-us section" id="contact">
      <div className="container">
        <div className="row pt-5">
          <div className="col-lg-6  align-self-center">
            <div className="section-heading">
              <h6>{contactData.sectionHeading.subTitle}</h6>
              <h2>{contactData.sectionHeading.title}</h2>
              <p>{contactData.sectionHeading.description}</p>
              <div className="special-offer">
                <span className="offer">
                  {contactData.specialOffer.offerText}
                  <br />
                  <em>{contactData.specialOffer.offerDiscount}</em>
                </span>
                <h6>
                  {contactData.specialOffer.label}{" "}
                  <em>{contactData.specialOffer.date}</em>
                </h6>
                <h4>
                  {contactData.specialOffer.description}{" "}
                  <em>{contactData.specialOffer.offerDiscount}</em>{" "}
                  {contactData.specialOffer.offerText}
                </h4>
                <a href="#">
                  <i className="fa fa-angle-right" />
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="contact-us-content">
              <form id="contact-form" onSubmit={handleSubmit} method="post">
                <div className="row">
                  <div className="col-lg-12">
                    <fieldset>
                      <input
                        type="name"
                        name="name"
                        id="name"
                        placeholder="Your Name..."
                        autoComplete="on"
                        required
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        pattern="[^ @]*@[^ @]*"
                        placeholder="Your E-mail..."
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <input
                        type="text"
                        name="subject"
                        id="subject"
                        placeholder="Subject..."
                        required
                        value={subject}
                        onChange={(event) => setSubject(event.target.value)}
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <textarea
                        name="message"
                        id="message"
                        placeholder="Your Message"
                        defaultValue={""}
                        required
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <button
                        type="submit"
                        id="form-submit"
                        className="orange-button"
                      >
                        Send Message Now
                      </button>
                    </fieldset>
                  </div>
                </div>
              </form>
            </div>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
