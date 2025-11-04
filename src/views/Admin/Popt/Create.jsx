import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import LayoutAdmin from "../../../layouts/Admin";
import Api from "../../../services/Api";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function PoptCreate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [userId, setUserId] = useState(searchParams.get("userId") || "");
  const [nip, setNip] = useState("");
  const [wilayahId, setWilayahId] = useState("");
  const [kecamatanIds, setKecamatanIds] = useState([]);

  const [users, setUsers] = useState([]);
  const [wilayah, setWilayah] = useState([]);
  const [kecamatan, setKecamatan] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const token = Cookies.get("token");

  const fetchUsers = async () => {
    await Api.get("/api/admin/users/role/popt", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setUsers(response.data.data.users);
    });
  };

  // Fetch wilayah
  const fetchWilayah = async () => {
    await Api.get("/api/wilayah", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setWilayah(response.data.data);
    });
  };

  // Fetch kecamatan berdasarkan wilayah
  const fetchKecamatan = async (wilayahId) => {
    await Api.get(`/api/kecamatan/wilayah/${wilayahId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setKecamatan(response.data.data);
    });
  };

  useEffect(() => {
    fetchUsers();
    fetchWilayah();
  }, []);

  // Ketika wilayah berubah, fetch kecamatan
  useEffect(() => {
    if (wilayahId) {
      fetchKecamatan(wilayahId);
      setKecamatanIds([]); // Reset kecamatan yang dipilih
    } else {
      setKecamatan([]);
      setKecamatanIds([]);
    }
  }, [wilayahId]);

  // Handle user selection
  const handleUserChange = (e) => {
    const selectedId = e.target.value;
    setUserId(selectedId);

    const user = users.find((u) => u.id === parseInt(selectedId));
    setSelectedUser(user);
  };

  // Handle kecamatan checkbox
  const handleKecamatanChange = (kecamatanId) => {
    setKecamatanIds((prev) => {
      if (prev.includes(kecamatanId)) {
        return prev.filter((id) => id !== kecamatanId);
      } else {
        return [...prev, kecamatanId];
      }
    });
  };

  // Handle select all kecamatan
  const handleSelectAllKecamatan = (e) => {
    if (e.target.checked) {
      setKecamatanIds(kecamatan.map((k) => k.id));
    } else {
      setKecamatanIds([]);
    }
  };

  const storePopt = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("nip", nip);
    formData.append("wilayahId", wilayahId);
    formData.append("kecamatanIds[]", kecamatanIds);

    await Api.post("/api/admin/popt", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      toast.success(response.data.message, {
        position: "top-right",
        duration: 4000,
      });

      navigate("/admin/popt");
    });

    try {
      const response = await Api.post("/api/admin/popt", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success(response.data.message, {
        position: "top-right",
        duration: 4000,
      });

      navigate("/admin/popt");
    } catch (error) {
      const errorMessages = {};
      if (message.toLowerCase().includes("nip")) {
        errorMessages.nip = message;
      } else if (message.toLowerCase().includes("user")) {
        errorMessages.userId = message;
      } else {
        toast.error(message);
      }

      setErrors(errorMessages);
    }
  };

  return (
    <LayoutAdmin>
      <main>
        <div className="container-fluid mb-5 mt-5">
          <div className="row">
            <div className="col-md-12">
              <Link
                to="/admin/popt"
                className="btn btn-md btn-primary border-0 shadow-sm mb-3"
                type="button"
              >
                <i className="fa fa-long-arrow-alt-left me-2"></i> Kembali
              </Link>
              <div className="card border-0 rounded shadow-sm border-top-success">
                <div className="card-body">
                  <h6>
                    <i className="fa fa-user-plus me-2"></i>
                    Tambah Petugas POPT
                  </h6>
                  <hr />
                  <form onSubmit={storePopt}>
                    {/* Pilih User */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Pilih User <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-select ${
                          errors.userId ? "is-invalid" : ""
                        }`}
                        value={userId}
                        onChange={handleUserChange}
                        disabled={searchParams.get("userId")}
                      >
                        <option value="">-- Pilih User --</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.namaLengkap} (@{user.username})
                          </option>
                        ))}
                      </select>
                      {errors.userId && (
                        <div className="invalid-feedback d-block">
                          {errors.userId}
                        </div>
                      )}
                    </div>

                    {/* Info User yang dipilih */}
                    {selectedUser && (
                      <div className="alert alert-info mb-3">
                        <strong>Informasi User:</strong>
                        <ul className="mb-0 mt-2">
                          <li>Nama: {selectedUser.namaLengkap}</li>
                          <li>Username: {selectedUser.username}</li>
                          <li>No. HP: {selectedUser.nomorHp || "-"}</li>
                        </ul>
                      </div>
                    )}

                    {/* NIP */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        NIP <small className="text-muted">(Opsional)</small>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.nip ? "is-invalid" : ""
                        }`}
                        value={nip}
                        onChange={(e) => setNip(e.target.value)}
                        placeholder="Masukkan NIP"
                        maxLength={50}
                      />
                      {errors.nip && (
                        <div className="invalid-feedback d-block">
                          {errors.nip}
                        </div>
                      )}
                    </div>

                    {/* Pilih Wilayah */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Wilayah <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-select ${
                          errors.wilayahId ? "is-invalid" : ""
                        }`}
                        value={wilayahId}
                        onChange={(e) => setWilayahId(e.target.value)}
                      >
                        <option value="">-- Pilih Wilayah --</option>
                        {wilayah.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.nama} {item.kode ? `(${item.kode})` : ""}
                          </option>
                        ))}
                      </select>
                      {errors.wilayahId && (
                        <div className="invalid-feedback d-block">
                          {errors.wilayahId}
                        </div>
                      )}
                    </div>

                    {/* Pilih Kecamatan */}
                    {wilayahId && kecamatan.length > 0 && (
                      <div className="mb-3">
                        <label className="form-label fw-bold">
                          Kecamatan{" "}
                          <small className="text-muted">
                            (Pilih satu atau lebih)
                          </small>
                        </label>
                        <div className="card">
                          <div
                            className="card-body"
                            style={{ maxHeight: "300px", overflowY: "auto" }}
                          >
                            <div className="form-check mb-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="selectAll"
                                checked={
                                  kecamatanIds.length === kecamatan.length &&
                                  kecamatan.length > 0
                                }
                                onChange={handleSelectAllKecamatan}
                              />
                              <label
                                className="form-check-label fw-bold"
                                htmlFor="selectAll"
                              >
                                Pilih Semua
                              </label>
                            </div>
                            <hr />
                            {kecamatan.map((item) => (
                              <div key={item.id} className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`kecamatan-${item.id}`}
                                  checked={kecamatanIds.includes(item.id)}
                                  onChange={() =>
                                    handleKecamatanChange(item.id)
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor={`kecamatan-${item.id}`}
                                >
                                  {item.nama}{" "}
                                  {item.kode ? `(${item.kode})` : ""}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <small className="text-muted">
                          {kecamatanIds.length} kecamatan dipilih
                        </small>
                      </div>
                    )}

                    {wilayahId && kecamatan.length === 0 && (
                      <div className="alert alert-warning">
                        Tidak ada kecamatan di wilayah ini
                      </div>
                    )}

                    <div className="mt-4">
                      <button
                        type="submit"
                        className="btn btn-md btn-primary me-2"
                      >
                        <i className="fa fa-save me-2"></i>
                        Simpan
                      </button>
                      <button type="reset" className="btn btn-md btn-warning">
                        <i className="fa fa-redo me-2"></i>
                        Reset
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </LayoutAdmin>
  );
}
