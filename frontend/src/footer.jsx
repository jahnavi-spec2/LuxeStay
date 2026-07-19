import { Link } from "react-router-dom";
import { FaHotel, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footerTop">

        <div className="footerCol">
          <Link to="/" className="footerLogo">
            <FaHotel />
            <span>GoHotel</span>
          </Link>
          <p className="footerTagline">
            Curated stays, honest prices, and a booking experience that
            actually respects your time.
          </p>

          <div className="footerSocials">
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
          </div>
        </div>

        <div className="footerCol">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/my-bookings">My Bookings</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>

        <div className="footerCol">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
        </div>

        <div className="footerCol">
          <h4>Contact Us</h4>
          <p className="footerContactLine">
            <FaMapMarkerAlt /> 221B Hotel Street, New Delhi, India
          </p>
          <p className="footerContactLine">
            <FaPhoneAlt /> +91 98765 43210
          </p>
          <p className="footerContactLine">
            <FaEnvelope /> support@gohotel.com
          </p>
        </div>

      </div>

      <div className="footerBottom">
        <p>© {new Date().getFullYear()} GoHotel Prudence. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;