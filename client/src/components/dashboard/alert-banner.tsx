import { useState } from "react";

interface AlertBannerProps {
  title: string;
  message: string;
  type: "error" | "warning" | "success" | "info";
  onClose?: () => void;
  actionLink?: {
    text: string;
    href: string;
  };
}

export const AlertBanner = ({
  title,
  message,
  type = "error",
  onClose,
  actionLink
}: AlertBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const getTypeClasses = () => {
    switch (type) {
      case "error":
        return "error-bg";
      case "warning":
        return "warning-bg";
      case "success":
        return "success-bg";
      default:
        return "bg-muted border border-muted-foreground border-opacity-30 rounded-lg";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "error":
        return "ri-error-warning-line text-destructive";
      case "warning":
        return "ri-alert-line text-[#FFD740]";
      case "success":
        return "ri-check-line text-secondary";
      default:
        return "ri-information-line text-muted-foreground";
    }
  };

  return (
    <div className={`p-4 mb-6 flex items-start ${getTypeClasses()}`}>
      <i className={`${getIcon()} mt-0.5 mr-3 text-lg`}></i>
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-muted-foreground text-sm mt-1">
          {message}{" "}
          {actionLink && (
            <a href={actionLink.href} className="text-primary hover:underline">
              {actionLink.text}
            </a>
          )}
        </p>
      </div>
      <button 
        className="text-muted-foreground hover:text-foreground"
        onClick={handleClose}
        aria-label="Close alert"
      >
        <i className="ri-close-line"></i>
      </button>
    </div>
  );
};
