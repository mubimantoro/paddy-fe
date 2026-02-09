import React, { useState } from "react";
import toast from "react-hot-toast";
import Api from "../../services/Api";
import Cookies from "js-cookie";

export default function ExportPDFButton({
  reportType,
  reportName = "Laporan",
  className = "btn btn-danger btn-sm shadow-sm",
  disabled = false,
}) {
  const [exporting, setExporting] = useState(false);
  const token = Cookies.get("token");

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await Api.get(`/api/export/pdf/${reportType}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Generate filename with date
      const filename = `${reportName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
      link.setAttribute("download", filename);

      document.body.appendChild(link);
      link.click();
      link.remove();

      // Clean up
      window.URL.revokeObjectURL(url);

      toast.success(`Berhasil export ${reportName} ke PDF`, {
        position: "top-right",
        duration: 4000,
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);

      // Handle specific error messages
      let errorMessage = "Gagal export PDF. Silakan coba lagi.";
      if (error.response?.status === 401) {
        errorMessage = "Session expired. Silakan login kembali.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Silakan hubungi administrator.";
      }

      toast.error(errorMessage, {
        position: "top-right",
        duration: 4000,
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || exporting}
      className={className}
    >
      {exporting ? (
        <>
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          Generating PDF...
        </>
      ) : (
        <>
          <i className="fas fa-file-pdf me-2"></i>
          Export PDF
        </>
      )}
    </button>
  );
}
