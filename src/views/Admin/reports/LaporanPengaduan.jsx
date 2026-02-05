import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import LayoutAdmin from "../../../layouts/Admin";
import toast from "react-hot-toast";
import Api from "../../../services/Api";

export default function LaporanPengaduan() {
  document.title = "Laporan Pengaduan - SIBalintan";

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [laporanStatus, setLaporanStatus] = useState([]);
  const [laporanKecamatan, setLaporanKecamatan] = useState([]);
  const [laporanTimeline, setLaporanTimeline] = useState([]);
  const [laporanKelompokTani, setLaporanKelompokTani] = useState([]);

  const token = Cookies.get("token");

  const fetchLaporanStatus = async () => {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    const response = await Api.get(`/api/reports/pengaduan/status?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setLaporanStatus(response.data.data || []);
    });
  };

  const fetchLaporanKecamatan = async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      const response = await Api.get(
        `/api/reports/pengaduan/kecamatan?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setLaporanKecamatan(response.data.data || []);
    } catch (error) {
      toast.error("Gagal mengambil laporan pengaduan per kecamatan");
    }
  };

  const fetchLaporanTimeline = async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      const response = await Api.get(
        `/api/reports/pengaduan/timeline?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setLaporanTimeline(response.data.data || []);
    } catch (error) {
      toast.error("Gagal mengambil laporan timeline pengaduan");
    }
  };

  const fetchLaporanKelompokTani = async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      const response = await Api.get(
        `/api/reports/pengaduan/kelompok-tani?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setLaporanKelompokTani(response.data.data || []);
    } catch (error) {
      toast.error("Gagal mengambil laporan pengaduan per kelompok tani");
    }
  };

  const fetchAllReports = () => {
    fetchLaporanStatus();
    fetchLaporanKecamatan();
    fetchLaporanTimeline();
    fetchLaporanKelompokTani();
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

              {/* Laporan Per Status */}
              <div className="card border-0 rounded shadow-sm mb-4">
                <div className="card-header bg-white">
                  <h6>
                    <i className="fas fa-chart-pie me-2"></i>Laporan Pengaduan
                    Per Status
                  </h6>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered table-centered mb-0 rounded">
                      <thead className="thead-dark">
                        <tr className="border-0">
                          <th className="border-0">No.</th>
                          <th className="border-0">Status</th>
                          <th className="border-0">Jumlah</th>
                          <th className="border-0">Persentase</th>
                        </tr>
                      </thead>
                      <tbody>
                        {laporanStatus.length > 0 ? (
                          laporanStatus.map((item, index) => (
                            <tr key={index}>
                              <td className="fw-bold text-center">
                                {index + 1}
                              </td>
                              <td>{item.status}</td>
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

              {/* Laporan Per Kecamatan */}
              <div className="card border-0 rounded shadow-sm mb-4">
                <div className="card-header bg-white">
                  <h6>
                    <i className="fas fa-map-marker-alt me-2"></i>Laporan
                    Pengaduan Per Kecamatan
                  </h6>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered table-centered mb-0 rounded">
                      <thead className="thead-dark">
                        <tr className="border-0">
                          <th className="border-0">No.</th>
                          <th className="border-0">Kecamatan</th>
                          <th className="border-0">Jumlah Pengaduan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {laporanKecamatan.length > 0 ? (
                          laporanKecamatan.map((item, index) => (
                            <tr key={index}>
                              <td className="fw-bold text-center">
                                {index + 1}
                              </td>
                              <td>{item.kecamatan_nama}</td>
                              <td>{item.total}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3}>
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

              {/* Laporan Timeline */}
              <div className="card border-0 rounded shadow-sm mb-4">
                <div className="card-header bg-white">
                  <h6>
                    <i className="fas fa-clock me-2"></i>Timeline Pengaduan
                  </h6>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered table-centered mb-0 rounded">
                      <thead className="thead-dark">
                        <tr className="border-0">
                          <th className="border-0">No.</th>
                          <th className="border-0">Tanggal</th>
                          <th className="border-0">Jumlah Pengaduan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {laporanTimeline.length > 0 ? (
                          laporanTimeline.map((item, index) => (
                            <tr key={index}>
                              <td className="fw-bold text-center">
                                {index + 1}
                              </td>
                              <td>
                                {new Date(item.tanggal).toLocaleDateString(
                                  "id-ID",
                                )}
                              </td>
                              <td>{item.total}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3}>
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

              {/* Laporan Per Kelompok Tani */}
              <div className="card border-0 rounded shadow-sm mb-4">
                <div className="card-header bg-white">
                  <h6>
                    <i className="fas fa-users me-2"></i>Laporan Pengaduan Per
                    Kelompok Tani
                  </h6>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered table-centered mb-0 rounded">
                      <thead className="thead-dark">
                        <tr className="border-0">
                          <th className="border-0">No.</th>
                          <th className="border-0">Kelompok Tani</th>
                          <th className="border-0">Jumlah Pengaduan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {laporanKelompokTani.length > 0 ? (
                          laporanKelompokTani.map((item, index) => (
                            <tr key={index}>
                              <td className="fw-bold text-center">
                                {index + 1}
                              </td>
                              <td>{item.kelompok_tani_nama}</td>
                              <td>{item.total}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3}>
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
