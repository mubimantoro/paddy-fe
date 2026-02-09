import { useEffect, useState } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import Cookies from "js-cookie";
import Api from "../../../services/Api";
import { Link } from "react-router-dom";
import Pagination from "../../../components/general/Pagination";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";
import DateID from "../../../utils/DateID";

export default function PengaduanTanamanIndex() {
  document.title = "Pengaduan Tanaman - SIBalintan";
  const [pengaduanTanaman, setPengaduanTanaman] = useState([]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });

  const [keywords, setKeywords] = useState("");

  const token = Cookies.get("token");

  const fetchData = async (pageNumber = 1) => {
    const page = pageNumber ? pageNumber : pagination.currentPage;
    await Api.get(`/api/admin/pengaduan-tanaman?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setPengaduanTanaman(response.data.data.pengaduan);
      setPagination(() => ({
        currentPage: response.data.data.pagination.page,
        perPage: response.data.data.pagination.total,
        total: response.data.data.pagination.total,
      }));
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const searchData = async (e) => {
    setKeywords(e.target.value);
    fetchData(1, e.target.value);
  };

  const deleteKegiatan = (id) => {
    confirmAlert({
      title: "Hapus Data",
      message: "Apakah Anda yakin ingin menghapus data ini ?",
      buttons: [
        {
          label: "Ya",
          onClick: async () => {
            await Api.delete(`/api/admin/kegiatan/${id}`, {
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="badge bg-warning">Pending</span>;
      case "assigned":
        return <span className="badge bg-info">Ditugaskan</span>;
      case "in_progress":
        return <span className="badge bg-primary">Diproses</span>;
      case "completed":
        return <span className="badge bg-success">Selesai</span>;
      case "rejected":
        return <span className="badge bg-danger">Ditolak</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <LayoutAdmin>
      <main>
        <div className="container-fluid mb-5 mt-5">
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
                          <th className="border-0" style={{ width: "10%" }}>
                            Tanggal Pengaduan
                          </th>
                          <th className="border-0" style={{ width: "12%" }}>
                            Pelapor
                          </th>
                          <th className="border-0" style={{ width: "15%" }}>
                            Kelompok Tani
                          </th>

                          <th className="border-0" style={{ width: "12%" }}>
                            Kecamatan
                          </th>
                          <th className="border-0" style={{ width: "20%" }}>
                            Deskripsi Pengaduan
                          </th>
                          <th className="border-0" style={{ width: "11%" }}>
                            POPT
                          </th>
                          <th className="border-0" style={{ width: "8%" }}>
                            Status
                          </th>
                          <th className="border-0" style={{ width: "10%" }}>
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pengaduanTanaman.length > 0 ? (
                          pengaduanTanaman.map((item, index) => (
                            <tr key={index}>
                              <td className="fw-bold text-center">
                                {++index +
                                  (pagination.currentPage - 1) *
                                    pagination.perPage}
                              </td>
                              <td className="text-muted small">
                                {DateID(new Date(item.created_at))}
                              </td>
                              <td>{item.pelapor_nama}</td>
                              <td>{item.kelompok_tani}</td>
                              <td>
                                {item.kecamatan}
                                {item.kabupaten && (
                                  <>
                                    <br />
                                    <small className="text-muted">
                                      {item.kabupaten}
                                    </small>
                                  </>
                                )}
                              </td>
                              <td>
                                <div
                                  style={{
                                    maxHeight: "60px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {item.deskripsi}
                                </div>
                              </td>
                              <td>
                                {item.popt_nama ? (
                                  <small className="badge bg-info">
                                    {item.popt_nama}
                                  </small>
                                ) : (
                                  <small className="text-muted">-</small>
                                )}
                              </td>
                              <td>{getStatusBadge(item.status)}</td>
                              <td className="text-center">
                                <Link
                                  to={`/admin/pengaduan-tanaman/detail/${item.id}`}
                                  className="btn btn-primary btn-sm me-2"
                                  title="Lihat Detail"
                                >
                                  <i className="fa fa-eye"></i>
                                </Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={8}>
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
                  <Pagination
                    currentPage={pagination.currentPage}
                    perPage={pagination.perPage}
                    total={pagination.total}
                    onChange={(pageNumber) => fetchData(pageNumber)}
                    position="end"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </LayoutAdmin>
  );
}
