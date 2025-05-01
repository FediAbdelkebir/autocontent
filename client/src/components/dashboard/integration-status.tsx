interface IntegrationItem {
  name: string;
  icon: string;
  lastExecuted: string;
  status: "active" | "warning" | "error";
}

interface IntegrationStatusProps {
  integrations: IntegrationItem[];
  connectionStatus: "connected" | "connecting" | "disconnected";
  onOpenExternal?: () => void;
}

export const IntegrationStatus = ({
  integrations = [],
  connectionStatus = "connected",
  onOpenExternal
}: IntegrationStatusProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-secondary";
      case "warning":
        return "bg-[#FFD740]";
      case "error":
        return "bg-destructive";
      default:
        return "bg-muted-foreground";
    }
  };

  const getConnectionBadge = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-secondary bg-opacity-20 text-secondary px-2 py-0.5 rounded-full text-xs";
      case "connecting":
        return "bg-[#FFD740] bg-opacity-20 text-[#FFD740] px-2 py-0.5 rounded-full text-xs";
      case "disconnected":
        return "bg-destructive bg-opacity-20 text-destructive px-2 py-0.5 rounded-full text-xs";
      default:
        return "bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs";
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting";
      case "disconnected":
        return "Disconnected";
      default:
        return "Unknown";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold">Make.com Integration</h3>
        <span className={getConnectionBadge()}>
          {getConnectionText()}
        </span>
      </div>
      
      <div className="space-y-4">
        {integrations.map((integration, index) => (
          <div className="flex justify-between items-center" key={index}>
            <div className="flex items-center">
              <i className={`${integration.icon} text-primary text-xl mr-3`}></i>
              <div>
                <h4 className="font-medium">{integration.name}</h4>
                <p className="text-muted-foreground text-xs mt-0.5">Last executed: {integration.lastExecuted}</p>
              </div>
            </div>
            <span className={`w-3 h-3 rounded-full ${getStatusColor(integration.status)}`}></span>
          </div>
        ))}
        
        <div className="mt-6">
          <a 
            href="#" 
            className="text-primary text-sm flex items-center hover:underline"
            onClick={(e) => {
              e.preventDefault();
              if (onOpenExternal) onOpenExternal();
            }}
          >
            <i className="ri-external-link-line mr-1"></i>
            Open in Make.com
          </a>
        </div>
      </div>
    </div>
  );
};
