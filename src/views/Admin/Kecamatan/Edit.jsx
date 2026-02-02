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

export default function KecamatanEdit() {
  //title page
  document.title = "Edit Wilayah - SIBalintan";

  //navigata
  const navigate = useNavigate();

  //get ID from parameter URL
  const { id } = useParams();

  //define state for form
  const [nama, setNama] = useState("");
  const [wilayahId, setWilayahId] = useState("");
  const [errors, setErrors] = useState({});

  const [wilayah, setWilayah] = useState([]);

  //token from cookies
  const token = Cookies.get("token");

  const fetchDataWilayah = async () => {
    await Api.get(`/api/wilayah/all`, {
      //header
      headers: {
        //header Bearer + Token
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      //set response data to state
      setWilayah(response.data.data);
    });
  };

  const fetchDataKecamatan = async () => {
    await Api.get(`/api/kecamatan/${id}`, {
      //header
      headers: {
        //header Bearer + Token
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      //set response data to state
      setNama(response.data.data.nama);
      setWilayahId(response.data.data.wilayah_id);
    });
  };

  //useEffect
  useEffect(() => {
    fetchDataWilayah();
    fetchDataKecamatan();
  }, []);

  const updateKecamatan = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("wilayah_id", wilayahId);

    //sending data
    await Api.put(`/api/kecamatan/${id}`, formData, {
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
        navigate("/admin/kecamatan");
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

        if (message.toLowerCase().includes("wilayah")) {
          errorMessages.wilayahId = message;
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
                  <h6>
                    <i className="fa fa-folder"></i> Edit Kecamatan
                  </h6>
                  <hr />
                  <form onSubmit={updateKecamatan}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Kecamatan</label>
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
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Kabupaten / Kota
                      </label>
                      <select
                        className="form-select"
                        value={wilayahId}
                        onChange={(e) => setWilayahId(e.target.value)}
                      >
                        <option value="">-- Select Kabupaten / Kota --</option>
                        {wilayah.map((item) => (
                          <option value={item.id} key={item.id}>
                            {item.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.wilayahId && (
                      <div className="alert alert-danger">
                        {errors.wilayahId}
                      </div>
                    )}

                    <div>
                      <button
                        type="submit"
                        className="btn btn-md btn-primary me-2"
                      >
                        <i className="fa fa-save"></i> Perbarui
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
