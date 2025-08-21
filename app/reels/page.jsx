"use client";
import Sidebar from "@/components/Feed/SideBar";
import { useState, useEffect, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import {
  FaRegHeart,
  FaCommentDots,
  FaPaperPlane,
  FaMusic,
} from "react-icons/fa";
import { FiVolume2, FiVolumeX } from "react-icons/fi";

export default function ReelsPage() {
  const [muted, setMuted] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);
  const isScrolling = useRef(false);

  const reels = [
    {
      id: 1,
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      caption: "Dance Vibes 💃 #Trending",
      music: "Original Sound - Party Mix",
      likes: "12.3K",
      comments: "1.1K",
      user: {
        name: "dance_star",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
    },
    {
      id: 2,
      video: "https://www.w3schools.com/html/movie.mp4",
      caption: "Golden Hour 🌅 #Aesthetic",
      music: "Original Sound - Chill Beats",
      likes: "45.6K",
      comments: "2.3K",
      user: {
        name: "sunset_lover",
        avatar: "https://randomuser.me/api/portraits/men/28.jpg",
      },
    },
    {
      id: 3,
      video:
        "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      caption: "Skater Life 🛹 #StreetStyle",
      music: "Original Sound - HipHop",
      likes: "78.9K",
      comments: "3.2K",
      user: {
        name: "skater_boy",
        avatar: "https://randomuser.me/api/portraits/men/12.jpg",
      },
    },
  ];

  // Play/pause current video
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === currentIndex) video.play().catch(() => {});
      else video.pause();
    });
  }, [currentIndex]);

  // Handle swipe gestures
  const handlers = useSwipeable({
    onSwipedUp: () => changeReel(1),
    onSwipedDown: () => changeReel(-1),
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
    delta: 10,
  });

  // Handle wheel scroll (desktop)
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      if (isScrolling.current) return; // debounce
      isScrolling.current = true;

      if (e.deltaY > 0) changeReel(1);
      else if (e.deltaY < 0) changeReel(-1);

      setTimeout(() => (isScrolling.current = false), 300);
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  const changeReel = (direction) => {
    setCurrentIndex((prev) => {
      const next = prev + direction;
      if (next < 0) return 0;
      if (next >= reels.length) return reels.length - 1;
      return next;
    });
  };

  return (
    <div className="flex" {...handlers}>
      <Sidebar />
      <div className="flex justify-center items-center bg-black w-full h-screen overflow-hidden relative">
        {reels.map((reel, i) => (
          <div
            key={reel.id}
            className="absolute inset-0 flex justify-center items-center transition-transform duration-300 ease-out"
            style={{ transform: `translateY(${(i - currentIndex) * 100}%)` }}
          >
            <div className="relative w-full max-w-[400px] h-screen sm:h-[calc(100vh)]">
              <video
                ref={(el) => (videoRefs.current[i] = el)}
                src={reel.video}
                muted={muted}
                loop
                playsInline
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />

              <div className="absolute bottom-28 right-3 flex flex-col items-center gap-6 text-white text-xl">
                <button className="flex flex-col items-center">
                  <FaRegHeart />
                  <span className="text-xs mt-1">{reel.likes}</span>
                </button>
                <button className="flex flex-col items-center">
                  <FaCommentDots />
                  <span className="text-xs mt-1">{reel.comments}</span>
                </button>
                <button>
                  <FaPaperPlane />
                </button>
                <div className="mt-4 w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 flex items-center justify-center animate-spin-slow">
                  <FaMusic className="text-white text-lg" />
                </div>
              </div>

              <div className="absolute bottom-14 left-3 right-3 text-white mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={reel.user.avatar}
                    alt="profile"
                    className="w-9 h-9 rounded-full border-2 border-pink-500 object-cover"
                  />
                  <span className="font-semibold text-sm">
                    {reel.user.name}
                  </span>
                  <button className="text-xs text-blue-400 font-medium">
                    Follow
                  </button>
                </div>
                <p className="font-semibold text-sm">{reel.caption}</p>
                <p className="flex items-center gap-1 text-xs opacity-80">
                  <FaMusic /> {reel.music}
                </p>
              </div>

              <button
                onClick={() => setMuted(!muted)}
                className="absolute top-6 right-3 bg-black/50 p-2 rounded-full text-white"
              >
                {muted ? <FiVolumeX /> : <FiVolume2 />}
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
