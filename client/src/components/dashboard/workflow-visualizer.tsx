interface WorkflowStep {
  name: string;
  icon: string;
  status: "active" | "warning" | "error";
}

interface Platform {
  name: string;
  icon: string;
  status: "active" | "warning" | "error" | "rate_limited";
}

interface WorkflowVisualizerProps {
  steps: WorkflowStep[];
  platforms: Platform[];
}

export const WorkflowVisualizer = ({
  steps = [
    { name: "Content Ingestion", icon: "ri-database-2-line", status: "active" },
    { name: "Video Generation", icon: "ri-video-line", status: "active" },
    { name: "Social Posting", icon: "ri-share-line", status: "error" }
  ],
  platforms = [
    { name: "YouTube", icon: "ri-youtube-line", status: "active" },
    { name: "Instagram", icon: "ri-instagram-line", status: "active" },
    { name: "TikTok", icon: "ri-tiktok-line", status: "rate_limited" },
    { name: "X (Twitter)", icon: "ri-twitter-x-line", status: "active" }
  ]
}: WorkflowVisualizerProps) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case "active":
        return "text-secondary";
      case "warning":
        return "text-[#FFD740]";
      case "error":
      case "rate_limited":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return "ri-checkbox-circle-line";
      case "warning":
        return "ri-alert-line";
      case "error":
      case "rate_limited":
        return "ri-error-warning-line";
      default:
        return "ri-question-line";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Running Normally";
      case "warning":
        return "Minor Issues";
      case "error":
        return "Partial Issues";
      case "rate_limited":
        return "Rate Limited";
      default:
        return "Unknown Status";
    }
  };

  const getStepIconBackground = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary bg-opacity-20";
      case "warning":
        return "bg-[#FFD740] bg-opacity-20";
      case "error":
        return "bg-destructive bg-opacity-20";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="relative">
      {/* Connection Lines */}
      <div className="absolute top-12 left-[6.5rem] w-[calc(100%-13rem)] h-0.5 bg-gray-700 z-0"></div>
      <div className="absolute top-[5.75rem] left-[6.5rem] w-0.5 h-14 bg-gray-700 z-0"></div>
      <div className="absolute top-[5.75rem] right-[6.5rem] w-0.5 h-14 bg-gray-700 z-0"></div>
      
      {/* Workflow Steps */}
      <div className="grid grid-cols-3 mb-8 relative z-10">
        {steps.map((step, index) => (
          <div className="flex flex-col items-center" key={index}>
            <div className={`w-12 h-12 rounded-full ${getStepIconBackground(step.status)} flex items-center justify-center mb-2`}>
              <i className={`${step.icon} ${step.status === "active" ? "text-primary" : getStatusClass(step.status)} text-xl`}></i>
            </div>
            <div className="text-center">
              <h4 className="font-medium">{step.name}</h4>
              <p className={`text-xs ${getStatusClass(step.status)} flex items-center justify-center mt-1`}>
                <i className={`${getStatusIcon(step.status)} mr-1`}></i>
                {getStatusText(step.status)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Platform Status */}
      <div className="grid grid-cols-4 gap-3">
        {platforms.map((platform, index) => (
          <div className="bg-background rounded p-3 text-center" key={index}>
            <i className={`${platform.icon} text-xl mb-2 ${
              platform.icon.includes('youtube') ? 'text-[#FF0000]' : 
              platform.icon.includes('instagram') ? 'text-[#E1306C]' : ''
            }`}></i>
            <h5 className="text-sm font-medium">{platform.name}</h5>
            <p className={`text-xs ${getStatusClass(platform.status)} mt-1`}>
              {getStatusText(platform.status)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
