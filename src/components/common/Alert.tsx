import type { ReactNode } from "react";
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

type AlertType = "success" | "error" | "warning" | "primary";

interface AlertProps {
  type?: AlertType;
  text: string;
  icon?: ReactNode;
}

const Alert = ({ type = "primary", text, icon }: AlertProps) => {
  const styles: Record<AlertType, string> = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    primary: "bg-blue-50 text-blue-800 border-blue-200",
  };

  const icons: Record<AlertType, ReactNode> = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
    primary: <Info className="w-5 h-5 text-blue-600" />,
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${styles[type]} shadow-sm`}
    >
      {icon || icons[type]}
      <p className="text-sm font-medium">{text}</p>
    </div>
  );
};

export default Alert;
