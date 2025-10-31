import { useEffect, useState } from "react";
import LayoutAdmin from "../../../layouts/Admin";
import Cookies from "js-cookie";
import Api from "../../../services/Api";
import hasAnyPermission from "../../../utils/Permissions";
import { Link } from "react-router-dom";
import Pagination from "../../../components/general/Pagination";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";

import "react-confirm-alert/src/react-confirm-alert.css";

export default function RolesIndex() {
  document.title = "Roles - SIBalintan";

  const [roles, setRoles] = useState([]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });

  const token = Cookies.get("token");

  const fetchData = async (pageNumber = 1) => {
    const page = pageNumber ? pageNumber : pagination.currentPage;

    await Api.get(`/api/roles?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      setRoles(response.data.data);

      setPagination(() => ({
        currentPage: response.data.pagination.page,
        perPage: response.data.pagination.size,
        total: response.data.pagination.totalItems,
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

  const deleteRole = (id) => {
    confirmAlert({
      title: "Apakah Anda yakin ?",
      message: "Untuk menghapus data ini ?",
      buttons: [
        {
          label: "Ya",
          onClick: async () => {
            await Api.delete(`/api/roles/${id}`, {
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
                          <th className="border-0">Role Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roles.length > 0 ? (
                          roles.map((role, index) => (
                            <tr key={index}>
                              <td className="fw-bold text-center">
                                {++index +
                                  (pagination.currentPage - 1) *
                                    pagination.perPage}
                              </td>
                              <td>{role.name}</td>
                            </tr>
                          ))
                        ) : (
                          //tampilkan pesan data belum tersedia
                          <tr>
                            <td colSpan={4}>
                              <div
                                className="alert alert-danger border-0 rounded shadow-sm w-100 text-center"
                                role="alert"
                              >
                                Data Belum Tersedia!.
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
