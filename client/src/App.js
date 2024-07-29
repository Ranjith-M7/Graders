import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import AboutPage from "./components/AboutPage";
import CoursePage from "./components/CoursePage";
import CourseDetails from "./components/CourseDetails";

import Blog from "./components/Blog";
import BlogDetails from "./components/BlogDetails";
import TeamPage from "./components/TeamPage";
import EventPage from "./components/EventPage";
import EventDetails from "./components/EventDetails";
import ContactPage from "./components/ContactPage";

import AuthForm from "./components/AuthForm";

import Profile from "./components/Profile";
import SeoPage from "./components/SeoPage";
import AdminPage from "./components/AdminPage";
import BlogEdit from "./components/BlogEdit";

import LatestPaymentDetails from "./components/LatestPaymentDetails";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/course-list" element={<CoursePage />} />
          <Route path="/course-details/:id" element={<CourseDetails />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="events/event-details/:id" element={<EventDetails />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/blog-details/:title" element={<BlogDetails />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/auth" element={<AuthForm />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/seo-settings" element={<SeoPage />} />
          <Route path="/adminpage" element={<AdminPage />} />
          <Route path="/blogedit" element={<BlogEdit />} />

          <Route
            path="/latest-payment-details"
            element={<LatestPaymentDetails />}
          />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
