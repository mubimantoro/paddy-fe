import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import LayoutAdmin from "../../../layouts/Admin";
import Api from "../../../services/Api";

export default function LaporanKinerjaPOPT() {
  document.title = "Laporan Kinerja POPT - SIBalintan";

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [laporanKinerja, setLaporanKinerja] = useState([]);

  const token = Cookies.get("token");

  const fetchLaporanKinerja = async () => {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    await Api.get(`/api/reports/popt/kinerja?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setLaporanKinerja(response.data.data || []);
    });
  };

  useEffect(() => {
    fetchLaporanKinerja();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchLaporanKinerja();
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setTimeout(() => {
      fetchLaporanKinerja();
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

              {/* Laporan Kinerja POPT */}
              <div className="card border-0 rounded shadow-sm mb-4">
                <div className="card-header bg-white">
                  <h6>
                    <i className="fas fa-chart-bar me-2"></i>Laporan Kinerja
                    POPT
                  </h6>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered table-centered mb-0 rounded">
                      <thead className="thead-dark">
                        <tr className="border-0">
                          <th className="border-0">No.</th>
                          <th className="border-0">Nama POPT</th>
                          <th className="border-0">Kecamatan</th>
                          <th className="border-0">Total Ditugaskan</th>
                          <th className="border-0">Dalam Proses</th>
                          <th className="border-0">Selesai</th>
                          <th className="border-0">Persentase Selesai</th>
                        </tr>
                      </thead>
                      <tbody>
                        {laporanKinerja.length > 0 ? (
                          laporanKinerja.map((item, index) => (
                            <tr key={index}>
                              <td className="fw-bold text-center">
                                {index + 1}
                              </td>
                              <td>{item.nama_popt}</td>
                              <td>{item.kecamatan_nama}</td>
                              <td>{item.total_ditugaskan}</td>
                              <td>{item.dalam_proses}</td>
                              <td>{item.selesai}</td>
                              <td>
                                <span
                                  className={`badge ${
                                    parseFloat(item.persentase_selesai) >= 80
                                      ? "bg-success"
                                      : parseFloat(item.persentase_selesai) >=
                                          50
                                        ? "bg-warning"
                                        : "bg-danger"
                                  }`}
                                >
                                  {item.persentase_selesai}%
                                </span>
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
