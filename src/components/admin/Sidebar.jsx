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
  const { user } = useUserStore();

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

          <div className="sb-sidenav-menu-heading">Menu</div>
          <Link
            className={
              activeRoute[2] === "wilayah"
                ? "nav-link active-sidebar"
                : "nav-link"
            }
            to="/admin/wilayah"
          >
            Wilayah
          </Link>
          <Link
            className={
              activeRoute[2] === "kecamatan"
                ? "nav-link active-sidebar"
                : "nav-link"
            }
            to="/admin/kecamatan"
          >
            Kecamatan
          </Link>
          <Link
            className={
              activeRoute[2] === "pengaduan-tanaman"
                ? "nav-link active-sidebar"
                : "nav-link"
            }
            to="/admin/pengaduan-tanaman"
          >
            Pengaduan Tanaman
          </Link>
          <>
            <div className="sb-sidenav-menu-heading">Manajemen User</div>
            <a
              className={
                "nav-link collapsed " +
                (activeRoute[2] === "roles"
                  ? " active-sidebar"
                  : activeRoute[2] === "users"
                  ? " active-sidebar"
                  : "")
              }
              href="#"
              data-bs-toggle="collapse"
              data-bs-target="#collapseUsers"
              aria-expanded="false"
              aria-controls="collapseUsers"
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-user-circle"></i>
              </div>
              Users
              <div className="sb-sidenav-collapse-arrow">
                <i
                  className="fas fa-angle-down"
                  style={{ color: "color: rgb(65 60 60)" }}
                ></i>
              </div>
            </a>
          </>

          <div
            className={
              "collapse " +
              (activeRoute[2] === "roles"
                ? " show"
                : activeRoute[2] === "users"
                ? " show"
                : "")
            }
            id="collapseUsers"
            aria-labelledby="headingOne"
            data-bs-parent="#sidenavAccordion"
          >
            <nav className="sb-sidenav-menu-nested nav">
              <Link
                className={
                  activeRoute[2] == "roles"
                    ? "nav-link active-sidebar"
                    : "nav-link"
                }
                to="/admin/roles"
              >
                Roles
              </Link>

              <Link
                className={
                  activeRoute[2] == "users"
                    ? "nav-link active-sidebar"
                    : "nav-link"
                }
                to="/admin/users"
              >
                Users
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="sb-sidenav-footer">
        <div className="small">Logged in as:</div>
        {user.username}
      </div>
    </nav>
  );
}
