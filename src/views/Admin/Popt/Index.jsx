import { useEffect, useState } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import Cookies from "js-cookie";
import Api from "../../../services/Api";
import { Link } from "react-router-dom";
import Pagination from "../../../components/general/Pagination";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";

export default function PoptIndex() {
  document.title = "Petugas POPT - SIBalintan";

  const [popt, setPopt] = useState([]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });

  const token = Cookies.get("token");

  const fetchData = async (pageNumber = 1) => {
    const page = pageNumber ? pageNumber : pagination.currentPage;
    await Api.get(`/api/admin/popt?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setPopt(response.data.data);
      // setPagination(() => ({
      //   currentPage: response.data.pagination.page,
      //   perPage: response.data.pagination.size,
      //   total: response.data.pagination.totalItems,
      // }));
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <LayoutAdmin>
      <main>
        <div className="container-fluid mb-5 mt-5">
          <div className="row">
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-3 col-12 mb-2">
                  <Link
                    to="/admin/popt/create"
                    className="btn btn-md btn-primary border-0 shadow-sm w-100"
                    type="button"
                  >
                    <i className="fa fa-plus-circle"></i> Tambah Data
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
                            NIP
                          </th>
                          <th className="border-0" style={{ width: "5%" }}>
                            Nama Petugas
                          </th>
                          <th className="border-0" style={{ width: "15%" }}>
                            Nomor HP
                          </th>
                          <th className="border-0" style={{ width: "15%" }}>
                            Wilayah
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {popt.length > 0 ? (
                          popt.map((item, index) => (
                            <tr key={index}>
                              <td className="fw-bold text-center">
                                {index +
                                  1 +
                                  (pagination.currentPage - 1) *
                                    pagination.perPage}
                              </td>
                              <td>{item.popt.nip}</td>
                              <td>{item.namaLengkap || "-"}</td>
                              <td>{item.nomorHp || "-"}</td>
                              <td>{item.popt.wilayah}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6}>
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
