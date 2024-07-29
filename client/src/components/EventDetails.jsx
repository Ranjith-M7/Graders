import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { database, storage } from "./firebaseConfig";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";

import Header from "./Header";
import Footer from "./Footer";
import Loader from "./Loader";

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState({
    eventType: "",
    title: "",
    description: "",
    eventDate: "",
    eventCity: "",
    price: "",
    rupeeSign: "",
    subtitles: [],
    duration: "",
    level: "",
    language: "",
    imageUrl: "",
    agendaList: [],
    keyTakeaways: [],
    contactInformation: "",
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Fetch selected event from firebase realtime database
    const fetchEvent = async () => {
      try {
        const snapshot = await database.ref("Events").once("value");

        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data) {
            // Find the event with the matching ID
            const eventData = Object.values(data);
            const selectedEvent = eventData.find(
              (event) => event.id === parseInt(id)
            );

            if (selectedEvent) {
              setEvent({
                eventType: selectedEvent.eventType || "",
                title: selectedEvent.title || "",
                description: selectedEvent.description || "",
                eventDate: selectedEvent.eventDate || "",
                eventCity: selectedEvent.eventCity || "",
                price: selectedEvent.price || "",
                duration: selectedEvent.duration || "",
                level: selectedEvent.level || "",
                language: selectedEvent.language || "",
                imageUrl: selectedEvent.imageUrl || "",
                rupeeSign: "₹",
                subtitles: ["Agenda", "Key Takeaways", "Contact Information"],

                agendaList: selectedEvent.agendaList
                  ? selectedEvent.agendaList
                      .split(".")
                      .map((item) => item.trim())
                      .filter((item) => item)
                  : [],

                keyTakeaways: selectedEvent.keyTakeaways
                  ? selectedEvent.keyTakeaways
                      .split(".")
                      .map((item) => item.trim())
                      .filter((item) => item)
                  : [],

                contactInformation: selectedEvent.contactInformation || "",
              });
              setLoaded(true);
            } else {
              console.log(`Event with ID ${id} not found`);
            }
          }
        } else {
          console.log("No event found in the database");
        }
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };
    fetchEvent();
  }, []);

  return (
    <>
      <Loader />
      <Header />
      <div className="event-details-section pt-3 pt-md-5" id="event-details">
        <div className="container">
          {/* Row 1 */}
          <div className="row pb-5">
            <div className="col-lg-4 d-flex align-items-center justify-content-center">
              <div
                className="image mb-4 my-lg-0"
                style={{
                  padding: "8px",
                  backgroundColor: "rgb(215, 255, 253)",
                  borderRadius: "10px",
                }}
              >
                <img
                  src={event.imageUrl}
                  className="img-fluid"
                  alt=""
                  style={{ borderRadius: "10px" }}
                />
              </div>
            </div>

            <div className="col-lg-8">
              <div className="d-lg-flex justify-content-between align-items-center p-lg-5 p-3 background-secondary">
                <div className="content py-2">
                  <span className="category d-inline-block mb-3">
                    {event.eventType}
                  </span>
                  <h2 className="mb-3 title">{event.title}</h2>

                  <p>{event.description}</p>
                  {/* you can add star rating and reviews if needs */}
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="row pb-5">
            {/* Left side */}

            <div className="col-lg-9">
              <div className="agenda mb-5 background-secondary p-5">
                <h2 className="title mb-3">{event.subtitles[0]}</h2>
                <ul className="agenda-list">
                  {event.agendaList.map((list, index) => (
                    <li key={index}>{list}</li>
                  ))}
                </ul>
              </div>

              <div className="key-takeaways mb-5 background-secondary p-5">
                <h2 className="title mb-3">{event.subtitles[1]}</h2>
                <ul className="key-takeaways-list">
                  {event.keyTakeaways.map((list, index) => (
                    <li key={index}>{list}</li>
                  ))}
                </ul>
              </div>

              <div className="about-event background-secondary p-5">
                <h2 className="title mb-3">{event.subtitles[2]}</h2>
                <p>{event.contactInformation}</p>
              </div>
            </div>

            {/* Right side */}
            <div className="col-lg-3 mt-5 mt-lg-0">
              {loaded && (
                <div
                  className="event-info p-5 background-secondary d-flex flex-column"
                  style={{ color: "#777" }}
                >
                  <div className="info-item">
                    <i class="fa-regular fa-calendar"></i>
                    <span>{event.eventDate}</span>
                  </div>
                  <div className="info-item">
                    <i className="fa-solid fa-tag"></i>
                    <span>
                      {event.rupeeSign}
                      {event.price}
                    </span>
                  </div>
                  <div className="info-item">
                    <i className="fa-solid fa-stopwatch"></i>
                    <span>{event.duration}</span>
                  </div>

                  <div className="info-item">
                    <i className="fa-solid fa-signal"></i>
                    <span>{event.level}</span>
                  </div>

                  <div className="info-item">
                    <i className="fa-solid fa-language"></i>
                    <span>{event.language}</span>
                  </div>

                  <div className="info-item">
                    <i className="fa-solid fa-location"></i>
                    <span>{event.eventCity}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default EventDetails;
