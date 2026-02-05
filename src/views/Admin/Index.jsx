import { useState, useEffect } from "react";
import LayoutAdmin from "../../layouts/Admin";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import Api from "../../services/Api";

export default function Dashboard() {
  document.title = "Dashboard - SIBalintan";

  const [summary, setSummary] = useState({
    total_popt: 0,
    total_pengaduan: 0,
    total_user: 0,
    total_prediksi: 0,
    pengaduan_menunggu: 0,
    pengaduan_diproses: 0,
    pengaduan_selesai: 0,
  });

  const token = Cookies.get("token");

  const fetchDashboardSummary = async () => {
    await Api.get("/api/reports/dashboard/summary", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setSummary(response.data.data);
    });
  };

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  return (
    <LayoutAdmin>
      <main>
        <div className="container-fluid px-4 mt-5">
          {/* Summary Cards */}
          <div className="row">
            <div className="col-xl-3 col-md-6">
              <div className="card bg-primary text-white mb-4 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="small">Petugas POPT</div>
                      <div className="h4 mb-0">{summary.total_popt}</div>
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <Link
                    className="small text-white stretched-link"
                    to="/admin/popt"
                  >
                    Lihat Detail
                  </Link>
                  <div className="small text-white">
                    <i className="fas fa-angle-right"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card bg-warning text-white mb-4 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="small">Pengaduan Tanaman</div>
                      <div className="h4 mb-0">{summary.total_pengaduan}</div>
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <Link
                    className="small text-white stretched-link"
                    to="/admin/pengaduan-tanaman"
                  >
                    Lihat Detail
                  </Link>
                  <div className="small text-white">
                    <i className="fas fa-angle-right"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card bg-success text-white mb-4 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="small">Total User</div>
                      <div className="h4 mb-0">{summary.total_user}</div>
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <Link
                    className="small text-white stretched-link"
                    to="/admin/users"
                  >
                    Lihat Detail
                  </Link>
                  <div className="small text-white">
                    <i className="fas fa-angle-right"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div className="card bg-info text-white mb-4 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="small">Total Prediksi</div>
                      <div className="h4 mb-0">{summary.total_prediksi}</div>
                    </div>
                  </div>
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <Link
                    className="small text-white stretched-link"
                    to="/admin/prediksi"
                  >
                    Lihat Detail
                  </Link>
                  <div className="small text-white">
                    <i className="fas fa-angle-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Pengaduan */}
          <div className="row">
            <div className="col-xl-12">
              <div className="card mb-4 border-0 shadow-sm">
                <div className="card-header bg-white">
                  <i className="fas fa-chart-bar me-1"></i>
                  Status Pengaduan
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="border-start border-warning border-4 ps-3 mb-3">
                        <div className="text-muted small">Menunggu</div>
                        <div className="h5 mb-0">
                          {summary.pengaduan_menunggu}
                        </div>
                        <small className="text-muted">
                          Pending & Ditugaskan
                        </small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="border-start border-primary border-4 ps-3 mb-3">
                        <div className="text-muted small">Diproses</div>
                        <div className="h5 mb-0">
                          {summary.pengaduan_diproses}
                        </div>
                        <small className="text-muted">
                          Dalam Proses & Diverifikasi
                        </small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="border-start border-success border-4 ps-3 mb-3">
                        <div className="text-muted small">Selesai</div>
                        <div className="h5 mb-0">
                          {summary.pengaduan_selesai}
                        </div>
                        <small className="text-muted">Terselesaikan</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="row">
            <div className="col-xl-12">
              <div className="card mb-4 border-0 shadow-sm">
                <div className="card-header bg-white">
                  <i className="fas fa-chart-line me-1"></i>
                  Laporan & Analisis
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 col-lg-3 mb-3">
                      <Link
                        to="/admin/reports/pengaduan"
                        className="text-decoration-none"
                      >
                        <div className="card border-0 bg-light h-100">
                          <div className="card-body text-center">
                            <i className="fas fa-file-alt text-primary fa-3x mb-2"></i>
                            <div className="fw-bold">Laporan Pengaduan</div>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="col-md-6 col-lg-3 mb-3">
                      <Link
                        to="/admin/reports/popt"
                        className="text-decoration-none"
                      >
                        <div className="card border-0 bg-light h-100">
                          <div className="card-body text-center">
                            <i className="fas fa-chart-bar text-success fa-3x mb-2"></i>
                            <div className="fw-bold">Kinerja POPT</div>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="col-md-6 col-lg-3 mb-3">
                      <Link
                        to="/admin/reports/prediksi"
                        className="text-decoration-none"
                      >
                        <div className="card border-0 bg-light h-100">
                          <div className="card-body text-center">
                            <i className="fas fa-brain text-info fa-3x mb-2"></i>
                            <div className="fw-bold">Prediksi Penyakit</div>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="col-md-6 col-lg-3 mb-3">
                      <Link
                        to="/admin/reports/aktivitas"
                        className="text-decoration-none"
                      >
                        <div className="card border-0 bg-light h-100">
                          <div className="card-body text-center">
                            <i className="fas fa-user-clock text-warning fa-3x mb-2"></i>
                            <div className="fw-bold">Aktivitas User</div>
                          </div>
                        </div>
                      </Link>
                    </div>
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
