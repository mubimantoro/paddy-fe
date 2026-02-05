import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import LayoutAdmin from "../../../layouts/Admin";
import Api from "../../../services/Api";

export default function LaporanPrediksiPenyakit() {
  document.title = "Laporan Prediksi Penyakit - SIBalintan";

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [laporanPenyakit, setLaporanPenyakit] = useState([]);
  const [laporanUser, setLaporanUser] = useState([]);

  const token = Cookies.get("token");

  const fetchLaporanPenyakit = async () => {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    await Api.get(`/api/reports/predictions/disease?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setLaporanPenyakit(response.data.data || []);
    });
  };

  const fetchLaporanUser = async () => {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    await Api.get(`/api/reports/predictions/user?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setLaporanUser(response.data.data || []);
    });
  };

  const fetchAllReports = () => {
    fetchLaporanPenyakit();
    fetchLaporanUser();
  };

  useEffect(() => {
    fetchAllReports();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchAllReports();
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setTimeout(() => {
      fetchAllReports();
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

              {/* Laporan Per Penyakit */}
              <div className="card border-0 rounded shadow-sm mb-4">
                <div className="card-header bg-white">
                  <h6>
                    <i className="fas fa-virus me-2"></i>Laporan Prediksi Per
                    Penyakit
                  </h6>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered table-centered mb-0 rounded">
                      <thead className="thead-dark">
                        <tr className="border-0">
                          <th className="border-0">No.</th>
                          <th className="border-0">Nama Penyakit</th>
                          <th className="border-0">Jumlah Prediksi</th>
                          <th className="border-0">Persentase</th>
                        </tr>
                      </thead>
                      <tbody>
                        {laporanPenyakit.length > 0 ? (
                          laporanPenyakit.map((item, index) => (
                            <tr key={index}>
                              <td className="fw-bold text-center">
                                {index + 1}
                              </td>
                              <td>{item.disease_name}</td>
                              <td>{item.total}</td>
                              <td>{item.persentase}%</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4}>
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

              {/* Laporan Per User */}
              <div className="card border-0 rounded shadow-sm mb-4">
                <div className="card-header bg-white">
                  <h6>
                    <i className="fas fa-user me-2"></i>Laporan Prediksi Per
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
                          <th className="border-0">Jumlah Prediksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {laporanUser.length > 0 ? (
                          laporanUser.map((item, index) => (
                            <tr key={index}>
                              <td className="fw-bold text-center">
                                {index + 1}
                              </td>
                              <td>{item.nama_lengkap}</td>
                              <td>{item.username}</td>
                              <td>{item.total}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4}>
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
