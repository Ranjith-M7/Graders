import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { Link } from "react-router-dom";
import { database, storage } from "./firebaseConfig";
import { ref, listAll, getDownloadURL } from "firebase/storage";

function Courses() {
  const [coursesData, setCoursesData] = useState({
    title: "",
    subtitle: "",
    rupeeSign: "",
    coursesContent: [],
    filtersContent: [],
  });
  const [dataLoaded, setDataLoaded] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [activeFilter, setActiveFilter] = useState("*");

  // Fetch courses data from Firebase
  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        const snapshot = await database.ref("Courses Section").once("value");
        if (snapshot.exists()) {
          const data = snapshot.val();
          const { Title, Subtitle, Rupee_Sign, Courses, Filters } = data;

          const coursesContent = Courses
            ? Object.values(Courses).map((course) => ({
                id: course.Id || "",
                category: course.Category || "",
                price: course.Price || "",
                title: course.Title || "",
                author: course.Author || "",
              }))
            : [];

          const parsedData = {
            title: Title || "",
            subtitle: Subtitle || "",
            rupeeSign: Rupee_Sign || "",
            coursesContent: coursesContent,
            filtersContent: Filters
              ? Object.values(Filters).map((filter) => ({
                  category: filter.Category || "",
                  name: filter.Name || "",
                }))
              : [],
          };

          setCoursesData(parsedData);
          setDataLoaded(true);
          setImageUrls(await fetchImageUrls(coursesContent));
        } else {
          console.log("The courses section data was not found in the database");
        }
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    };

    fetchCoursesData();
  }, []);

  const fetchImageUrls = async (coursesContent) => {
    try {
      const urls = await Promise.all(
        coursesContent.map(async (course) => {
          const imageRef = ref(storage, `Course Images/${course.id}`);
          const listResult = await listAll(imageRef);

          if (listResult.items.length > 0) {
            const firstImageRef = listResult.items[0];
            const url = await getDownloadURL(firstImageRef);
            return url;
          } else {
            return "";
          }
        })
      );
      return urls;
    } catch (error) {
      console.error("Error fetching image URLs:", error);
      return [];
    }
  };

  const handleFilterClick = (filterValue) => {
    setActiveFilter(filterValue);
  };

  const filteredCourses =
    activeFilter === "*"
      ? coursesData.coursesContent
      : coursesData.coursesContent.filter(
          (course) => course.category.toLowerCase() === activeFilter
        );

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <section className="section" id="courses">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="section-heading">
              <h6>{coursesData.subtitle}</h6>
              <h2>{coursesData.title}</h2>
            </div>
          </div>
        </div>
        <ul className="event_filter">
          {coursesData.filtersContent.length > 0 &&
            coursesData.filtersContent.map((filter, index) => (
              <li key={index}>
                <a
                  className={
                    activeFilter === filter.category.toLowerCase()
                      ? "is_active"
                      : ""
                  }
                  href="#!"
                  data-filter={
                    index === 0 ? "*" : filter.category.toLowerCase()
                  }
                  onClick={() =>
                    handleFilterClick(
                      index === 0 ? "*" : filter.category.toLowerCase()
                    )
                  }
                >
                  {filter.name}
                </a>
              </li>
            ))}
        </ul>
        {dataLoaded && (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {filteredCourses.map((course, index) => (
              <div
                key={index}
                className={`align-self-center mb-30 event_outer ${course.category.toLowerCase()}`}
                style={{
                  backgroundColor: "rgb(215, 255, 253)",
                  borderRadius: "25px",
                }}
              >
                <Link
                  className="events_item"
                  to={`/course-details/${course.id}`}
                >
                  <div className="thumb">
                    <a href="#">
                      <img src={imageUrls[index]} alt="" />
                    </a>
                    <span className="category">{course.category}</span>
                    <span className="price">
                      <h6>
                        <em>{coursesData.rupeeSign}</em>
                        {course.price}
                      </h6>
                    </span>
                  </div>
                  <div className="down-content">
                    <span className="author">{course.author}</span>
                    <h4>{course.title}</h4>
                  </div>
                </Link>
              </div>
            ))}
          </Masonry>
        )}
      </div>
    </section>
  );
}

export default Courses;
