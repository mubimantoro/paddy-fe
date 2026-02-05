//import react router dom
import { Routes, Route } from "react-router-dom";

import Login from "../views/Auth/Login";
import Forbidden from "../views/Auth/Forbidden";
import Dashboard from "../views/Admin/Index";
import PrivateRoutes from "./PrivateRoutes";
import WilayahIndex from "../views/Admin/Wilayah/Index";
import KecamatanIndex from "../views/Admin/Kecamatan/Index";
import RolesIndex from "../views/Admin/Roles/Index";
import UsersIndex from "../views/Admin/Users/Index";
import WilayahCreate from "../views/Admin/Wilayah/Create";
import WilayahEdit from "../views/Admin/Wilayah/Edit";
import KecamatanCreate from "../views/Admin/Kecamatan/Create";
import KecamatanEdit from "../views/Admin/Kecamatan/Edit";
import PengaduanTanamanIndex from "../views/Admin/PengaduanTanaman/Index";
import PengaduanTanamanDetail from "../views/Admin/PengaduanTanaman/Detail";
import PoptIndex from "../views/Admin/Popt/Index";
import PoptDetail from "../views/Admin/Popt/Detail";
import PoptCreate from "../views/Admin/Popt/Create";
import UsersCreate from "../views/Admin/Users/Create";
import UsersEdit from "../views/Admin/Users/Edit";
import KelompokTaniIndex from "../views/Admin/KelompokTani/Index";
import KelompokTaniCreate from "../views/Admin/KelompokTani/Create";
import PoptEdit from "../views/Admin/Popt/Edit";
import LaporanPengaduan from "../views/Admin/reports/LaporanPengaduan";
import LaporanKinerjaPOPT from "../views/Admin/reports/LaporanKinerjaPopt";
import LaporanAktivitasUser from "../views/Admin/reports/LaporanAktivitasUser";
import LaporanPrediksiPenyakit from "../views/Admin/reports/LaporanPrediksiPenyakit";

export default function RoutesIndex() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* route "/forbidden" */}
      <Route path="/forbidden" element={<Forbidden />} />
      {/* private route "/admin/dashboard" */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoutes>
            <Dashboard />
          </PrivateRoutes>
        }
      />
      <Route
        path="/admin/wilayah"
        element={
          <PrivateRoutes>
            <WilayahIndex />
          </PrivateRoutes>
        }
      />
      <Route
        path="/admin/wilayah/create"
        element={
          <PrivateRoutes>
            <WilayahCreate />
          </PrivateRoutes>
        }
      />
      <Route
        path="/admin/wilayah/edit/:id"
        element={
          <PrivateRoutes>
            <WilayahEdit />
          </PrivateRoutes>
        }
      />

      <Route
        path="/admin/kecamatan"
        element={
          <PrivateRoutes>
            <KecamatanIndex />
          </PrivateRoutes>
        }
      />
      <Route
        path="/admin/kecamatan/create"
        element={
          <PrivateRoutes>
            <KecamatanCreate />
          </PrivateRoutes>
        }
      />

      <Route
        path="/admin/kecamatan/edit/:id"
        element={
          <PrivateRoutes>
            <KecamatanEdit />
          </PrivateRoutes>
        }
      />

      <Route
        path="/admin/popt"
        element={
          <PrivateRoutes>
            <PoptIndex />
          </PrivateRoutes>
        }
      />

      <Route
        path="/admin/popt/create"
        element={
          <PrivateRoutes>
            <PoptCreate />
          </PrivateRoutes>
        }
      />

      <Route
        path="/admin/popt/edit/:id"
        element={
          <PrivateRoutes>
            <PoptEdit />
          </PrivateRoutes>
        }
      />

      <Route
        path="/admin/popt/detail/:id"
        element={
          <PrivateRoutes>
            <PoptDetail />
          </PrivateRoutes>
        }
      />

      <Route
        path="/admin/pengaduan-tanaman"
        element={
          <PrivateRoutes>
            <PengaduanTanamanIndex />
          </PrivateRoutes>
        }
      />

      <Route
        path="/admin/pengaduan-tanaman/detail/:id"
        element={
          <PrivateRoutes>
            <PengaduanTanamanDetail />
          </PrivateRoutes>
        }
      />

      <Route
        path="/admin/kelompok-tani"
        element={
          <PrivateRoutes>
            <KelompokTaniIndex />
          </PrivateRoutes>
        }
      />

      <Route
        path="/admin/kelompok-tani/create"
        element={
          <PrivateRoutes>
            <KelompokTaniCreate />
          </PrivateRoutes>
        }
      />

      <Route
        path="/admin/roles"
        element={
          <PrivateRoutes>
            <RolesIndex />
          </PrivateRoutes>
        }
      />
      <Route
        path="/admin/users"
        element={
          <PrivateRoutes>
            <UsersIndex />
          </PrivateRoutes>
        }
      />

      <Route
        path="/admin/users/create"
        element={
          <PrivateRoutes>
            <UsersCreate />
          </PrivateRoutes>
        }
      />

      <Route
        path="/admin/users/edit/:id"
        element={
          <PrivateRoutes>
            <UsersEdit />
          </PrivateRoutes>
        }
      />

      <Route path="/admin/reports/pengaduan" element={<LaporanPengaduan />} />
      <Route path="/admin/reports/popt" element={<LaporanKinerjaPOPT />} />
      <Route
        path="/admin/reports/prediksi"
        element={<LaporanPrediksiPenyakit />}
      />
      <Route
        path="/admin/reports/aktivitas"
        element={<LaporanAktivitasUser />}
      />
    </Routes>
  );
}
