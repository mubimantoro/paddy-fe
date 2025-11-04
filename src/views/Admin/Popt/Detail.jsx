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

export default function PoptDetail() {
  //title page
  document.title = "Detail Petugas POPT - SIBalintan";

  //navigata
  const navigate = useNavigate();

  //get ID from parameter URL
  const { id } = useParams();

  const [popt, setPopt] = useState({});
  const [errors, setErrors] = useState({});

  //token from cookies
  const token = Cookies.get("token");

  const fetchDetail = async () => {
    await Api.get(`/api/admin/popt/${id}`, {
      //header
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setPopt(response.data.data);
    });
  };

  //useEffect
  useEffect(() => {
    fetchDataWilayah();
  }, []);

  const updateWilayah = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("kode", kode);

    //sending data
    await Api.put(`/api/wilayah/${id}`, formData, {
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
          <div className="row mb-4">
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
                  <h6>Detail Pengaduan Tanaman</h6>
                  <hr />
                  <div className="row">
                    <div className="col-md-6">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td>Kelompok Tani</td>
                            <td>: {pengaduanTanaman.kelompok_tani || "-"}</td>
                          </tr>
                          <tr>
                            <td>Nama pelapor</td>
                            <td>: {pengaduanTanaman.user_nama || "-"}</td>
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
                            <td>: {getStatusBadge(pengaduanTanaman.status)}</td>
                          </tr>
                          <tr>
                            <td>Tanggal dibuat</td>
                            <td>
                              :{" "}
                              {pengaduanTanaman.created_at
                                ? DateID(new Date(pengaduanTanaman.created_at))
                                : "-"}
                            </td>
                          </tr>
                          <tr>
                            <td> Terakhir Diperbarui</td>
                            <td>
                              :{" "}
                              {pengaduanTanaman.updated_at
                                ? DateID(new Date(pengaduanTanaman.updated_at))
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
                        </tbody>
                      </table>
                    </div>
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
