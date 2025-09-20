//import css bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/admin/css/custom.css";

//import font awesome
import "@fortawesome/fontawesome-free/js/all.js";

export default function auth({ children }) {
  return (
    <div>
      <div className="container">
        <div className="d-flex justify-content-center h-100">{children}</div>
      </div>
    </div>
  );
}
