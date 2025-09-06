import { toast as sonnerToast } from "sonner";

const toast = (type, options = {}) => {
    const { title, description, duration = 5000, action } = options;

    const toastOptions = {
        duration,
        ...(action && {
            action: {
                label: action.label,
                onClick: action.onClick,
            },
        }),
    };

    switch (type) {
        case "success":
            return sonnerToast.success(title, { ...toastOptions, description });
        case "error":
            return sonnerToast.error(title, { ...toastOptions, description });
        case "warning":
            return sonnerToast.warning(title, { ...toastOptions, description });
        case "info":
            return sonnerToast.info(title, { ...toastOptions, description });
        default:
            return sonnerToast(title, { ...toastOptions, description });
    }
};

// Helper methods for common toast types
toast.success = (options) => toast("success", options);

toast.error = (options) => toast("error", options);

toast.warning = (options) => toast("warning", options);

toast.info = (options) => toast("info", options);

toast.loading = (message) => sonnerToast.loading(message);

toast.dismiss = () => sonnerToast.dismiss();

toast.promise = (promise, messages, options = {}) => {
    const toastId = sonnerToast.loading();

    promise
        .then((data) => {
            const successMessage =
                typeof messages.success === "function"
                    ? messages.success(data)
                    : messages.success;

            sonnerToast.success(successMessage, {
                id: toastId,
                duration: options?.duration,
            });
            return data;
        })
        .catch((error) => {
            const errorMessage =
                typeof messages.error === "function"
                    ? messages.error(error)
                    : messages.error;

            sonnerToast.error(errorMessage, {
                id: toastId,
                duration: options?.duration,
            });
            throw error;
        });

    return promise;
};

export { toast };
