import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../../../services/Api";
import LayoutAdmin from "../../../layouts/Admin";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function KelompokTaniCreate() {
  //title page
  document.title = "Tambah Kelompok Tani - Admin";

  //navigate
  const navigate = useNavigate();

  //define state
  const [nama, setNama] = useState("");

  //define state errors
  const [errors, setErrors] = useState({});

  //define state loading
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("token");

  //method createKelompokTani
  const createKelompokTani = async (e) => {
    e.preventDefault();

    await Api.post(
      "/api/kelompok-tani",
      {
        //data
        nama: nama,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((response) => {
        //show toast
        toast.success(response.data.message, {
          position: "top-right",
          duration: 4000,
        });
        navigate("/admin/kelompok-tani");
      })
      .catch((error) => {
        setErrors(error.response.data);
      });
  };

  return (
    <LayoutAdmin>
      <main>
        <div className="container-fluid mb-5 mt-5">
          <div className="row">
            <div className="col-md-12">
              <Link
                to="/admin/kelompok-tani"
                className="btn btn-md btn-primary border-0 shadow-sm mb-3"
                type="button"
              >
                <i className="fa fa-long-arrow-alt-left me-2"></i> Kembali
              </Link>
              <div className="card border-0 rounded shadow-sm border-top-success">
                <div className="card-body">
                  {errors.message && (
                    <div className="alert alert-danger">{errors.message}</div>
                  )}
                  <h6>Tambah Kelompok Tani</h6>
                  <hr />
                  <form onSubmit={createKelompokTani}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Nama Kelompok Tani{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        placeholder="Masukkan nama kelompok tani"
                      />
                    </div>
                    {errors.nama && (
                      <div className="alert alert-danger">{errors.nama[0]}</div>
                    )}
                    <div>
                      <button
                        type="submit"
                        className="btn btn-md btn-primary me-2"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Menyimpan...
                          </>
                        ) : (
                          <>
                            <i className="fa fa-save"></i> Simpan
                          </>
                        )}
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
