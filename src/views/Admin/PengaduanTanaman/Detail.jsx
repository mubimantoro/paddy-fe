import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LayoutAdmin from "../../../layouts/Admin";
import Api from "../../../services/Api";
import Cookies from "js-cookie";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";
import DateID from "../../../utils/DateID";
import Loading from "../../../components/general/Loading";
export default function PengaduanTanamanDetail() {
  document.title = "Detail Pengaduan Tanaman - SIBalintan";

  const { id } = useParams();

  const [pengaduan, setPengaduan] = useState(null);
  const [verifikasi, setVerifikasi] = useState([]);
  const [pemeriksaan, setPemeriksaan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPemeriksaanModal, setShowPemeriksaanModal] = useState(false);

  const [hasilPemeriksaan, setHasilPemeriksaan] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const token = Cookies.get("token");

  const fetchPengaduanDetail = async () => {
    try {
      const response = await Api.get(`/api/pengaduan-tanaman/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPengaduan(response.data.data.pengaduanTanaman);
      setVerifikasi(response.data.data.verifikasiPengaduanTanaman || []);
      setPemeriksaan(response.data.data.pemeriksaanPengaduanTanaman || []);
      setLoading(false);
    } catch (error) {
      toast.error("Gagal mengambil detail pengaduan");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPengaduanDetail();
  }, []);

  const handleSubmitPemeriksaan = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!hasilPemeriksaan) {
      setErrors({ hasilPemeriksaan: "Hasil pemeriksaan harus diisi" });
      return;
    }

    if (!file) {
      setErrors({ file: "Dokumen pemeriksaan harus diupload" });
      return;
    }

    const formData = new FormData();
    formData.append("hasil_pemeriksaan", hasilPemeriksaan);
    formData.append("file", file);

    try {
      const response = await Api.post(
        `/api/admin/pengaduan-tanaman/${id}/pemeriksaan`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success(response.data.message, {
        position: "top-right",
        duration: 4000,
      });

      setShowPemeriksaanModal(false);
      setHasilPemeriksaan("");
      setFile(null);
      fetchPengaduanDetail();
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Gagal menambahkan pemeriksaan");
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="badge bg-warning text-dark">Pending</span>;
      case "ditugaskan":
        return <span className="badge bg-info">Ditugaskan</span>;
      case "dalam proses":
        return <span className="badge bg-primary">Dalam Proses</span>;
      case "diverifikasi":
        return <span className="badge bg-success">Diverifikasi</span>;
      case "selesai":
        return <span className="badge bg-success">Selesai</span>;
      case "ditolak":
        return <span className="badge bg-danger">Ditolak</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const canUploadPemeriksaan = () => {
    return pengaduan?.status === "diverifikasi";
  };

  if (loading) {
    return (
      <LayoutAdmin>
        <main>
          <div className="container-fluid mb-5 mt-5">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Memuat data...</p>
            </div>
          </div>
        </main>
      </LayoutAdmin>
    );
  }

  if (!pengaduan) {
    return (
      <LayoutAdmin>
        <main>
          <div className="container-fluid mb-5 mt-5">
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Data pengaduan tidak ditemukan
            </div>
            <Link to="/admin/pengaduan-tanaman" className="btn btn-primary">
              <i className="fa fa-arrow-left me-2"></i>
              Kembali
            </Link>
          </div>
        </main>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin>
      <main>
        <div className="container-fluid mb-5 mt-5">
          <div className="row">
            <div className="col-md-12">
              <Link
                to="/admin/pengaduan-tanaman"
                className="btn btn-md btn-primary border-0 shadow-sm mb-3"
              >
                <i className="fa fa-long-arrow-alt-left me-2"></i> Kembali
              </Link>

              {/* Header Info */}
              <div className="card border-0 rounded shadow-sm mb-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <h5>
                        <i className="fas fa-file-alt me-2"></i>
                        Detail Pengaduan Tanaman
                      </h5>
                      <hr />
                      <div className="row">
                        <div className="col-md-6">
                          <table className="table table-borderless table-sm">
                            <tbody>
                              <tr>
                                <td width="180" className="fw-bold">
                                  Status
                                </td>
                                <td>{getStatusBadge(pengaduan.status)}</td>
                              </tr>
                              <tr>
                                <td className="fw-bold">Tanggal Pengaduan</td>
                                <td>
                                  {new Date(
                                    pengaduan.created_at,
                                  ).toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </td>
                              </tr>
                              <tr>
                                <td className="fw-bold">Nama Pelapor</td>
                                <td>{pengaduan.pelapor_nama}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="col-md-6">
                          <table className="table table-borderless table-sm">
                            <tbody>
                              <tr>
                                <td width="180" className="fw-bold">
                                  Kelompok Tani
                                </td>
                                <td>{pengaduan.kelompok_tani_nama}</td>
                              </tr>
                              <tr>
                                <td className="fw-bold">Kecamatan</td>
                                <td>{pengaduan.kecamatan_nama}</td>
                              </tr>
                              <tr>
                                <td className="fw-bold">Petugas POPT</td>
                                <td>
                                  {pengaduan.popt_nama ? (
                                    <span className="badge bg-info">
                                      {pengaduan.popt_nama}
                                    </span>
                                  ) : (
                                    <span className="text-muted">
                                      Belum ditugaskan
                                    </span>
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="d-flex flex-column gap-2">
                        {canUploadPemeriksaan() && pemeriksaan.length === 0 && (
                          <button
                            className="btn btn-success"
                            onClick={() => setShowPemeriksaanModal(true)}
                          >
                            <i className="fas fa-upload me-2"></i>
                            Upload Hasil Pemeriksaan
                          </button>
                        )}

                        {pengaduan.status === "selesai" && (
                          <div className="alert alert-success mb-0">
                            <i className="fas fa-check-circle me-2"></i>
                            Pengaduan telah selesai diproses
                          </div>
                        )}

                        {pengaduan.status !== "diverifikasi" &&
                          pengaduan.status !== "selesai" && (
                            <div className="alert alert-info mb-0">
                              <i className="fas fa-info-circle me-2"></i>
                              Menunggu verifikasi dari POPT
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="row">
                <div className="col-md-8">
                  {/* Deskripsi Pengaduan */}
                  <div className="card border-0 rounded shadow-sm mb-4">
                    <div className="card-header bg-white">
                      <h6 className="mb-0">
                        <i className="fas fa-align-left me-2"></i>
                        Deskripsi Pengaduan
                      </h6>
                    </div>
                    <div className="card-body">
                      <p style={{ whiteSpace: "pre-wrap" }} className="mb-0">
                        {pengaduan.deskripsi}
                      </p>
                    </div>
                  </div>

                  {/* Verifikasi POPT */}
                  {verifikasi.length > 0 && (
                    <div className="card border-0 rounded shadow-sm mb-4">
                      <div className="card-header bg-white">
                        <h6 className="mb-0">
                          <i className="fas fa-check-double me-2"></i>
                          Verifikasi POPT
                        </h6>
                      </div>
                      <div className="card-body">
                        {verifikasi.map((item, index) => (
                          <div key={index} className="mb-3 pb-3 border-bottom">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <strong className="text-primary">
                                  {item.popt_nama}
                                </strong>
                                <br />
                                <small className="text-muted">
                                  {new Date(item.created_at).toLocaleString(
                                    "id-ID",
                                  )}
                                </small>
                              </div>
                            </div>

                            <p className="mb-2">
                              <strong>Catatan:</strong>
                              <br />
                              {item.catatan}
                            </p>

                            {item.foto_visit && (
                              <div className="mb-2">
                                <strong>Foto Kunjungan:</strong>
                                <br />
                                <img
                                  src={item.foto_visit}
                                  alt="Foto Verifikasi"
                                  className="img-fluid rounded mt-2"
                                  style={{ maxHeight: "300px" }}
                                />
                              </div>
                            )}

                            {item.latitude && item.longitude && (
                              <div>
                                <strong>Lokasi Verifikasi:</strong>
                                <br />
                                <small className="text-muted">
                                  Lat: {item.latitude}, Long: {item.longitude}
                                </small>
                                <br />
                                <a
                                  href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-primary mt-1"
                                >
                                  <i className="fas fa-map-marker-alt me-1"></i>
                                  Lihat di Maps
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hasil Pemeriksaan Admin */}
                  {pemeriksaan.length > 0 && (
                    <div className="card border-0 rounded shadow-sm mb-4">
                      <div className="card-header bg-white">
                        <h6 className="mb-0">
                          <i className="fas fa-clipboard-check me-2"></i>
                          Hasil Pemeriksaan
                        </h6>
                      </div>
                      <div className="card-body">
                        {pemeriksaan.map((item, index) => (
                          <div key={index} className="mb-3 pb-3 border-bottom">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <strong className="text-success">
                                  {item.pemeriksa_nama}
                                </strong>
                                <br />
                                <small className="text-muted">
                                  {new Date(item.created_at).toLocaleString(
                                    "id-ID",
                                  )}
                                </small>
                              </div>
                              <span className="badge bg-success">
                                {item.hasil_pemeriksaan}
                              </span>
                            </div>

                            {item.file && (
                              <a
                                href={item.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-primary"
                              >
                                <i className="fas fa-download me-1"></i>
                                Download Dokumen
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-md-4">
                  {/* Foto Pengaduan */}
                  <div className="card border-0 rounded shadow-sm mb-4">
                    <div className="card-header bg-white">
                      <h6 className="mb-0">
                        <i className="fas fa-image me-2"></i>
                        Foto Pengaduan
                      </h6>
                    </div>
                    <div className="card-body">
                      {pengaduan.image ? (
                        <img
                          src={pengaduan.image}
                          alt="Foto Pengaduan"
                          className="img-fluid rounded"
                        />
                      ) : (
                        <div className="alert alert-secondary mb-0">
                          <i className="fas fa-image me-2"></i>
                          Tidak ada foto
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lokasi Pengaduan */}
                  <div className="card border-0 rounded shadow-sm mb-4">
                    <div className="card-header bg-white">
                      <h6 className="mb-0">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        Lokasi Pengaduan
                      </h6>
                    </div>
                    <div className="card-body">
                      {pengaduan.latitude && pengaduan.longitude ? (
                        <>
                          <p className="mb-2">
                            <strong>Koordinat:</strong>
                            <br />
                            <small className="text-muted">
                              Lat: {pengaduan.latitude}
                              <br />
                              Long: {pengaduan.longitude}
                            </small>
                          </p>
                          <a
                            href={`https://www.google.com/maps?q=${pengaduan.latitude},${pengaduan.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-primary w-100"
                          >
                            <i className="fas fa-map me-1"></i>
                            Buka di Google Maps
                          </a>
                        </>
                      ) : (
                        <div className="alert alert-secondary mb-0">
                          <i className="fas fa-map-marker-alt me-2"></i>
                          Lokasi tidak tersedia
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Upload Pemeriksaan */}
        {showPemeriksaanModal && (
          <>
            <div
              className="modal-backdrop fade show"
              onClick={() => setShowPemeriksaanModal(false)}
            ></div>
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              style={{ paddingRight: "17px" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      <i className="fas fa-upload me-2"></i>
                      Upload Hasil Pemeriksaan
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowPemeriksaanModal(false)}
                    ></button>
                  </div>
                  <form onSubmit={handleSubmitPemeriksaan}>
                    <div className="modal-body">
                      <div className="alert alert-info">
                        <i className="fas fa-info-circle me-2"></i>
                        Status pengaduan akan otomatis berubah menjadi{" "}
                        <strong>"Selesai"</strong> setelah upload pemeriksaan.
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold">
                          Hasil Pemeriksaan{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={hasilPemeriksaan}
                          onChange={(e) => setHasilPemeriksaan(e.target.value)}
                          placeholder="Contoh: Terverifikasi positif hama wereng"
                        />
                        {errors.hasilPemeriksaan && (
                          <div className="alert alert-danger mt-2">
                            {errors.hasilPemeriksaan}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold">
                          Dokumen Pemeriksaan{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                        <small className="text-muted">
                          Format: PDF, DOC, DOCX (Max: 5MB)
                        </small>
                        {errors.file && (
                          <div className="alert alert-danger mt-2">
                            {errors.file}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowPemeriksaanModal(false)}
                      >
                        Batal
                      </button>
                      <button type="submit" className="btn btn-success">
                        <i className="fa fa-upload me-2"></i>
                        Upload Pemeriksaan
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </LayoutAdmin>
  );
}
