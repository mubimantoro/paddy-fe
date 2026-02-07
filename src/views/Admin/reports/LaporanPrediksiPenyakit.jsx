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

  const getConfidenceBadge = (confidence) => {
    if (confidence >= 90) return "badge bg-success";
    if (confidence >= 75) return "badge bg-primary";
    if (confidence >= 60) return "badge bg-warning text-dark";
    return "badge bg-danger";
  };

  const getSummaryStats = () => {
    return {
      totalPrediksi: laporanPenyakit.reduce(
        (sum, item) => sum + parseInt(item.total || 0),
        0,
      ),
      totalPenyakit: laporanPenyakit.length,
      totalUser: laporanUser.length,
      avgConfidence:
        laporanPenyakit.length > 0
          ? (
              laporanPenyakit.reduce(
                (sum, item) => sum + parseFloat(item.avg_confidence || 0),
                0,
              ) / laporanPenyakit.length
            ).toFixed(2)
          : 0,
    };
  };

  const stats = getSummaryStats();

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
                <div className="card-header bg-white border-0 pt-3 pb-3">
                  <h6 className="mb-0">
                    <i className="fas fa-table me-2 text-primary"></i>
                    Laporan Prediksi Per Jenis Penyakit
                  </h6>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover table-bordered align-middle mb-0 rounded">
                      <thead className="thead-dark">
                        <tr className="border-0">
                          <th
                            className="border-0 text-center"
                            style={{ width: "5%" }}
                          >
                            No.
                          </th>
                          <th className="border-0">Jenis Penyakit</th>
                          <th className="border-0 text-center">
                            Total Prediksi
                          </th>
                          <th className="border-0 text-center">
                            Tingkat Keyakinan
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {laporanPenyakit.length > 0 ? (
                          laporanPenyakit
                            .sort(
                              (a, b) => parseInt(b.total) - parseInt(a.total),
                            )
                            .map((item, index) => {
                              const percentage = (
                                (item.total / stats.totalPrediksi) *
                                100
                              ).toFixed(1);

                              return (
                                <tr key={index}>
                                  <td className="fw-bold text-center">
                                    {index + 1}
                                  </td>
                                  <td>
                                    <div className="fw-semibold">
                                      {item.disease}
                                    </div>
                                  </td>
                                  <td className="text-center">
                                    <span className="badge bg-danger rounded-pill px-3">
                                      {item.total}
                                    </span>
                                  </td>
                                  <td className="text-center">
                                    <span
                                      className={getConfidenceBadge(
                                        item.avg_confidence,
                                      )}
                                    >
                                      {item.avg_confidence}%
                                    </span>
                                  </td>
                                </tr>
                              );
                            })
                        ) : (
                          <tr>
                            <td colSpan={6}>
                              <div
                                className="alert alert-danger border-0 rounded shadow-sm w-100 text-center"
                                role="alert"
                              >
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
                <div className="card-header bg-white border-0 pt-3 pb-3">
                  <h6 className="mb-0">
                    <i className="fas fa-table me-2 text-primary"></i>
                    Laporan Prediksi Per User
                  </h6>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover table-bordered align-middle mb-0 rounded">
                      <thead className="thead-dark">
                        <tr className="border-0">
                          <th
                            className="border-0 text-center"
                            style={{ width: "5%" }}
                          >
                            No.
                          </th>
                          <th className="border-0">Nama User</th>
                          <th className="border-0">Kelompok Tani</th>
                          <th className="border-0 text-center">
                            Total Prediksi
                          </th>
                          <th className="border-0">Jenis Penyakit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {laporanUser.length > 0 ? (
                          laporanUser
                            .sort(
                              (a, b) =>
                                parseInt(b.total_prediksi) -
                                parseInt(a.total_prediksi),
                            )
                            .map((item, index) => (
                              <tr key={index}>
                                <td className="fw-bold text-center">
                                  {index + 1}
                                </td>
                                <td>
                                  <div className="fw-semibold">
                                    {item.nama_lengkap}
                                  </div>
                                </td>
                                <td>{item.kelompok_tani || "-"}</td>
                                <td className="text-center">
                                  <span className="badge bg-primary rounded-pill px-3">
                                    {item.total_prediksi}
                                  </span>
                                </td>
                                <td>
                                  <div className="d-flex flex-wrap gap-1">
                                    {item.diseases
                                      ? item.diseases
                                          .split(", ")
                                          .map((disease, idx) => (
                                            <span
                                              key={idx}
                                              className="badge bg-danger bg-opacity-75"
                                            >
                                              {disease}
                                            </span>
                                          ))
                                      : "-"}
                                  </div>
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan={5}>
                              <div
                                className="alert alert-danger border-0 rounded shadow-sm w-100 text-center"
                                role="alert"
                              >
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
