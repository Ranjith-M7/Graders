import React, { useEffect, useState } from "react";
import { database, firestore, storage } from "./firebaseConfig";

function Team() {
  const [teamData, setTeamData] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  // Fetch images from storage
  useEffect(() => {
    const fetchImageUrls = async () => {
      try {
        const storageRef = storage.ref("Team Section");

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
    const fetchTeamData = async () => {
      try {
        const snapshot = await database.ref("Team Section").once("value");
        if (snapshot.exists()) {
          const data = snapshot.val();

          // Convert the object data into an array
          const teamArray = Object.values(data);

          setTeamData(teamArray);
        } else {
          console.log("The team data was not found in the database");
        }
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    };

    fetchTeamData();
  }, []);
  return (
    <div className="team section" id="team">
      <div className="container">
        <div className="row">
          {teamData.map((member, index) => (
            <div key={index} className="col-lg-6 col-md-6">
              <div className="team-member">
                <div className="main-content">
                  <img src={imageUrls[index]} alt="" />
                  <span className="category">{member.Category}</span>
                  <h4>{member.Name}</h4>
                  <ul className="social-icons">
                    <li>
                      <a href="#">
                        <i className="fab fa-facebook" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-twitter" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-linkedin" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Team;
