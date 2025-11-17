//import react
import { useState, useEffect } from "react";

//import react router dom
import { Link, useNavigate, useParams } from "react-router-dom";

//import layout
import LayoutAdmin from "../../../layouts/Admin";

//import api
import Api from "../../../services/Api";

//import js cookie
import Cookies from "js-cookie";

//import toast
import toast from "react-hot-toast";
import DateID from "../../../utils/DateID";
import Loading from "../../../components/general/Loading";

export default function PengaduanTanamanDetail() {
  document.title = `Detail Pengaduan Tanaman - SIBalintan`;

  const { id } = useParams();
  const navigate = useNavigate();
  const [pengaduanTanaman, setPengaduanTanaman] = useState({});
  const [loadingPengaduanTanaman, setLoadingPengaduanTanaman] = useState(true);

  const [poptList, setPoptList] = useState([]);
  const [selectedPopt, setSelectedPopt] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [laporanFile, setLaporanFile] = useState(null);
  const [laporanKeterangan, setLaporanKeterangan] = useState("");

  //token from cookies
  const token = Cookies.get("token");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi tipe file (PDF)
      if (file.type !== "application/pdf") {
        toast.error("File harus berformat PDF", {
          position: "top-right",
          duration: 4000,
        });
        return;
      }

      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB", {
          position: "top-right",
          duration: 4000,
        });
        return;
      }

      setLaporanFile(file);
    }
  };

  const handleUploadLaporan = async () => {
    if (!laporanFile) {
      toast.error("Pilih file laporan terlebih dahulu", {
        position: "top-right",
        duration: 4000,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", laporanFile);

      await Api.post(
        `/api/admin/pengaduan-tanaman/${id}/upload-laporan`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Laporan berhasil diupload", {
        position: "top-right",
        duration: 4000,
      });

      setShowUploadModal(false);
      setLaporanFile(null);
      setLaporanKeterangan("");
      fetchDetail(); // Reload data
    } catch (error) {
      toast.error("Gagal mengupload laporan", {
        position: "top-right",
        duration: 4000,
      });
    }
  };

  const fetchDetail = async () => {
    setLoadingPengaduanTanaman(true);
    await Api.get(`/api/admin/pengaduan-tanaman/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setPengaduanTanaman(response.data.data.pengaduan);
      setLoadingPengaduanTanaman(false);
    });
  };

  const fetchPoptList = async () => {
    await Api.get("/api/admin/users/role/popt", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setPoptList(response.data.data.users || []);
    });
  };

  useEffect(() => {
    fetchDetail();
    fetchPoptList();
  }, [id]);

  const handleAssignPopt = async () => {
    await Api.post(
      "/api/admin/pengaduan-tanaman/assign",
      {
        pengaduanTanamanId: id,
        poptId: selectedPopt,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((response) => {
      toast.success(response.data.message, {
        position: "top-right",
        duration: 4000,
      });
      setShowAssignModal(false);
      fetchDetail();
    });
  };

  const handleUpdateStatus = async (newStatus) => {
    confirmAlert({
      title: "Update Status",
      message: `Apakah Anda yakin ingin mengubah status menjadi ${getStatusText(
        newStatus
      )}?`,
      buttons: [
        {
          label: "Ya",
          onClick: async () => {
            try {
              await Api.put(
                `/api/pengaduan-tanaman/${id}/status`,
                {
                  status: newStatus,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              toast.success("Status berhasil diperbarui", {
                position: "top-right",
                duration: 4000,
              });

              fetchDetail();
            } catch (error) {
              toast.error("Gagal memperbarui status", {
                position: "top-right",
                duration: 4000,
              });
            }
          },
        },
        {
          label: "Tidak",
          onClick: () => {},
        },
      ],
    });
  };

  const handleDelete = () => {
    confirmAlert({
      title: "Hapus Pengaduan",
      message: "Apakah Anda yakin ingin menghapus pengaduan ini?",
      buttons: [
        {
          label: "Ya",
          onClick: async () => {
            try {
              await Api.delete(`/api/admin/pengaduan-tanaman/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              toast.success("Pengaduan berhasil dihapus", {
                position: "top-right",
                duration: 4000,
              });

              navigate("/admin/pengaduan-tanaman");
            } catch (error) {
              toast.error("Gagal menghapus pengaduan", {
                position: "top-right",
                duration: 4000,
              });
            }
          },
        },
        {
          label: "Tidak",
          onClick: () => {},
        },
      ],
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: "bg-warning", text: "Pending" },
      assigned: { class: "bg-info", text: "Ditugaskan" },
      in_progress: { class: "bg-primary", text: "Diverifikasi" },
      completed: { class: "bg-success", text: "Selesai" },
      rejected: { class: "bg-danger", text: "Ditolak" },
    };

    const config = statusConfig[status] || {
      class: "bg-secondary",
      text: status,
    };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getStatusText = (status) => {
    const statusTexts = {
      pending: "Menunggu",
      assigned: "Ditugaskan",
      in_progress: "Diproses",
      completed: "Selesai",
      rejected: "Ditolak",
    };
    return statusTexts[status] || status;
  };

  return (
    <LayoutAdmin>
      <main>
        <div className="container-fluid mb-5 mt-5">
          <div className="row mb-4">
            <div className="col-md-12">
              <Link
                to="/admin/pengaduan-tanaman"
                className="btn btn-md btn-primary border-0 shadow-sm mb-3"
                type="button"
              >
                <i className="fa fa-long-arrow-alt-left me-2"></i> Kembali
              </Link>

              <div className="card border-0 rounded shadow-sm border-top-success">
                {loadingPengaduanTanaman ? (
                  <Loading />
                ) : (
                  <div className="card-body">
                    <h6>Detail Pengaduan Tanaman</h6>
                    <hr />
                    <div className="row">
                      <div className="col-md-6">
                        <table className="table">
                          <tbody>
                            <tr>
                              <td>Kelompok Tani</td>
                              <td>: {pengaduanTanaman.kelompokTani || "-"}</td>
                            </tr>
                            <tr>
                              <td>Nama pelapor</td>
                              <td>
                                : {pengaduanTanaman?.user?.namaLengkap || "-"}
                              </td>
                            </tr>
                            <tr>
                              <td>Lokasi</td>
                              <td>
                                :{" "}
                                {pengaduanTanaman.alamat &&
                                pengaduanTanaman.kecamatan &&
                                pengaduanTanaman.kabupaten
                                  ? `${pengaduanTanaman.alamat}, ${pengaduanTanaman.kecamatan}, ${pengaduanTanaman.kabupaten}`
                                  : "-"}
                              </td>
                            </tr>
                            <tr>
                              <td>Koordinat</td>
                              <td>
                                :{" "}
                                {pengaduanTanaman.latitude &&
                                pengaduanTanaman.longitude ? (
                                  <>
                                    {pengaduanTanaman.latitude},{" "}
                                    {pengaduanTanaman.longitude}
                                    <br />
                                    <a
                                      href={`https://www.google.com/maps?q=${pengaduanTanaman.latitude},${pengaduanTanaman.longitude}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn btn-sm btn-outline-success mt-2"
                                    >
                                      <i className="fa fa-map-pin me-1"></i>
                                      Lihat di Google Maps
                                    </a>
                                  </>
                                ) : (
                                  "-"
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="col-md-6">
                        <table className="table">
                          <tbody>
                            <tr>
                              <td>Status saat ini</td>
                              <td>
                                : {getStatusBadge(pengaduanTanaman.status)}
                              </td>
                            </tr>
                            <tr>
                              <td>Tanggal dibuat</td>
                              <td>
                                :{" "}
                                {pengaduanTanaman.createdAt
                                  ? DateID(new Date(pengaduanTanaman.createdAt))
                                  : "-"}
                              </td>
                            </tr>
                            <tr>
                              <td> Terakhir Diperbarui</td>
                              <td>
                                :{" "}
                                {pengaduanTanaman.updatedAt
                                  ? DateID(new Date(pengaduanTanaman.updatedAt))
                                  : "-"}
                              </td>
                            </tr>
                            <tr>
                              <td>Deskripsi Masalah Tanaman</td>
                              <td style={{ whiteSpace: "pre-wrap" }}>
                                : {pengaduanTanaman.deskripsi || "-"}
                              </td>
                            </tr>
                            <tr>
                              <td>Foto Tanaman</td>
                              <td>
                                :{" "}
                                {pengaduanTanaman.image ? (
                                  <>
                                    <br />
                                    <img
                                      src={pengaduanTanaman.image}
                                      alt="Foto Tanaman"
                                      className="img-fluid rounded mt-2"
                                      style={{
                                        maxHeight: "300px",
                                        objectFit: "contain",
                                      }}
                                    />
                                  </>
                                ) : (
                                  "-"
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>Nama Petugas POPT</td>
                              <td>
                                : {pengaduanTanaman?.popt?.namaLengkap || "-"}
                              </td>
                            </tr>
                            <tr>
                              <td>Tanggal Diverifikasi Petugas POPT</td>
                              <td>
                                :{" "}
                                {pengaduanTanaman.tanggalVerifikasi
                                  ? DateID(
                                      new Date(
                                        pengaduanTanaman.tanggalVerifikasi
                                      )
                                    )
                                  : "-"}
                              </td>
                            </tr>
                            {pengaduanTanaman.catatanPopt && (
                              <tr>
                                <td>Catatan Petugas POPT</td>
                                <td style={{ whiteSpace: "pre-wrap" }}>
                                  : {pengaduanTanaman.catatanPopt}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-12">
              <div className="card border-0 rounded shadow-sm border-top-success">
                <div className="card-body">
                  <h6>Aksi</h6>
                  <hr />
                  {/* Assign POPT */}
                  {pengaduanTanaman.status === "Pending" && (
                    <button
                      onClick={() => setShowAssignModal(true)}
                      className="btn btn-info w-100 mb-2"
                    >
                      <i className="fa fa-user-plus me-2"></i>
                      Tugaskan ke POPT
                    </button>
                  )}

                  {/* Update Status */}
                  <div className="dropdown mb-2">
                    <button
                      className="btn btn-primary w-100 dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <i className="fa fa-edit me-2"></i>
                      Update Status
                    </button>
                    <ul className="dropdown-menu w-100">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleUpdateStatus("assigned")}
                        >
                          Ditugaskan
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleUpdateStatus("in_progress")}
                        >
                          Diproses
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleUpdateStatus("completed")}
                        >
                          Selesai
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleUpdateStatus("rejected")}
                        >
                          Ditolak
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Upload Hasil Laporan - Tampil jika status completed */}
          {pengaduanTanaman.status === "Diverifikasi" && (
            <div className="row">
              <div className="col-md-12">
                <div className="card border-0 rounded shadow-sm">
                  <div className="card-header bg-success text-white">
                    <h6 className="mb-0">
                      <i className="fa fa-file-upload me-2"></i>
                      Hasil Laporan Tanaman
                    </h6>
                  </div>
                  <div className="card-body">
                    {pengaduanTanaman.file ? (
                      <div>
                        <div className="alert alert-success">
                          <i className="fa fa-check-circle me-2"></i>
                          Laporan sudah diupload
                        </div>
                        <div className="mb-3">
                          <label className="text-muted small">
                            File Laporan
                          </label>
                          <div className="d-flex align-items-center gap-2 mt-2">
                            <i
                              className="fa fa-file-pdf text-danger"
                              style={{ fontSize: "2rem" }}
                            ></i>
                            <div>
                              <p className="mb-0 fw-bold">Laporan Pengaduan</p>
                              <a
                                href={pengaduanTanaman.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-primary mt-1"
                              >
                                <i className="fa fa-download me-1"></i>
                                Download Laporan
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="alert alert-warning">
                          <i className="fa fa-exclamation-triangle me-2"></i>
                          Belum ada laporan yang diupload
                        </div>
                        <button
                          onClick={() => setShowUploadModal(true)}
                          className="btn btn-success w-100"
                        >
                          <i className="fa fa-upload me-2"></i>
                          Upload Hasil Laporan
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {showAssignModal && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Tugaskan ke POPT</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAssignModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <label className="form-label">Pilih Petugas POPT</label>
                  <select
                    className="form-select"
                    value={selectedPopt}
                    onChange={(e) => setSelectedPopt(e.target.value)}
                  >
                    <option value="">-- Pilih POPT --</option>
                    {poptList.map((popt) => (
                      <option key={popt.id} value={popt.id}>
                        {popt.namaLengkap} ({popt.username})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAssignModal(false)}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAssignPopt}
                  >
                    Tugaskan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showUploadModal && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">
                    <i className="fa fa-file-upload me-2"></i>
                    Upload Hasil Laporan
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => {
                      setShowUploadModal(false);
                      setLaporanFile(null);
                      setLaporanKeterangan("");
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">
                      File Laporan <span className="text-danger">*</span>
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                    <small className="text-muted">
                      Format: PDF, Maksimal 5MB
                    </small>
                    {laporanFile && (
                      <div className="alert alert-info mt-2 mb-0">
                        <i className="fa fa-file-pdf me-2"></i>
                        {laporanFile.name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowUploadModal(false);
                      setLaporanFile(null);
                      setLaporanKeterangan("");
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleUploadLaporan}
                    disabled={!laporanFile}
                  >
                    <i className="fa fa-upload me-2"></i>
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </LayoutAdmin>
  );
}
