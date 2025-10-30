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
        path="/admin/pengaduan-tanaman"
        element={
          <PrivateRoutes>
            <KecamatanIndex />
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
    </Routes>
  );
}
