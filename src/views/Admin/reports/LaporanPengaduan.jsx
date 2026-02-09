import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import LayoutAdmin from "../../../layouts/Admin";
import Api from "../../../services/Api";
import ExportPDFButton from "../../../components/general/ExportPDFButton";

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
    await Api.get(`/api/reports/pengaduan/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setLaporanStatus(response.data.data || []);
    });
  };

  const fetchLaporanKecamatan = async () => {
    await Api.get(`/api/reports/pengaduan/kecamatan`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setLaporanKecamatan(response.data.data || []);
    });
  };

  const fetchLaporanTimeline = async () => {
    await Api.get(`/api/reports/pengaduan/timeline`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setLaporanTimeline(response.data.data || []);
    });
  };

  const fetchLaporanKelompokTani = async () => {
    const response = await Api.get(`/api/reports/pengaduan/kelompok-tani`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setLaporanKelompokTani(response.data.data || []);
    });
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

  const getStatusBadge = (status) => {
    const statusMap = {
      Pending: "badge bg-warning text-dark",
      Ditugaskan: "badge bg-info",
      "Dalam Proses": "badge bg-primary",
      Diverifikasi: "badge bg-secondary",
      Selesai: "badge bg-success",
      Ditolak: "badge bg-danger",
    };
    return statusMap[status] || "badge bg-secondary";
  };

  const getTotalPengaduan = () => {
    return laporanStatus.reduce(
      (sum, item) => sum + parseInt(item.total || 0),
      0,
    );
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

              {/* Laporan Per Kecamatan */}
              <div className="card border-0 rounded shadow-sm mb-4">
                <div className="card-header bg-white border-0 pt-3 pb-3">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <h6 className="mb-0">
                        <i className="fas fa-map-marker-alt me-2 text-info"></i>
                        Laporan Pengaduan Per Kecamatan
                      </h6>
                    </div>
                    <div className="col-md-6 text-end">
                      <ExportPDFButton
                        reportType="pengaduan-kecamatan"
                        reportName="Laporan Pengaduan Kecamatan"
                        disabled={laporanKecamatan.length === 0}
                      />
                    </div>
                  </div>
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
                          <th className="border-0">Kecamatan</th>
                          <th className="border-0 text-center">
                            Jumlah Pengaduan
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {laporanKecamatan.length > 0 ? (
                          laporanKecamatan.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td className="fw-bold text-center">
                                  {index + 1}
                                </td>
                                <td className="fw-semibold">
                                  {item.kecamatan_nama}
                                </td>
                                <td className="text-center">
                                  <span className="badge bg-primary rounded-pill px-3">
                                    {item.total}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={4}>
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

              {/* Laporan Timeline */}
              <div className="card border-0 rounded shadow-sm mb-4">
                <div className="card-header bg-white border-0 pt-3 pb-3">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <h6 className="mb-0">
                        <i className="fas fa-clock me-2 text-warning"></i>
                        Timeline Pengaduan (30 Hari Terakhir)
                      </h6>
                    </div>
                    <div className="col-md-6 text-end">
                      <ExportPDFButton
                        reportType="timeline-pengaduan"
                        reportName="Laporan Timeline Pengaduan"
                        disabled={laporanTimeline.length === 0}
                      />
                    </div>
                  </div>
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
                          <th className="border-0">Tanggal</th>
                          <th className="border-0 text-center">
                            Jumlah Pengaduan
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {laporanTimeline.length > 0 ? (
                          laporanTimeline.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td className="fw-bold text-center">
                                  {index + 1}
                                </td>
                                <td>
                                  {new Date(item.tanggal).toLocaleDateString(
                                    "id-ID",
                                    {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    },
                                  )}
                                </td>
                                <td className="text-center">
                                  <span className="badge bg-warning text-dark rounded-pill px-3">
                                    {item.total}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={4}>
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

              {/* Laporan Per Kelompok Tani */}
              <div className="card border-0 rounded shadow-sm mb-4">
                <div className="card-header bg-white border-0 pt-3 pb-3">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <h6 className="mb-0">
                        <i className="fas fa-users me-2 text-success"></i>
                        Laporan Pengaduan Per Kelompok Tani
                      </h6>
                    </div>
                    <div className="col-md-6 text-end">
                      <ExportPDFButton
                        reportType="pengaduan-kelompok-tani"
                        reportName="Laporan Pengaduan Kelompok Tani"
                        disabled={laporanKelompokTani.length === 0}
                      />
                    </div>
                  </div>
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
                          <th className="border-0">Kelompok Tani</th>
                          <th className="border-0 text-center">Total</th>
                          <th className="border-0 text-center">Selesai</th>
                          <th className="border-0 text-center">Proses</th>
                        </tr>
                      </thead>
                      <tbody>
                        {laporanKelompokTani.length > 0 ? (
                          laporanKelompokTani.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td className="fw-bold text-center">
                                  {index + 1}
                                </td>
                                <td className="fw-semibold">
                                  {item.kelompok_tani_nama}
                                </td>
                                <td className="text-center">
                                  <span className="badge bg-primary rounded-pill">
                                    {item.total_pengaduan}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <span className="badge bg-success rounded-pill">
                                    {item.total_selesai}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <span className="badge bg-warning text-dark rounded-pill">
                                    {item.total_proses}
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
            </div>
          </div>
        </div>
      </main>
    </LayoutAdmin>
  );
}
