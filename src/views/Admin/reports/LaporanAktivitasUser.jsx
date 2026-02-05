import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import LayoutAdmin from "../../../layouts/Admin";
import Api from "../../../services/Api";

export default function LaporanAktivitasUser() {
  document.title = "Laporan Aktivitas User - SIBalintan";

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [laporanAktivitas, setLaporanAktivitas] = useState([]);

  const token = Cookies.get("token");

  const fetchLaporanAktivitas = async () => {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    await Api.get(`/api/reports/users/activity?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setLaporanAktivitas(response.data.data || []);
    });
  };

  useEffect(() => {
    fetchLaporanAktivitas();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchLaporanAktivitas();
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setTimeout(() => {
      fetchLaporanAktivitas();
    }, 100);
  };

  return (
    <LayoutAdmin>
      <main>
        <div className="container-fluid mb-5 mt-5">
          <div className="row">
            <div className="col-md-12">
              <Link
                to="/admin/dashboard"
                className="btn btn-md btn-primary border-0 shadow-sm mb-3"
              >
                <i className="fa fa-long-arrow-alt-left me-2"></i> Kembali
              </Link>

              {/* Filter */}
              <div className="card border-0 rounded shadow-sm mb-4">
                <div className="card-body">
                  <h6>
                    <i className="fas fa-filter me-2"></i>Filter Laporan
                  </h6>
                  <hr />
                  <form onSubmit={handleFilter}>
                    <div className="row">
                      <div className="col-md-5">
                        <label className="form-label fw-bold">
                          Tanggal Mulai
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div className="col-md-5">
                        <label className="form-label fw-bold">
                          Tanggal Akhir
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                      <div className="col-md-2 d-flex align-items-end">
                        <button type="submit" className="btn btn-primary me-2">
                          <i className="fa fa-search"></i> Filter
                        </button>
                        <button
                          type="button"
                          onClick={handleReset}
                          className="btn btn-secondary"
                        >
                          <i className="fa fa-redo"></i> Reset
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Laporan Aktivitas User */}
              <div className="card border-0 rounded shadow-sm mb-4">
                <div className="card-header bg-white">
                  <h6>
                    <i className="fas fa-user-clock me-2"></i>Laporan Aktivitas
                    User
                  </h6>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered table-centered mb-0 rounded">
                      <thead className="thead-dark">
                        <tr className="border-0">
                          <th className="border-0">No.</th>
                          <th className="border-0">Nama User</th>
                          <th className="border-0">Username</th>
                          <th className="border-0">Role</th>
                          <th className="border-0">Total Pengaduan</th>
                          <th className="border-0">Total Prediksi</th>
                          <th className="border-0">Total Aktivitas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {laporanAktivitas.length > 0 ? (
                          laporanAktivitas.map((item, index) => (
                            <tr key={index}>
                              <td className="fw-bold text-center">
                                {index + 1}
                              </td>
                              <td>{item.nama_lengkap}</td>
                              <td>{item.username}</td>
                              <td>
                                <span className="badge bg-primary">
                                  {item.role}
                                </span>
                              </td>
                              <td>{item.total_pengaduan}</td>
                              <td>{item.total_prediksi}</td>
                              <td>
                                <strong>{item.total_aktivitas}</strong>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7}>
                              <div className="alert alert-danger border-0 rounded shadow-sm w-100 text-center">
                                Data Belum Tersedia!
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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
