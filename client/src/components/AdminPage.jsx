import React, { useRef, useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/database";
import { database, firestore, storage } from "./firebaseConfig";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import Loader from "./Loader";
import Header from "./Header";
import Footer from "./Footer";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminPage = () => {
  const calendarRef = useRef(null);
  const fileInputRef = useRef(null);
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [duration, setDuration] = useState("");
  const [eventCity, setEventCity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [agendaList, setAgendaList] = useState("");
  const [contactInformation, setContactInformation] = useState("");

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);

  const [eventData, setEventData] = useState({
    events: {
      imageUrl: "",
      title: "",
      eventType: "",
      eventDate: "",
      eventCity: "",
      duration: "",
      price: "",
      description: "",
      agendaList: "",
      contactInformation: "",
    },
  });

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const snapshot = await database.ref("Events").once("value");
        if (snapshot.exists()) {
          const data = snapshot.val();
          const events = Object.values(data); // convert object to array
          setEventData({ events });
        } else {
          console.log(
            "The events data for events was not found in the database"
          );
        }
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    };

    fetchEventData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const database = firebase.database();
        const snapshot = await database.ref("Events").once("value");
        const eventData = snapshot.val() || {};
        const events = Object.keys(eventData).map((eventId) => {
          const event = eventData[eventId];
          return {
            title: event.eventType,
            start: new Date(event.eventDate),
            allDay: true,
            backgroundColor: "#6fa8dc", // default blue color
          };
        });
        setCalendarEvents(events);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  //handle image upload
  const handleImageUpload = async (file, eventId) => {
    const fileExtension = file.name.split(".").pop();
    const imageName = `image_${Date.now()}.${fileExtension}`;
    const fileRef = storage.ref().child(`Event Images/${eventId}/${imageName}`);
    await fileRef.put(file);
    return await fileRef.getDownloadURL();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Fetch the latest ID from the database
      const snapshot = await database.ref("Events").once("value");
      let latestId = 0;

      if (snapshot.exists()) {
        const eventsData = snapshot.val();
        if (eventsData) {
          // Find the latest ID
          Object.values(eventsData).forEach((event) => {
            if (event.id > latestId) {
              latestId = event.id;
            }
          });
        }
      }

      const newEventId = latestId + 1;

      let imageUrl = "";
      if (image) {
        imageUrl = await handleImageUpload(image, newEventId);
      }

      const newEventRef = database.ref(`Events/${newEventId}`);

      await newEventRef.set({
        id: newEventId,
        eventType,
        eventDate,
        duration,
        title,
        price,
        eventCity,
        imageUrl,
        description,
        agendaList,
        contactInformation,
      });

      // Reset form fields
      setEventType("");
      setEventDate("");
      setDuration("");
      setTitle("");
      setPrice("");
      setEventCity("");
      setDescription("");
      setAgendaList("");
      setContactInformation("");
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success(`Event booked successfully.`);
    } catch (error) {
      toast.error(`Error booking event. Please try again.`);
      console.error("Error booking event:", error);
    }
  };

  const handleDeleteEvent = (date, title) => {
    // Reference to the event node
    const eventsRef = firebase.database().ref("Events");

    // Query events with the specified date
    eventsRef
      .orderByChild("eventDate")
      .equalTo(date)
      .once("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const event = childSnapshot.val();
          // Check if the event matches both the specified date and title
          if (event.eventDate === date && event.title === title) {
            // Remove the event entry
            childSnapshot.ref
              .remove()
              .then(() => {
                console.log("Event data deleted from Firebase");
                toast.success(`Event data deleted from Firebase`);
                setTimeout(() => {
                  window.location.reload();
                }, 400); // Adjust the delay time as needed
              })
              .catch((error) => {
                console.error(
                  "Error deleting event data from Firebase: ",
                  error
                );
                toast.error(`Error deleting event data from Firebase: ${error}
                  `);
              });
          }
        });
      });
  };
  return (
    <>
      <Loader />
      <Header />
      <section className="admin-section pt-5" id="admin-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="section-heading">
                <h2 className="heading">Admin Page</h2>
              </div>
            </div>
          </div>
          <div className="row mb-5">
            <div className="section-title">
              <h2>Event Calendar</h2>
            </div>
            <div className="col-12">
              <div className="full-calender ">
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView={"dayGridMonth"}
                  headerToolbar={{
                    start: "today prev,next",
                    center: "title",
                    end: "dayGridMonth,timeGridWeek,timeGridDay",
                  }}
                  height={"60vh"}
                  events={calendarEvents}
                />
              </div>
            </div>
          </div>

          <div className="row mb-5">
            <div className="section-title">
              <h2>Event Booking Form</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="eventType" className="form-label">
                      Event Type
                    </label>
                    <select
                      className="form-select"
                      id="eventType"
                      required
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                    >
                      <option value="">Select event type</option>
                      <option value="ui/ux">UI/UX</option>
                      <option value="front end">Front end</option>
                      <option value="backend">Backend</option>
                      <option value="database">Database</option>
                      <option value="data science">Data science</option>
                      <option value="data analyst">Data Analyst</option>
                      <option value="excel">Excel</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="eventTitle" className="form-label">
                      Event Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="eventTitle"
                      required
                      placeholder="Enter the event title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="eventDate" className="form-label">
                      Event Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="eventDate"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <textarea
                      id="description"
                      className="form-control"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="agendaList" className="form-label">
                      Agenda
                    </label>
                    <textarea
                      id="agendaList"
                      className="form-control"
                      rows={4}
                      value={agendaList}
                      onChange={(e) => setAgendaList(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="eventCity" className="form-label">
                      Event City
                    </label>
                    <select
                      className="form-select"
                      id="eventCity"
                      required
                      value={eventCity}
                      onChange={(e) => setEventCity(e.target.value)}
                    >
                      <option value="">Select event city</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Bangalore">Bangalore</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="duration" className="form-label">
                      Duration
                    </label>
                    <select
                      className="form-select"
                      id="duration"
                      required
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    >
                      <option value="">Select Duration</option>
                      {/* {Array.from({ length: 10 }, (_, i) => (
                        <option key={i} value={`${i * 100} - ${(i + 1) * 100}`}>
                          {`${i * 100} - ${(i + 1) * 100}`}
                        </option>
                      ))} */}
                      <option value="0 - 1 hour">{`0 - 1 hour`}</option>
                      <option value="2 hours">{`2 hours`}</option>
                      <option value="3 hours">{`3 hours`}</option>
                      <option value="4 hours">{`4 hours`}</option>
                      <option value="5 hours">{`5 hours`}</option>
                      <option value="6 hours">{`6 hours`}</option>
                      <option value="7 hours">{`7 hours`}</option>
                      <option value="8 hours">{`8 hours`}</option>
                      <option value="9 hours">{`9 hours`}</option>
                      <option value="10+ hours">{`10+ hours`}</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">
                      Price
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      id="price"
                      placeholder="Enter the price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="contactInformation" className="form-label">
                      Contact Information
                    </label>
                    <textarea
                      id="contactInformation"
                      className="form-control"
                      rows={4}
                      value={contactInformation}
                      onChange={(e) => setContactInformation(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="imageUpload" className="mb-1">
                      Select image to upload
                    </label>
                    <input
                      type="file"
                      required
                      className="form-control form-control-file"
                      id="imageUpload"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </div>

                  <button
                    type="submit"
                    className="secondary-button"
                    style={{ width: "max-content" }}
                  >
                    Book Event
                  </button>
                </div>
              </div>
            </form>
            <ToastContainer />
          </div>

          {/* Admin Event Booking Details's Table */}

          <section className="event-booking-table">
            <div className="section-title">
              <h2>Admin Event Bookings</h2>
            </div>
            <div className="" style={{ overflowX: "auto" }}>
              <table class="table table-striped table-hover table-bordered ">
                <thead
                  style={{
                    backgroundColor: "rgb(23, 133, 130)",
                    color: "white",
                  }}
                >
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Date</th>
                    <th scope="col">Title</th>
                    <th scope="col">Event Type</th>
                    <th scope="col">Event City</th>
                    <th scope="col">Duration</th>
                    <th scope="col">Price</th>
                    <th scope="col">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(eventData.events) &&
                    eventData.events.map((event, index) => (
                      <tr key={index}>
                        <th scope="row">{`${index + 1}`}</th>
                        <td>{event.eventDate}</td>
                        <td>{event.title}</td>
                        <td>{event.eventType}</td>
                        <td>{event.eventCity}</td>
                        <td>{event.duration}</td>
                        <td>₹{event.price}</td>
                        <td>
                          <FontAwesomeIcon
                            icon={faTrash}
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteEvent(event.eventDate, event.title);
                            }}
                            style={{ cursor: "pointer", color: "gray" }}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AdminPage;
