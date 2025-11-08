// SwipeRecords.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { User, Heart, Users, UserCircle } from "lucide-react";
import Button from "../ui/button";
import { Card } from "../ui/card";

export default function SwipeRecords() {
  const [username, setUsername] = useState("");
  const [showPopup, setShowPopup] = useState(true);
  const [userData, setUserData] = useState(null);
  const [matches, setMatches] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [tab, setTab] = useState("main");
  const rocketContainerRef = useRef(null);

  const dummyProfiles = [
    {
      name: "Aditi Sharma",
      about: "Frontend dev & UI enthusiast 🌈",
      tags: ["web development", "ui design", "javascript"],
      img: "https://randomuser.me/api/portraits/women/81.jpg",
    },
    {
      name: "Rohit Singh",
      about: "Linux nerd + backend pro 🧠",
      tags: ["linux", "problem solving", "python"],
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Priya Patel",
      about: "Exploring network security and IoT 🔒",
      tags: ["iot", "network security", "cloud computing"],
      img: "https://randomuser.me/api/portraits/women/55.jpg",
    },
  ];

  const fetchProfile = async () => {
    try {
      const res = await fetch(`https://json.commudle.com/api/v2/users?username=${username}`);
      const json = await res.json();
      if (json.status === 200 && json.data) {
        setUserData(json.data);
        matchProfiles(json.data.tags.map((t) => t.name.toLowerCase()));
        setShowPopup(false);
      } else {
        alert("User not found. Try again!");
      }
    } catch (e) {
      alert("Error fetching Commudle data.");
    }
  };

  const matchProfiles = (userTags) => {
    const scored = dummyProfiles.map((p) => {
      const score = p.tags.filter((tag) => userTags.includes(tag.toLowerCase())).length;
      return { ...p, score };
    });
    const sorted = scored.sort((a, b) => b.score - a.score);
    setRecommended(sorted);
  };

  const handleSwipe = (likedProfile) => {
    setMatches((prev) => [...prev, likedProfile]);
    setRecommended((prev) => prev.slice(1));
  };

  // 🚀 Render rockets only once when component mounts
  useEffect(() => {
    const container = rocketContainerRef.current;
    if (!container) return;

    for (let i = 0; i < 10; i++) {
      const xStart = Math.random() * window.innerWidth;
      const yStart = Math.random() * window.innerHeight;

      const rocket = document.createElement("div");
      rocket.className = "absolute text-3xl select-none";
      rocket.style.left = `${xStart}px`;
      rocket.style.top = `${yStart}px`;
      rocket.style.color = "#FF8C00";
      rocket.style.filter = "drop-shadow(0 0 6px #FF8C00)";
      rocket.textContent = "🚀";

      container.appendChild(rocket);

      const animateRocket = () => {
        rocket.animate(
          [
            { transform: `translate(0, 0) rotate(0deg)`, opacity: 0.5 },
            {
              transform: `translate(${Math.random() * 400 - 200}px, ${
                Math.random() * 400 - 200
              }px) rotate(360deg)`,
              opacity: 1,
            },
          ],
          {
            duration: 4000 + Math.random() * 8000,
            iterations: Infinity,
            direction: "alternate",
            easing: "linear",
          }
        );
      };

      animateRocket();
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#121212] text-gray-100 pb-16 relative overflow-hidden">
      {/* Static Rocket Layer */}
      <div ref={rocketContainerRef} className="absolute inset-0 z-0 overflow-hidden"></div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <Card className="p-6 w-80 backdrop-blur-lg bg-white/2 rounded-2xl border border-[#333]">
            <h2 className="text-lg font-semibold mb-3 text-center text-gray-100">
              Enter Commudle Username
            </h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. gdg-noida"
              className="w-full bg-[#1E1E1E] border border-[#333] text-gray-100 placeholder-gray-500 p-2 rounded-lg mb-3 focus:outline-none focus:border-[#FF8C00]"
            />
            <Button className="w-full bg-[#FF8C00] hover:bg-[#FFA733] text-black font-semibold" onClick={fetchProfile}>
              Continue
            </Button>
          </Card>
        </div>
      )}

      {/* Main Swiping Area */}
      
      {tab === "main" && !showPopup && (
        <div className="flex-1 flex flex-col justify-center items-center p-4 z-10 relative">
            {recommended.length === 0 ? (
                <p className="text-xl font-semibold">You must be Unique 😅</p>
              ) :  (
              
              <motion.div
                key={recommended[0].name}
                className="relative w-80 rounded-3xl shadow-xl p-4 backdrop-blur-lg bg-white/2 border border-white/20"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <img
                  src={recommended[0].img}
                  alt={recommended[0].name}
                  className="rounded-2xl w-full h-64 object-cover mb-4 border border-white/20"
                />
                <h2 className="text-xl font-semibold">{recommended[0].name}</h2>
                <p className="text-gray-300 text-sm mb-3">{recommended[0].about}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {recommended[0].tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#FF8C00]/20 text-[#FFA733] text-xs px-2 py-1 rounded-full backdrop-blur-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-around mt-3">
                  <Button
                    variant="outline"
                    className="border-[#333] text-gray-400 hover:bg-[#1F1F1F]"
                    onClick={() => setRecommended((prev) => prev.slice(1))}
                  >
                    ❌ Pass
                  </Button>
                  <Button
                    className="bg-[#FF8C00] hover:bg-[#FFA733] text-black font-semibold"
                    onClick={() => handleSwipe(recommended[0])}
                  >
                    💖 Like
                  </Button>
                </div>
              </motion.div>
          )}
          </div>
      )}

      {/* Matches Tab */}
      {tab === "matches" && (
        <div className="flex-1 p-4 z-10">
          <h2 className="text-lg font-semibold mb-2">Your Matches</h2>
          {matches.length === 0 ? (
            <p className="text-gray-500 text-sm">No matches yet 😅</p>
          ) : (
            matches.map((m) => (
              <Card key={m.name} className="p-3 mb-3 flex gap-3 items-center bg-white/2 backdrop-blur-md border border-white/20">
                <img src={m.img} alt={m.name} className="w-12 h-12 rounded-full" />
                <div>
                  <h3 className="font-semibold text-gray-100">{m.name}</h3>
                  <p className="text-xs text-gray-400">{m.about}</p>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-[#333] flex justify-around py-2 z-50">
        <button onClick={() => setTab("main")}>
          <Heart className={`w-6 h-6 ${tab === "main" ? "text-[#FF8C00]" : "text-gray-400"}`} />
        </button>
        <button onClick={() => setTab("matches")}>
          <User className={`w-6 h-6 ${tab === "matches" ? "text-[#FF8C00]" : "text-gray-400"}`} />
        </button>
        <button onClick={() => setTab("groups")}>
          <Users className={`w-6 h-6 ${tab === "groups" ? "text-[#FF8C00]" : "text-gray-400"}`} />
        </button>
        <button onClick={() => setTab("profile")}>
          <UserCircle className={`w-6 h-6 ${tab === "profile" ? "text-[#FF8C00]" : "text-gray-400"}`} />
        </button>
      </div>
    </div>
  );
}
