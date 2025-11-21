/**
 * Simple toast utility using browser notifications
 * Falls back to console if notifications not supported
 */

type ToastType = "success" | "error" | "info";

export const toast = {
  success: (message: string) => {
    showToast(message, "success");
  },
  error: (message: string) => {
    showToast(message, "error");
  },
  info: (message: string) => {
    showToast(message, "info");
  },
};

function showToast(message: string, type: ToastType) {
  const toastEl = document.createElement("div");
  toastEl.className = `fixed top-4 right-4 z-[100] px-4 py-3 rounded-lg shadow-lg border transition-all duration-300 transform translate-x-0 max-w-sm ${
    type === "success"
      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
      : type === "error"
      ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
      : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200"
  }`;

  toastEl.textContent = message;

  document.body.appendChild(toastEl);

  requestAnimationFrame(() => {
    toastEl.style.transform = "translateX(0)";
  });

  setTimeout(() => {
    toastEl.style.opacity = "0";
    toastEl.style.transform = "translateX(100%)";
    setTimeout(() => {
      document.body.removeChild(toastEl);
    }, 300);
  }, 3000);
}
