import Swal, { SweetAlertOptions } from 'sweetalert2';

const semdTheme: SweetAlertOptions = {
  customClass: {
    popup: 'semd-alert-popup',
    title: 'semd-alert-title',
    htmlContainer: 'semd-alert-content',
    confirmButton: 'semd-alert-confirm',
    cancelButton: 'semd-alert-cancel',
    actions: 'semd-alert-actions',
  },
  buttonsStyling: false,
};

export const alert = {
  success: (title: string, message?: string) => {
    return Swal.fire({
      ...semdTheme,
      icon: 'success',
      title,
      text: message,
      confirmButtonText: 'ตกลง',
      iconColor: '#4CAF50',
    });
  },

  error: (title: string, message?: string) => {
    return Swal.fire({
      ...semdTheme,
      icon: 'error',
      title,
      text: message,
      confirmButtonText: 'ตกลง',
      iconColor: '#FF5252',
    });
  },

  warning: (title: string, message?: string) => {
    return Swal.fire({
      ...semdTheme,
      icon: 'warning',
      title,
      text: message,
      confirmButtonText: 'ตกลง',
      iconColor: '#FFC107',
    });
  },

  info: (title: string, message?: string) => {
    return Swal.fire({
      ...semdTheme,
      icon: 'info',
      title,
      text: message,
      confirmButtonText: 'ตกลง',
      iconColor: '#2196F3',
    });
  },

  confirm: (title: string, message?: string) => {
    return Swal.fire({
      ...semdTheme,
      icon: 'question',
      title,
      text: message,
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      iconColor: '#FFD700',
    });
  },

  loading: (title: string = 'กำลังโหลด...', message?: string) => {
    return Swal.fire({
      ...semdTheme,
      title,
      text: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  },

  close: () => {
    Swal.close();
  },

  custom: (options: SweetAlertOptions) => {
    return Swal.fire({
      ...semdTheme,
      ...options,
      customClass: {
        ...semdTheme.customClass,
        ...(options.customClass || {}),
      },
    } as SweetAlertOptions);
  },
};

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .semd-alert-popup {
      border-radius: 16px !important;
      padding: 2rem !important;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    }

    .semd-alert-title {
      color: #1A1A1A !important;
      font-size: 1.5rem !important;
      font-weight: 700 !important;
      margin-bottom: 1rem !important;
    }

    .semd-alert-content {
      color: #666666 !important;
      font-size: 1rem !important;
      line-height: 1.5 !important;
    }

    .semd-alert-actions {
      gap: 0.75rem !important;
      margin-top: 1.5rem !important;
    }

    .semd-alert-confirm {
      background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%) !important;
      color: #1A1A1A !important;
      font-weight: 600 !important;
      padding: 0.75rem 2rem !important;
      border-radius: 8px !important;
      border: none !important;
      cursor: pointer !important;
      transition: all 0.3s ease !important;
      font-size: 1rem !important;
    }

    .semd-alert-confirm:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4) !important;
    }

    .semd-alert-confirm:active {
      transform: translateY(0) !important;
    }

    .semd-alert-cancel {
      background: #F5F5F5 !important;
      color: #666666 !important;
      font-weight: 600 !important;
      padding: 0.75rem 2rem !important;
      border-radius: 8px !important;
      border: 1px solid #E0E0E0 !important;
      cursor: pointer !important;
      transition: all 0.3s ease !important;
      font-size: 1rem !important;
    }

    .semd-alert-cancel:hover {
      background: #E0E0E0 !important;
      border-color: #CCCCCC !important;
    }

    .swal2-icon.swal2-success .swal2-success-ring {
      border-color: rgba(76, 175, 80, 0.3) !important;
    }

    .swal2-icon.swal2-error [class^='swal2-x-mark-line'] {
      background-color: #FF5252 !important;
    }

    .swal2-icon.swal2-warning {
      border-color: #FFC107 !important;
      color: #FFC107 !important;
    }

    .swal2-icon.swal2-info {
      border-color: #2196F3 !important;
      color: #2196F3 !important;
    }

    .swal2-icon.swal2-question {
      border-color: #FFD700 !important;
      color: #FFD700 !important;
    }

    .swal2-loader {
      border-color: #FFD700 transparent #FFD700 transparent !important;
    }
  `;
  document.head.appendChild(style);
}
