import { useState, useEffect } from "react";
import LayoutAdmin from "../../layouts/Admin";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import Api from "../../services/Api";

export default function Dashboard() {
  document.title = "Dashboard - SIBalintan";

  const [countPopt, setCountPopt] = useState(0);
  const [countPengaduanTanaman, setCountPengaduanTanaman] = useState(0);
  const [countUser, setCountUser] = useState(0);

  //token from cookies
  const token = Cookies.get("token");

  //hook useEffect
  useEffect(() => {
    //fetch api
    Api.get("/api/admin/dashboard", {
      //header
      headers: {
        //header Bearer + Token
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      //set data
      setCountPopt(response.data.data.totalPopt);
      setCountPengaduanTanaman(response.data.data.totalPengaduan);
      setCountUser(response.data.data.totalUser);
    });
  }, []);

  return (
    <LayoutAdmin>
      <main>
        <div class="container-fluid px-4 mt-5">
          <div class="row">
            <div class="col-xl-4 col-md-6">
              <div class="card bg-primary text-white mb-4 border-0 shadow-sm">
                <div class="card-body">
                  <strong>{countPopt}</strong> Petugas POPT
                </div>
                <div class="card-footer d-flex align-items-center justify-content-between">
                  <Link
                    class="small text-white stretched-link"
                    to="/admin/popt"
                  >
                    Lihat Detail
                  </Link>
                  <div class="small text-white">
                    <i class="fas fa-angle-right"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-4 col-md-6">
              <div class="card bg-warning text-white mb-4 border-0 shadow-sm">
                <div class="card-body">
                  <strong>{countPengaduanTanaman}</strong> Pengaduan Tanaman
                </div>
                <div class="card-footer d-flex align-items-center justify-content-between">
                  <Link
                    class="small text-white stretched-link"
                    to="/admin/pengaduan-tanaman"
                  >
                    Lihat Detail
                  </Link>
                  <div class="small text-white">
                    <i class="fas fa-angle-right"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-4 col-md-6">
              <div class="card bg-success text-white mb-4 border-0 shadow-sm">
                <div class="card-body">
                  <strong>{countUser}</strong> User
                </div>
                <div class="card-footer d-flex align-items-center justify-content-between">
                  <Link
                    class="small text-white stretched-link"
                    to="/admin/products"
                  >
                    Lihat Detail
                  </Link>
                  <div class="small text-white">
                    <i class="fas fa-angle-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </LayoutAdmin>
  );
}
