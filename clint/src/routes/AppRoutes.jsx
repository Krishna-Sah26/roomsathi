import { BrowserRouter, Routes, Route } from "react-router-dom"
import RoomDetails from "../pages/RoomDetails"
import Rooms from "../pages/Rooms"
import OwnerDashboard from "../pages/OwnerDashboard"
import UserDashboard from "../pages/UserDashboard"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import AddRoom from "../pages/AddRoom"
import EditRoom from "../pages/EditRoom"
import ProtectedRoute from "../components/ProtectedRoute"
import ScrollToTop from "../components/ScrollToTop"
import About from "../pages/About"
import Contact from "../pages/Contact"
import PrivacyPolicy from "../pages/PrivacyPolicy"
import Terms from "../pages/Terms"
import Feedback from "../pages/Feedback"

function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/add-room"
          element={
            <ProtectedRoute
              allowedRoles={["owner"]}
              message="Please login as an owner first to add a room"
            >
              <AddRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-room/:id"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <EditRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner-dashboard"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route
          path="/room-details/:id"
          element={
            <ProtectedRoute message="Please login first to view room details">
              <RoomDetails />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default AppRoutes
