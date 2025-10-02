//import Link
import { Link, useLocation } from "react-router-dom";

//import js cookie
import Cookies from "js-cookie";
import { useStore as useUserStore } from "../../stores/user";

export default function sidebar() {
  //assigning location variable
  const location = useLocation();

  //destructuring pathname from location
  const { pathname } = location;

  //Javascript split method to get the name of the path in array
  const activeRoute = pathname.split("/");

  //get data user from cookies
  // const { user } = useUserStore();
  const user = JSON.parse(Cookies.get("user"));

  return (
    <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
      <div className="sb-sidenav-menu">
        <div className="nav">
          <div className="sb-sidenav-menu-heading"></div>
          <Link
            className={
              activeRoute[2] === "dashboard"
                ? "nav-link active-sidebar"
                : "nav-link"
            }
            to="/admin/dashboard"
          >
            <div className="sb-nav-link-icon">
              <i className="fas fa-tachometer-alt"></i>
            </div>
            Dashboard
          </Link>
        </div>
      </div>
      <div className="sb-sidenav-footer">
        <div className="small">Logged in as:</div>
        {user.username}
      </div>
    </nav>
  );
}
