// SwipeRecords.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { User, Heart, Users, UserCircle } from "lucide-react";
import Button from "../ui/button";
import { Card } from "../ui/card";
import AuthService from '../../services/authService';
import { useNavigate } from 'react-router-dom';

export default function SwipeRecords() {
  const [uname, setUsername] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [userData, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [tab, setTab] = useState("main");
  const rocketContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          console.log('Current User:', currentUser);
          setUser(currentUser);
          try {
            const res = await fetch(`https://hackmate-rv8q.onrender.com/api/users?uuid=${currentUser.uid}`);
            const json = await res.json();

            if (res.status === 200) {
              const username = json.username;

              if (!username || username.trim() === "") {
                setShowPopup(true); // Show popup to enter Commudle username
              } else {
                const res = await fetch(`https://json.commudle.com/api/v2/users?username=${username}`);
                const json = await res.json();
                if (json.status === 200 && json.data) {
                  //setUserData(json.data); // Update userdata with username of commudle, and trigger hacker profile update
                  const userTags = json.data.tags.map(tag => tag.name.toLowerCase());
                  matchProfiles(userTags); // Start Swiping
                  setShowPopup(false);
                } else {
                  console.log("User not found. Try again!");
                  setShowPopup(true);
                }
              }
            } else {
              console.log("User not found. Try again!");
              setShowPopup(true);
            }
          } catch (e) {
            console.log("Something went wrong");
            console.error(e);
            setShowPopup(true);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setShowPopup(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);


  const handleLogout = async () => {
    try {
        const result = await AuthService.logout();
  
        if (result.success) {
          setSuccess(true);
          console.log('User Logged Out', result.user);
          navigate('/');
          // Navigate or notify the user to verify their email
        } else {
          setError(result.error.message);
        }
      } catch (err) {
        setError('An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
  };

  const fetchProfile = async (uname) => {
    try {
      const res = await fetch(`https://json.commudle.com/api/v2/users?username=${uname}`);
      const json = await res.json();
      if (json.status === 200 && json.data) {
        //setUserData(json.data); // Update userdata with username of commudle, and trigger hacker profile update
        const userTags = json.data.tags.map(tag => tag.name.toLowerCase());
        matchProfiles(userTags); // Start Swiping
        setShowPopup(false);
      } else {
        console.log("User not found. Try again!");
      }
    } catch (e) {
      console.log("Error fetching Matches");
      setShowPopup(false);
    }
  };
  const matchProfiles = async (userTags) => {
    try {
      // Make API request
      const res = await fetch("https://hackmate-rv8q.onrender.com/api/hackers/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tags: userTags }), // send tags in body
      });

      if (!res.ok) {
        throw new Error("Failed to fetch matched profiles");
      }

      const data = await res.json();
      // Optionally, you can sort by matchScore if API doesn't already sort
      const sorted = data.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

      // Set recommended users
      setRecommended(sorted);
    } catch (error) {
      console.error("Error matching profiles:", error);
    }
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
              value={uname}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. gdg-noida"
              className="w-full bg-[#1E1E1E] border border-[#333] text-gray-100 placeholder-gray-500 p-2 rounded-lg mb-3 focus:outline-none focus:border-[#FF8C00]"
            />
            <Button className="w-full bg-[#FF8C00] hover:bg-[#FFA733] text-black font-semibold" onClick={fetchProfile(uname)}>
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
              
                <h2 className="text-xl font-semibold">{recommended[0].name}</h2>
                <p className="text-gray-300 text-sm mb-3">{recommended[0].bio}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {recommended[0].tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="bg-[#FF8C00]/20 text-[#FFA733] text-xs px-2 py-1 rounded-full backdrop-blur-sm"
                    >
                      #{tag.name}
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

      {/* Profile Tab */}
      {tab === "profile" && userData && (
        <div className="flex-1 p-4 z-10 flex flex-col items-center">
          <Card className="w-80 p-4 flex flex-col items-center backdrop-blur-lg bg-white/2 border border-white/20">
            <img
              src={userData.photoURL || "/default-avatar.png"}
              alt={userData.displayName || "User"}
              className="w-24 h-24 rounded-full mb-4 border-2 border-[#FF8C00]"
            />
            <h2 className="text-xl font-semibold text-gray-100 mb-1">
              {userData.displayName || "Anonymous"}
            </h2>
            <p className="text-gray-300 text-sm mb-2">{userData.bio || "No bio available"}</p>

            {/* Hacker profile info */}
            {recommended.length > 0 && (
              <>
                <div className="flex flex-wrap gap-2 mb-3 justify-center">
                  {recommended[0].tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#FF8C00]/20 text-[#FFA733] text-xs px-2 py-1 rounded-full backdrop-blur-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="text-gray-400 text-xs mb-3">{recommended[0].about || recommended[0].bio}</p>
              </>
            )}

            <Button
              className="bg-[#FF8C00] hover:bg-[#FFA733] text-black font-semibold w-full"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Card>
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
