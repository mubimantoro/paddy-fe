import React, { useState } from "react";
import { getImageUrl } from "../../utils/imageUrl";

const DocumentPreview = ({ fileUrl, fileName, show, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!show) return null;

  const fullUrl = getImageUrl(fileUrl);
  const fileExtension = fileUrl?.split(".").pop()?.toLowerCase();

  const getViewerUrl = () => {
    switch (fileExtension) {
      case "pdf":
        // Native browser PDF viewer
        return fullUrl;

      case "doc":
      case "docx":
      case "xls":
      case "xlsx":
        // Google Docs Viewer
        return `https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`;

      default:
        return null;
    }
  };

  const viewerUrl = getViewerUrl();

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fullUrl;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoadError = () => {
    setError("Gagal memuat dokumen. Silakan coba download file.");
    setLoading(false);
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1050 }}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ paddingRight: "17px", zIndex: 1055 }}
        onClick={onClose}
      >
        <div
          className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="fas fa-file-alt me-2"></i>
                {fileName}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body p-0" style={{ height: "80vh" }}>
              {viewerUrl ? (
                <>
                  {loading && (
                    <div className="position-absolute top-50 start-50 translate-middle">
                      <div className="text-center">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text-muted">Memuat dokumen...</p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="alert alert-danger m-3">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error}
                    </div>
                  )}

                  <iframe
                    src={viewerUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    title={fileName}
                    onLoad={() => setLoading(false)}
                    onError={handleLoadError}
                    style={{
                      display: loading && !error ? "none" : "block",
                      border: "none",
                    }}
                  />
                </>
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 p-5">
                  <i className="fas fa-exclamation-triangle fa-4x text-warning mb-4"></i>
                  <h5 className="text-center mb-3">
                    Format file tidak didukung untuk preview
                  </h5>
                  <p className="text-muted text-center mb-4">
                    File dengan ekstensi <strong>.{fileExtension}</strong> tidak
                    dapat ditampilkan di browser.
                  </p>
                  <button
                    className="btn btn-success btn-lg"
                    onClick={handleDownload}
                  >
                    <i className="fas fa-download me-2"></i>
                    Download File untuk Melihat
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <div className="d-flex justify-content-between w-100">
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleDownload}
                  >
                    <i className="fas fa-download me-2"></i>
                    Download
                  </button>
                  <a
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-info"
                  >
                    <i className="fas fa-external-link-alt me-2"></i>
                    Buka di Tab Baru
                  </a>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  <i className="fas fa-times me-2"></i>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentPreview;
