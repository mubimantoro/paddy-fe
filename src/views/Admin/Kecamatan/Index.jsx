import { useEffect, useState } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import Cookies from "js-cookie";
import Api from "../../../services/Api";
import { Link } from "react-router-dom";
import Pagination from "../../../components/general/Pagination";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";

export default function KecamatanIndex() {
  document.title = "Kecamatan - SIBalintan";

  const [kecamatan, setKecamatan] = useState([]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });

  const token = Cookies.get("token");

  const fetchData = async (pageNumber = 1) => {
    const page = pageNumber ? pageNumber : pagination.currentPage;
    await Api.get(`/api/kecamatan?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setKecamatan(response.data.data.kecamatan || []);
      setPagination(() => ({
        currentPage: response.data.data.pagination.page,
        perPage: response.data.data.pagination.limit,
        total: response.data.data.pagination.total_items,
      }));
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteKecamatan = (id) => {
    confirmAlert({
      title: "Hapus Data",
      message: "Apakah Anda yakin ingin menghapus data ini ?",
      buttons: [
        {
          label: "Ya",
          onClick: async () => {
            await Api.delete(`/api/kecamatan/${id}`, {
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

  return (
    <LayoutAdmin>
      <main>
        <div className="container-fluid mb-5 mt-5">
          <div className="row">
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-3 col-12 mb-2">
                  <Link
                    to="/admin/kecamatan/create"
                    className="btn btn-md btn-primary border-0 shadow-sm w-100"
                    type="button"
                  >
                    <i className="fa fa-plus-circle"></i> Tambah Kecamatan Baru
                  </Link>
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
                          <th className="border-0" style={{ width: "15%" }}>
                            Nama Wilayah
                          </th>
                          <th className="border-0" style={{ width: "15%" }}>
                            Nama Kecamatan
                          </th>
                          <th className="border-0" style={{ width: "15%" }}>
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {kecamatan.length > 0 ? (
                          kecamatan.map((item, index) => (
                            <tr key={index}>
                              <td className="fw-bold text-center">
                                {index +
                                  1 +
                                  (pagination.currentPage - 1) *
                                    pagination.perPage}
                              </td>
                              <td>{item.wilayah_nama || "-"}</td>
                              <td>{item.nama}</td>
                              <td className="text-center">
                                <Link
                                  to={`/admin/kecamatan/edit/${item.id}`}
                                  className="btn btn-primary btn-sm me-2"
                                >
                                  <i className="fa fa-pencil-alt"></i>
                                </Link>

                                <button
                                  onClick={() => deleteKecamatan(item.id)}
                                  className="btn btn-danger btn-sm"
                                >
                                  <i className="fa fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4}>
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
