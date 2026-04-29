import { useState } from "react";
import {
  FaShare, FaTwitter, FaFacebook, FaWhatsapp, FaReddit, FaLink, FaCheck,
} from "react-icons/fa";

function ShareMovie({ movie }) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!movie) return null;

  const shareUrl = `${window.location.origin}/movie/${movie.id}`;
  const shareText = `Check out "${movie.title}" on MovieMint! 🎬`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      setShowMenu(!showMenu);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const socialLinks = [
    {
      name: "Twitter",
      icon: <FaTwitter />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: "#1da1f2",
    },
    {
      name: "Facebook",
      icon: <FaFacebook />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "#4267B2",
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp />,
      url: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
      color: "#25D366",
    },
    {
      name: "Reddit",
      icon: <FaReddit />,
      url: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(movie.title)}`,
      color: "#ff4500",
    },
  ];

  return (
    <div className="relative inline-block">
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-white text-sm font-medium transition-all duration-300 border border-gray-600"
        title="Share this movie"
      >
        <FaShare className="text-purple-400" /> Share
      </button>

      {showMenu && (
        <div className="absolute top-full mt-2 right-0 bg-gray-800 border border-gray-700 rounded-xl p-3 min-w-[200px] shadow-2xl z-50 animate-fadeIn">
          <div className="flex flex-col gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors text-gray-300 hover:text-white text-sm"
                onClick={() => setShowMenu(false)}
              >
                <span style={{ color: link.color }}>{link.icon}</span>
                {link.name}
              </a>
            ))}
            <button
              onClick={copyLink}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors text-gray-300 hover:text-white text-sm w-full border-t border-gray-700 mt-1 pt-3"
            >
              {copied ? (
                <>
                  <FaCheck className="text-green-400" /> Copied!
                </>
              ) : (
                <>
                  <FaLink className="text-gray-400" /> Copy Link
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShareMovie;
