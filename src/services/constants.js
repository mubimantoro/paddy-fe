export const STATUS_BADGE_CONFIG = {
  [PENGADUAN_STATUS.PENDING]: {
    variant: 'warning',
    label: 'Pending',
    className: 'badge bg-warning text-dark',
  },
  [PENGADUAN_STATUS.ASSIGNED]: {
    variant: 'info',
    label: 'Ditugaskan',
    className: 'badge bg-info',
  },
  [PENGADUAN_STATUS.IN_PROGRESS]: {
    variant: 'primary',
    label: 'Dalam Proses',
    className: 'badge bg-primary',
  },
  [PENGADUAN_STATUS.VERIFIED]: {
    variant: 'success',
    label: 'Diverifikasi',
    className: 'badge bg-success',
  },
  [PENGADUAN_STATUS.COMPLETED]: {
    variant: 'success',
    label: 'Selesai',
    className: 'badge bg-success',
  },
  [PENGADUAN_STATUS.REJECTED]: {
    variant: 'danger',
    label: 'Ditolak',
    className: 'badge bg-danger',
  },
};