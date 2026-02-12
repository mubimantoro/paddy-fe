import React, { useEffect } from "react";

const Modal = ({
  show,
  onClose,
  title,
  children,
  footer,
  size = "md",
  centered = true,
  closeButton = true,
}) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  if (!show) return null;

  const sizeClass = {
    sm: "modal-sm",
    md: "",
    lg: "modal-lg",
    xl: "modal-xl",
  }[size];

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ paddingRight: "17px" }}
        onClick={onClose}
      >
        <div
          className={`modal-dialog ${sizeClass} ${centered ? "modal-dialog-centered" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              {closeButton && (
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                  aria-label="Close"
                ></button>
              )}
            </div>
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer">{footer}</div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
