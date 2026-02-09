import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import LayoutAdmin from "../../../layouts/Admin";
import Api from "../../../services/Api";

export default function LaporanWilayah() {
  document.title = "Laporan Wilayah - SIBalintan";

  // State untuk data laporan
  const [laporanWilayah, setLaporanWilayah] = useState([]);

  // State untuk loading
  const [loading, setLoading] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  const token = Cookies.get("token");

  // Fetch data laporan wilayah
  const fetchLaporanWilayah = async () => {
    setLoading(true);

    await Api.get(`/api/reports/wilayah/pengaduan`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setLaporanWilayah(response.data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching laporan wilayah:", error);
        setLaporanWilayah([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLaporanWilayah();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchLaporanWilayah();
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setTimeout(() => {
      fetchLaporanWilayah();
    }, 100);
  };

  // Quick filter presets
  const setQuickFilter = (type) => {
    const today = new Date();
    let start = new Date();

    switch (type) {
      case "today":
        start = today;
        break;
      case "week":
        start.setDate(today.getDate() - 7);
        break;
      case "month":
        start.setMonth(today.getMonth() - 1);
        break;
      case "year":
        start.setFullYear(today.getFullYear() - 1);
        break;
      default:
        start = today;
    }

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  };

  // Export Excel
  const handleExportPDF = async () => {
    setExportingPDF(true);
    try {
      const response = await Api.get(`/api/export/pdf/wilayah-pengaduan`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Laporan_Wilayah_${new Date().toISOString().split("T")[0]}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Clean up
      window.URL.revokeObjectURL(url);

      toast.success("Berhasil export laporan ke PDF", {
        position: "top-right",
        duration: 4000,
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Gagal export PDF. Silakan coba lagi.", {
        position: "top-right",
        duration: 4000,
      });
    } finally {
      setExportingPDF(false);
    }
  };

  // Get severity badge based on total pengaduan
  const getSeverityBadge = (total) => {
    if (total >= 100) return { class: "bg-danger", text: "Sangat Tinggi" };
    if (total >= 50) return { class: "bg-warning text-dark", text: "Tinggi" };
    if (total >= 20) return { class: "bg-info", text: "Sedang" };
    return { class: "bg-success", text: "Rendah" };
  };

  // Calculate summary statistics
  const getSummaryStats = () => {
    return {
      totalWilayah: laporanWilayah.length,
      totalPengaduan: laporanWilayah.reduce(
        (sum, item) => sum + parseInt(item.total_pengaduan || 0),
        0,
      ),
      totalSelesai: laporanWilayah.reduce(
        (sum, item) => sum + parseInt(item.total_selesai || 0),
        0,
      ),
      totalKecamatan: laporanWilayah.reduce(
        (sum, item) => sum + parseInt(item.jumlah_kecamatan || 0),
        0,
      ),
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

              {/* Tabel Laporan Wilayah */}
              <div className="card border-0 rounded shadow-sm mb-4">
                <div className="card-header bg-white border-0 pt-3 pb-3">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <h6 className="mb-0">
                        <i className="fas fa-table me-2 text-primary"></i>
                        Detail Laporan Per Wilayah
                      </h6>
                    </div>
                    <div className="col-md-6 text-end">
                      {/* Export PDF Button */}
                      <button
                        onClick={handleExportPDF}
                        disabled={exportingPDF || laporanWilayah.length === 0}
                        className="btn btn-danger btn-sm shadow-sm"
                      >
                        {exportingPDF ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Generating PDF...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-file-pdf me-2"></i>
                            Export PDF
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  {loading ? (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2 text-muted">Memuat data...</p>
                    </div>
                  ) : (
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
                            <th className="border-0">Wilayah</th>
                            <th className="border-0 text-center">
                              Jumlah Kecamatan
                            </th>
                            <th className="border-0 text-center">
                              Total Pengaduan
                            </th>
                            <th className="border-0 text-center">
                              Total Selesai
                            </th>
                            <th
                              className="border-0 text-center"
                              style={{ width: "15%" }}
                            >
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {laporanWilayah.length > 0 ? (
                            laporanWilayah
                              .sort(
                                (a, b) =>
                                  parseInt(b.total_pengaduan) -
                                  parseInt(a.total_pengaduan),
                              )
                              .map((item, index) => {
                                const completionRate =
                                  item.total_pengaduan > 0
                                    ? (
                                        (item.total_selesai /
                                          item.total_pengaduan) *
                                        100
                                      ).toFixed(1)
                                    : 0;
                                const severity = getSeverityBadge(
                                  item.total_pengaduan,
                                );

                                return (
                                  <tr key={index}>
                                    <td className="fw-bold text-center">
                                      {index + 1}
                                    </td>
                                    <td>
                                      <div className="fw-semibold">
                                        {item.wilayah}
                                      </div>
                                    </td>
                                    <td className="text-center">
                                      <span className="badge bg-info rounded-pill">
                                        {item.jumlah_kecamatan}
                                      </span>
                                    </td>
                                    <td className="text-center">
                                      <span className="badge bg-danger rounded-pill px-3">
                                        {item.total_pengaduan}
                                      </span>
                                    </td>
                                    <td className="text-center">
                                      <span className="badge bg-success rounded-pill px-3">
                                        {item.total_selesai}
                                      </span>
                                    </td>

                                    <td className="text-center">
                                      <span
                                        className={`badge ${severity.class}`}
                                      >
                                        {severity.text}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })
                          ) : (
                            <tr>
                              <td colSpan={7}>
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </LayoutAdmin>
  );
}
