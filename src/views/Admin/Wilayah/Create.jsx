//import react
import { useState } from "react";

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

import { handleErrors } from "../../../utils/handleErrors";

export default function WilayahCreate() {
  //navigata
  const navigate = useNavigate();

  const [kodeWilayah, setKodeWilayah] = useState("");
  const [nama, setNama] = useState("");
  const [errors, setErrors] = useState({});

  //token from cookies
  const token = Cookies.get("token");

  const storeWilayah = async (e) => {
    e.preventDefault();

    //define formData
    const formData = new FormData();

    //append data to "formData"
    formData.append("nama", nama);
    formData.append("kode", kodeWilayah);
    //sending data
    await Api.post("/api/wilayah", formData, {
      //header
      headers: {
        //header Bearer + Token
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        //show toast
        toast.success(response.data.message, {
          position: "top-right",
          duration: 4000,
        });

        //redirect
        navigate("/admin/wilayah");
      })
      .catch((error) => {
        const { message } = error.response.data;
        const errorMessages = {};

        if (message.toLowerCase().includes("kode")) {
          errorMessages.kode = message;
        }
        if (message.toLowerCase().includes("nama")) {
          errorMessages.nama = message;
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
                to="/admin/wilayah"
                className="btn btn-md btn-primary border-0 shadow-sm mb-3"
                type="button"
              >
                <i className="fa fa-long-arrow-alt-left me-2"></i> Kembali
              </Link>
              <div className="card border-0 rounded shadow-sm border-top-success">
                <div className="card-body">
                  <h6>Tambah Wilayah</h6>
                  <hr />
                  <form onSubmit={storeWilayah}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Kode Wilayah</label>
                      <input
                        type="text"
                        className="form-control"
                        value={kodeWilayah}
                        onChange={(e) => setKodeWilayah(e.target.value)}
                        placeholder="Kode Wilayah"
                      />
                    </div>
                    {errors.kode && (
                      <div className="alert alert-danger">{errors.kode}</div>
                    )}
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Kabupaten/Kota
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        placeholder="Nama Wilayah"
                      />
                    </div>
                    {errors.nama && (
                      <div className="alert alert-danger">{errors.nama}</div>
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
