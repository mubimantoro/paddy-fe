import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import LayoutAdmin from "../../../layouts/Admin";
import Api from "../../../services/Api";
import ExportPDFButton from "../../../components/general/ExportPDFButton";

export default function LaporanKinerjaPOPT() {
  document.title = "Laporan Kinerja POPT - SIBalintan";

  // State untuk filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState("");

  // State untuk data laporan
  const [laporanKinerja, setLaporanKinerja] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);

  const token = Cookies.get("token");

  // Fetch data kinerja POPT
  const fetchLaporanKinerja = async () => {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    await Api.get(`/api/reports/popt/kinerja?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setLaporanKinerja(response.data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching laporan kinerja:", error);
        setLaporanKinerja([]);
      });
  };

  // Fetch list kecamatan untuk filter
  const fetchKecamatan = async () => {
    await Api.get("/api/kecamatan", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setKecamatanList(response.data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching kecamatan:", error);
      });
  };

  useEffect(() => {
    fetchLaporanKinerja();
    fetchKecamatan();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchLaporanKinerja();
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setSelectedKecamatan("");
    setTimeout(() => {
      fetchLaporanKinerja();
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

  const handleExportPDF = async () => {
    setExportingPDF(true);
    try {
      const response = await Api.get(`/api/export/pdf/kinerja-popt`, {
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

  // Filter data berdasarkan kecamatan
  const getFilteredData = () => {
    if (!selectedKecamatan) return laporanKinerja;
    return laporanKinerja.filter(
      (item) => item.kecamatan_nama === selectedKecamatan,
    );
  };

  // Get performance badge
  const getPerformanceBadge = (percentage) => {
    if (percentage >= 80) return "badge bg-success";
    if (percentage >= 60) return "badge bg-primary";
    if (percentage >= 40) return "badge bg-warning text-dark";
    return "badge bg-danger";
  };

  // Calculate summary statistics
  const getSummaryStats = () => {
    const data = getFilteredData();
    return {
      totalPOPT: data.length,
      totalDitugaskan: data.reduce(
        (sum, item) => sum + parseInt(item.total_ditugaskan || 0),
        0,
      ),
      totalSelesai: data.reduce(
        (sum, item) => sum + parseInt(item.total_selesai || 0),
        0,
      ),
      totalVerifikasi: data.reduce(
        (sum, item) => sum + parseInt(item.total_verifikasi || 0),
        0,
      ),
      avgPerformance:
        data.length > 0
          ? (
              data.reduce(
                (sum, item) => sum + parseFloat(item.persentase_selesai || 0),
                0,
              ) / data.length
            ).toFixed(2)
          : 0,
    };
  };

  const stats = getSummaryStats();
  const filteredData = getFilteredData();

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

              {/* Tabel Kinerja POPT */}
              <div className="card border-0 rounded shadow-sm mb-4">
                <div className="card-header bg-white border-0 pt-3 pb-3">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <h6 className="mb-0">
                        <i className="fas fa-table me-2 text-primary"></i>
                        Detail Kinerja POPT
                      </h6>
                    </div>
                    <div className="col-md-6 text-end">
                      {/* Export PDF Button */}
                      <ExportPDFButton
                        reportType="kinerja-popt"
                        reportName="Kinerja POPT"
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
                          <th className="border-0">Nama POPT</th>
                          <th className="border-0">Kecamatan</th>
                          <th className="border-0 text-center">Ditugaskan</th>
                          <th className="border-0 text-center">Selesai</th>
                          <th className="border-0 text-center">Verifikasi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.length > 0 ? (
                          filteredData.map((item, index) => (
                            <tr key={index}>
                              <td className="fw-bold text-center">
                                {index + 1}
                              </td>
                              <td>
                                <div className="fw-semibold">
                                  {item.popt_nama}
                                </div>
                              </td>
                              <td>{item.kecamatan_nama}</td>
                              <td className="text-center">
                                <span className="badge bg-info rounded-pill">
                                  {item.total_ditugaskan}
                                </span>
                              </td>
                              <td className="text-center">
                                <span className="badge bg-success rounded-pill">
                                  {item.total_selesai}
                                </span>
                              </td>
                              <td className="text-center">
                                <span className="badge bg-primary rounded-pill">
                                  {item.total_verifikasi}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8}>
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
