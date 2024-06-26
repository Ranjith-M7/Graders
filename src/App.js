import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import AboutPage from "./components/AboutPage";
import CoursePage from "./components/CoursePage";
import CourseDetails from "./components/CourseDetails";

import Blog from "./components/Blog";
import BlogDetails from "./components/BlogDetails";
import TeamPage from "./components/TeamPage";
import EventsPage from "./components/EventsPage";
import ContactPage from "./components/ContactPage";

import LoginForm from "./components/signin";
import SignUpForm from "./components/signup";
import Profile from "./components/Profile";
import SeoPage from "./components/SeoPage";
import AdminPage from "./components/AdminPage";
import BlogEdit from "./components/BlogEdit";

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
          <Route path="/events" element={<EventsPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/blog-details/:title" element={<BlogDetails />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/signin" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/seo-settings" element={<SeoPage />} />
          <Route path="/adminpage" element={<AdminPage />} />
          <Route path="/blogedit" element={<BlogEdit />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
