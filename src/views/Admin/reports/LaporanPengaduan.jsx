import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import LayoutAdmin from "../../../layouts/Admin";
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

    await Api.get(`/api/reports/pengaduan/status?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setLaporanStatus(response.data.data || []);
    });
  };

  const fetchLaporanKecamatan = async () => {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    await Api.get(`/api/reports/pengaduan/kecamatan?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setLaporanKecamatan(response.data.data || []);
    });
  };

  const fetchLaporanTimeline = async () => {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    await Api.get(`/api/reports/pengaduan/timeline?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setLaporanTimeline(response.data.data || []);
    });
  };

  const fetchLaporanKelompokTani = async () => {
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
    ).then((response) => {
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

  // Export Excel
  const handleExportExcel = async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      const response = await Api.get(
        `/api/reports/pengaduan/export/excel?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Laporan_Pengaduan_${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Berhasil export laporan ke Excel", {
        position: "top-right",
        duration: 4000,
      });
    } catch (error) {
      console.error("Error exporting Excel:", error);
      toast.error("Gagal export Excel", {
        position: "top-right",
        duration: 4000,
      });
    }
  };

  // Export PDF
  const handleExportPDF = async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      const response = await Api.get(
        `/api/reports/pengaduan/export/pdf?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Laporan_Pengaduan_${new Date().toISOString().split("T")[0]}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Berhasil export laporan ke PDF", {
        position: "top-right",
        duration: 4000,
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Gagal export PDF", {
        position: "top-right",
        duration: 4000,
      });
    }
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

              <div className="row mb-3">
                <div className="col-md-12">
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-success"
                      onClick={handleExportExcel}
                      disabled={
                        laporanStatus.length === 0 &&
                        laporanKecamatan.length === 0 &&
                        laporanKelompokTani.length === 0 &&
                        laporanTimeline.length === 0
                      }
                    >
                      <i className="fas fa-file-excel me-2"></i>
                      Export Excel
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={handleExportPDF}
                      disabled={
                        laporanStatus.length === 0 &&
                        laporanKecamatan.length === 0 &&
                        laporanKelompokTani.length === 0 &&
                        laporanTimeline.length === 0
                      }
                    >
                      <i className="fas fa-file-pdf me-2"></i>
                      Export PDF
                    </button>
                  </div>
                </div>
              </div>

              {/* Laporan Per Kecamatan */}
              <div className="card border-0 rounded shadow-sm mb-4">
                <div className="card-header bg-white border-0 pt-3 pb-3">
                  <h6 className="mb-0">
                    <i className="fas fa-map-marker-alt me-2 text-info"></i>
                    Laporan Pengaduan Per Kecamatan
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
                  <h6 className="mb-0">
                    <i className="fas fa-clock me-2 text-warning"></i>
                    Timeline Pengaduan
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
                  <h6 className="mb-0">
                    <i className="fas fa-users me-2 text-success"></i>
                    Laporan Pengaduan Per Kelompok Tani
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
