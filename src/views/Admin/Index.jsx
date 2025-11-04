import { useState, useEffect } from "react";
import LayoutAdmin from "../../layouts/Admin";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <LayoutAdmin>
      <main>
        <div class="container-fluid px-4 mt-5">
          <div class="row">
            <div class="col-xl-4 col-md-6">
              <div class="card bg-primary text-white mb-4 border-0 shadow-sm">
                <div class="card-body">
                  <strong>2</strong> Petugas POPT
                </div>
                <div class="card-footer d-flex align-items-center justify-content-between">
                  <Link
                    class="small text-white stretched-link"
                    to="/admin/categories"
                  >
                    Lihat Detail
                  </Link>
                  <div class="small text-white">
                    <i class="fas fa-angle-right"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-4 col-md-6">
              <div class="card bg-warning text-white mb-4 border-0 shadow-sm">
                <div class="card-body">
                  <strong>2</strong> Pengaduan Tanaman
                </div>
                <div class="card-footer d-flex align-items-center justify-content-between">
                  <Link
                    class="small text-white stretched-link"
                    to="/admin/posts"
                  >
                    Lihat Detail
                  </Link>
                  <div class="small text-white">
                    <i class="fas fa-angle-right"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-4 col-md-6">
              <div class="card bg-success text-white mb-4 border-0 shadow-sm">
                <div class="card-body">
                  <strong>2</strong> User
                </div>
                <div class="card-footer d-flex align-items-center justify-content-between">
                  <Link
                    class="small text-white stretched-link"
                    to="/admin/products"
                  >
                    Lihat Detail
                  </Link>
                  <div class="small text-white">
                    <i class="fas fa-angle-right"></i>
                  </div>
                </div>
              </div>
            </div>
            {/* <div class="col-xl-3 col-md-6">
              <div class="card bg-danger text-white mb-4 border-0 shadow-sm">
                <div class="card-body">
                  <strong>{countAparaturs}</strong> APARATURS
                </div>
                <div class="card-footer d-flex align-items-center justify-content-between">
                  <Link
                    class="small text-white stretched-link"
                    to="/admin/aparaturs"
                  >
                    View Details
                  </Link>
                  <div class="small text-white">
                    <i class="fas fa-angle-right"></i>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </main>
    </LayoutAdmin>
  );
}
