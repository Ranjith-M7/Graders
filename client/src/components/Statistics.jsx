import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { database, firestore, storage } from "./firebaseConfig";

function Statistics() {
  const [statisticsData, setStatisticsData] = useState([]);

  useEffect(() => {
    const fetchStatisticsData = async () => {
      try {
        const snapshot = await database.ref("Statistics").once("value");
        if (snapshot.exists()) {
          const data = snapshot.val();
          const statisticsArray = Object.values(data);
          setStatisticsData(statisticsArray);
        } else {
          console.log("The statistics data was not found in the database");
        }
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    };

    fetchStatisticsData();
  }, []);

  return (
    <div className="section fun-facts">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="wrapper">
              <div className="row">
                {statisticsData.map((stat, index) => (
                  <div key={index} className="col-lg-3 col-md-6">
                    <div className="counter">
                      <h2>
                        <CountUp
                          start={0}
                          end={stat.Value}
                          duration={2.5}
                          separator=","
                          decimals={0}
                          decimal=","
                          suffix=""
                          prefix=""
                        />
                      </h2>
                      <p className="count-text">{stat.Description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
