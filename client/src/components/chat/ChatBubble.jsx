import Avatar from "../common/Avatar";
import { useAuth } from "../../context/Authcontext";

const ChatBubble = ({ message, isUser, timestamp }) => {
  const { user } = useAuth();
  const displayName = user?.fullName || user?.username || "You";

  return (
    <div
      className={`flex gap-2.5 animate-slide-up ${isUser ? "flex-row-reverse" : ""}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 mt-auto">
          <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
            <span className="text-white text-sm">🤖</span>
          </div>
        </div>
      )}
      {isUser && (
        <div className="flex-shrink-0 mt-auto">
          <Avatar src={user?.profilePicture} name={displayName} size="sm" />
        </div>
      )}

      <div className={`max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`
            px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
            ${
              isUser
                ? "bg-forest-700 text-white rounded-br-md"
                : "bg-surface-raised text-text-primary rounded-bl-md"
            }
          `}
        >
          {message}
        </div>
        {timestamp && (
          <p
            className={`text-[10px] text-text-muted mt-1 ${isUser ? "text-right" : ""}`}
          >
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
