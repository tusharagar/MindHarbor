import {
  BookOpen,
  Headphones,
  Video,
  Download,
  Wifi,
  WifiOff,
} from "lucide-react";
import Badge from "../common/Badge";

const iconMap = {
  article: BookOpen,
  audio: Headphones,
  video: Video,
};

const colorMap = {
  article: {
    bg: "bg-forest-800/30",
    text: "text-emerald-400",
    badge: "lavender",
  },
  audio: { bg: "bg-mint-400/10", text: "text-mint-300", badge: "mint" },
  video: { bg: "bg-emerald-400/10", text: "text-emerald-300", badge: "sky" },
};

const ResourceCard = ({ resource }) => {
  const Icon = iconMap[resource.type] || BookOpen;
  const colors = colorMap[resource.type] || colorMap.article;

  const handleDownload = async (e) => {
    e.stopPropagation();

    // If quotes type, create and download a text file
    if (resource.type === "quotes" && resource.quotes) {
      const quotesText = resource.quotes.join("\n\n");
      const blob = new Blob([quotesText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resource.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }

    // For other resource types with file paths
    if (resource.file) {
      try {
        const link = document.createElement("a");
        link.href = `/${resource.file}`;
        link.download = resource.file.split("/").pop();
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Download failed:", error);
        alert("Failed to download the resource. Please try again.");
      }
    }
  };

  return (
    <div className="card-soft p-4 hover:bg-surface-hover/50 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
      {/* Thumbnail placeholder */}
      <div
        className={`w-full h-32 rounded-xl ${colors.bg} flex items-center justify-center mb-3 overflow-hidden`}
      >
        <Icon
          size={32}
          className={`${colors.text} opacity-40 group-hover:scale-110 transition-transform duration-200`}
        />
      </div>

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-text-primary truncate">
            {resource.title}
          </h4>
          <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
            {resource.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <Badge color={colors.badge}>{resource.type}</Badge>
        <span className="text-[11px] text-text-muted">{resource.duration}</span>
        <div className="ml-auto flex items-center gap-1.5">
          {resource.offline ? (
            <WifiOff size={12} className="text-text-muted" />
          ) : (
            <Wifi size={12} className="text-mint-400" />
          )}
          <button
            onClick={handleDownload}
            className="p-1 rounded-lg hover:bg-surface-hover transition-colors"
            title="Download resource"
          >
            <Download
              size={14}
              className="text-text-muted hover:text-emerald-400"
            />
          </button>
        </div>
      </div>

      {resource.mood && (
        <div className="flex gap-1 mt-2">
          {resource.mood.map((m) => (
            <span
              key={m}
              className="text-xs px-2 py-0.5 bg-surface rounded-full text-text-muted"
            >
              {m}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceCard;
