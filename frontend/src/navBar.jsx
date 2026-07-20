import { Link, useLocation } from "react-router-dom";
import { FaHotel, FaBookOpen, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "./context/AuthContext";

function Navbar() {

  const { user, logout } = useAuth();
  const location = useLocation();

  const handleExplore = () => {

    if (location.pathname !== "/") {
      window.location.href = "/#hotels";
      return;
    }

    const section = document.getElementById("hotels");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        <FaHotel />
        <span>LUXESTAY</span>
      </Link>

      <div className="nav-links">

        <Link to="/">Home</Link>

        <button className="nav-btn" onClick={handleExplore}>
          Explore
        </button>

        {user && (
          <Link to="/my-bookings">
            <FaBookOpen />
            My Bookings
          </Link>
        )}

      </div>

      <div className="nav-right">

        {!user ? (
          <>

            <Link className="login-btn" to="/login">
              Login
            </Link>

            <Link className="signup-btn" to="/signup">
              Sign Up
            </Link>

          </>
        ) : (
          <>
            <div className="username">
              <FaUserCircle />
              {user.username}
            </div>

            <button
              className="logout-btn"
              onClick={logout}
            >
              <FaSignOutAlt />
              Logout
            </button>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;