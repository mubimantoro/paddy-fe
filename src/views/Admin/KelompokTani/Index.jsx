import { useEffect, useState } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import Cookies from "js-cookie";
import Api from "../../../services/Api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function KelompokTaniIndex() {
  document.title = "Kelompok Tani - Admin";

  const [kelompokTani, setKelompokTani] = useState([]);
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);

  const token = Cookies.get("token");

  const fetchData = async () => {
    await Api.get("/api/kelompok-tani", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setKelompokTani(response.data.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteKelompokTani = (id, nama) => {
    confirmAlert({
      title: "Hapus Data",
      message: `Apakah Anda yakin ingin menghapus "${nama}" ?`,
      buttons: [
        {
          label: "Ya",
          onClick: async () => {
            await Api.delete(`/api/kelompok-tani/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }).then((response) => {
              toast.success(response.data.message, {
                position: "top-right",
                duration: 4000,
              });

              fetchData();
            });
          },
        },
        {
          label: "Tidak",
          onClick: () => {},
        },
      ],
    });
  };

  const handleImport = async (e) => {
    e.preventDefault();

    if (!importFile) {
      toast.error("Pilih file terlebih dahulu", {
        position: "top-right",
        duration: 4000,
      });
      return;
    }

    setImporting(true);

    const formData = new FormData();
    formData.append("file", importFile);

    await Api.post("/api/kelompok-tani/import", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        const { imported, skipped, failed } = response.data.data;

        toast.success(
          `Import selesai! Berhasil: ${imported}, Dilewati: ${skipped}, Gagal: ${failed}`,
          {
            position: "top-right",
            duration: 5000,
          },
        );

        setImportFile(null);
        document.getElementById("importFileInput").value = "";

        // Close modal
        const modalElement = document.getElementById("importModal");
        const modal = window.bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();

        fetchData();
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Gagal import data", {
          position: "top-right",
          duration: 4000,
        });
      })
      .finally(() => {
        setImporting(false);
      });
  };

  const handleDownloadTemplate = async (format) => {
    await Api.get(`/api/kelompok-tani/template/download?format=${format}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `template_kelompok_tani.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();

        toast.success("Template berhasil didownload", {
          position: "top-right",
          duration: 4000,
        });
      })
      .catch(() => {
        toast.error("Gagal download template", {
          position: "top-right",
          duration: 4000,
        });
      });
  };

  return (
    <LayoutAdmin>
      <main>
        <div className="container-fluid mb-5 mt-5">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-3 col-12 mb-2">
                  <Link
                    to="/admin/kelompok-tani/create"
                    className="btn btn-md btn-primary border-0 shadow-sm w-100"
                    type="button"
                  >
                    <i className="fa fa-plus-circle"></i> Tambah Data
                  </Link>
                </div>
                <div className="col-md-3 col-12 mb-2">
                  <button
                    className="btn btn-md btn-secondary border-0 shadow-sm w-100"
                    data-bs-toggle="modal"
                    data-bs-target="#importModal"
                  >
                    <i className="fa fa-upload"></i> Import Excel/CSV
                  </button>
                </div>
                <div className="col-md-3 col-12 mb-2">
                  <div className="dropdown w-100">
                    <button
                      className="btn btn-md btn-secondary border-0 shadow-sm dropdown-toggle w-100"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <i className="fa fa-download"></i> Download Template
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDownloadTemplate("xlsx");
                          }}
                        >
                          Excel (.xlsx)
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDownloadTemplate("csv");
                          }}
                        >
                          CSV (.csv)
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-1">
            <div className="col-md-12">
              <div className="card border-0 rounded shadow-sm border-top-success">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered table-centered mb-0 rounded">
                      <thead className="thead-dark">
                        <tr className="border-0">
                          <th className="border-0" style={{ width: "5%" }}>
                            No.
                          </th>
                          <th className="border-0">Nama Kelompok Tani</th>
                          <th className="border-0" style={{ width: "15%" }}>
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {kelompokTani.length > 0 ? (
                          kelompokTani.map((item, index) => (
                            <tr key={index}>
                              <td className="fw-bold text-center">
                                {index + 1}
                              </td>
                              <td>{item.nama}</td>
                              <td className="text-center">
                                <Link
                                  to={`/admin/kelompok-tani/edit/${item.id}`}
                                  className="btn btn-primary btn-sm me-2"
                                >
                                  <i className="fa fa-pencil-alt"></i>
                                </Link>

                                <button
                                  onClick={() =>
                                    deleteKelompokTani(item.id, item.nama)
                                  }
                                  className="btn btn-danger btn-sm"
                                >
                                  <i className="fa fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3}>
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

        {/* Import Modal */}
        <div
          className="modal fade"
          id="importModal"
          tabIndex="-1"
          aria-labelledby="importModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="importModalLabel">
                  Import Kelompok Tani
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleImport}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Pilih File Excel/CSV</label>
                    <input
                      id="importFileInput"
                      type="file"
                      className="form-control"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => setImportFile(e.target.files[0])}
                      required
                    />
                    <small className="text-muted">
                      Format: .xlsx, .xls, atau .csv (Max 10MB)
                    </small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    disabled={importing}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={importing}
                  >
                    {importing ? "Importing..." : "Import"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </LayoutAdmin>
  );
}
