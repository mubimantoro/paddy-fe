//import react
import { useState, useEffect } from "react";

//import react router dom
import { Link, useNavigate } from "react-router-dom";

//import layout
import LayoutAdmin from "../../../layouts/Admin";

//import api
import Api from "../../../services/Api";

//import js cookie
import Cookies from "js-cookie";

//import toast
import toast from "react-hot-toast";

export default function UsersCreate() {
  document.title = "Tambah User - SIBalintan";

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [nomorHp, setNomorHp] = useState("");
  const [kelompokTaniId, setKelompokTaniId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [errors, setErrors] = useState({});

  const [kelompokTani, setKelompokTani] = useState([]);
  const [roles, setRoles] = useState([]);

  const token = Cookies.get("token");

  const fetchDataKelompokTani = async () => {
    await Api.get("/api/kelompok-tani", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setKelompokTani(response.data.data);
    });
  };

  const fetchDataRoles = async () => {
    await Api.get("/api/roles", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setRoles(response.data.data);
    });
  };

  useEffect(() => {
    fetchDataKelompokTani();
    fetchDataRoles();
  }, []);

  const storeUser = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("nama_lengkap", namaLengkap);
    formData.append("nomor_hp", nomorHp);
    formData.append("kelompok_tani_id", kelompokTaniId);
    formData.append("role_id", roleId);

    await Api.post("/api/users", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        toast.success(response.data.message, {
          position: "top-right",
          duration: 4000,
        });

        navigate("/admin/users");
      })
      .catch((error) => {
        const { message } = error.response.data;
        const errorMessages = {};

        if (message.toLowerCase().includes("username")) {
          errorMessages.username = message;
        }
        if (message.toLowerCase().includes("password")) {
          errorMessages.password = message;
        }
        if (message.toLowerCase().includes("nama_lengkap")) {
          errorMessages.namaLengkap = message;
        }
        if (message.toLowerCase().includes("nomor_hp")) {
          errorMessages.nomorHp = message;
        }
        if (message.toLowerCase().includes("kelompok_tani")) {
          errorMessages.kelompokTaniId = message;
        }
        if (message.toLowerCase().includes("role")) {
          errorMessages.roleId = message;
        }

        setErrors(errorMessages);
      });
  };

  return (
    <LayoutAdmin>
      <main>
        <div className="container-fluid mb-5 mt-5">
          <div className="row">
            <div className="col-md-12">
              <Link
                to="/admin/users"
                className="btn btn-md btn-primary border-0 shadow-sm mb-3"
                type="button"
              >
                <i className="fa fa-long-arrow-alt-left me-2"></i> Kembali
              </Link>
              <div className="card border-0 rounded shadow-sm border-top-success">
                <div className="card-body">
                  <h6>
                    <i className="fa fa-user"></i> Tambah User
                  </h6>
                  <hr />
                  <form onSubmit={storeUser}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                      />
                    </div>
                    {errors.username && (
                      <div className="alert alert-danger">
                        {errors.username}
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="form-label fw-bold">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                      />
                    </div>
                    {errors.password && (
                      <div className="alert alert-danger">
                        {errors.password}
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="form-label fw-bold">Nama Lengkap</label>
                      <input
                        type="text"
                        className="form-control"
                        value={namaLengkap}
                        onChange={(e) => setNamaLengkap(e.target.value)}
                        placeholder="Nama Lengkap"
                      />
                    </div>
                    {errors.namaLengkap && (
                      <div className="alert alert-danger">
                        {errors.namaLengkap}
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="form-label fw-bold">Nomor HP</label>
                      <input
                        type="text"
                        className="form-control"
                        value={nomorHp}
                        onChange={(e) => setNomorHp(e.target.value)}
                        placeholder="081234567890"
                      />
                    </div>
                    {errors.nomorHp && (
                      <div className="alert alert-danger">{errors.nomorHp}</div>
                    )}

                    <div className="mb-3">
                      <label className="form-label fw-bold">Role</label>
                      <select
                        className="form-select"
                        value={roleId}
                        onChange={(e) => setRoleId(e.target.value)}
                      >
                        <option value="">-- Pilih Role --</option>
                        {roles.map((item) => (
                          <option value={item.id} key={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.roleId && (
                      <div className="alert alert-danger">{errors.roleId}</div>
                    )}

                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Kelompok Tani{" "}
                        <small className="text-muted">(Opsional)</small>
                      </label>
                      <select
                        className="form-select"
                        value={kelompokTaniId}
                        onChange={(e) => setKelompokTaniId(e.target.value)}
                      >
                        <option value="">-- Pilih Kelompok Tani --</option>
                        {kelompokTani.map((item) => (
                          <option value={item.id} key={item.id}>
                            {item.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.kelompokTaniId && (
                      <div className="alert alert-danger">
                        {errors.kelompokTaniId}
                      </div>
                    )}

                    <div>
                      <button
                        type="submit"
                        className="btn btn-md btn-primary me-2"
                      >
                        <i className="fa fa-save"></i> Simpan
                      </button>
                      <button type="reset" className="btn btn-md btn-warning">
                        <i className="fa fa-redo"></i> Reset
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
