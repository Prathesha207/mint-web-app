import { toast } from "react-hot-toast";
import { AlertCircle, XCircle, CheckCircle } from "lucide-react";
import { JSX } from "react/jsx-dev-runtime";

type ToastType = "success" | "error" | "warning";

export const showToast = (
  message: string,
  type: ToastType = "success",
  duration: number = 2000
) => {
  const styles: Record<ToastType, { border: string; bg: string; text: string; icon: JSX.Element }> = {
    success: {
      border: "border-green-300",
      bg: "bg-green-50",
      text: "text-green-700/80",
      icon: <CheckCircle className="w-4 h-4 shrink-0" />,
    },
    error: {
      border: "border-red-300",
      bg: "bg-red-50",
      text: "text-red-700/80",
      icon: <XCircle className="w-4 h-4 shrink-0" />,
    },
    warning: {
      border: "border-yellow-300",
      bg: "bg-yellow-50",
      text: "text-yellow-700/80",
      icon: <AlertCircle className="w-4 h-4 shrink-0" />,
    },
  };

  const { border, bg, text, icon } = styles[type];

  toast.custom(
    <div
      className={`flex items-center justify-between gap-2 rounded-lg border ${border} ${bg} px-3 py-2 shadow-sm whitespace-nowrap`}
      style={{ minWidth: "250px" }}
    >
      <div className={`flex items-center gap-1 ${text} text-xs flex-1 truncate gap-2`}>
        {icon}
        <span className="truncate">{message}</span>
      </div>

      <button
        onClick={() => toast.dismiss()}
        className={`${text.replace("/80", "/60")} hover:${text} text-sm`}
      >
        ✕
      </button>
    </div>,
    { duration }
  );
};