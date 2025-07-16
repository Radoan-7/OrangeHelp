import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ClipboardList,
  Handshake,
  UserCircle,
  Edit3,
  Award,
  Search,
  Sun,
  Moon,
} from "lucide-react";

function ConfettiBurst({ trigger }) {
  const confettiCount = 20;
  const confettiColors = [
    "#f59e0b",
    "#d97706",
    "#fbbf24",
    "#f97316",
    "#ea580c",
    "#facc15",
  ];

  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full pointer-events-none"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
        >
          {[...Array(confettiCount)].map((_, i) => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight * 0.5;
            const color = confettiColors[i % confettiColors.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 1, x, y: y - 10, rotate: 0 }}
                animate={{
                  y: y + 100 + Math.random() * 200,
                  x: x + (Math.random() - 0.5) * 200,
                  opacity: 0,
                  scale: 0.5,
                  rotate: 360,
                }}
                transition={{ duration: 2, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  width: 10,
                  height: 10,
                  backgroundColor: color,
                  borderRadius: 3,
                  pointerEvents: "none",
                  zIndex: 9999,
                }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const BADGES = [
  {
    id: 1,
    name: "First Help",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        fill="none"
        viewBox="0 0 24 24"
        stroke="#fbbf24"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7l3-7z" />
      </svg>
    ),
    color: "#fbbf24",
  },
  {
    id: 2,
    name: "Consistent Helper",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        fill="none"
        viewBox="0 0 24 24"
        stroke="#f59e0b"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    color: "#f59e0b",
  },
  {
    id: 3,
    name: "Community Star",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        fill="#fbbf24"
        viewBox="0 0 24 24"
      >
        <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ),
    color: "#fbbf24",
  },
];

export default function Dashboard() {
  const [helpRequests, setHelpRequests] = useState([]);
  const [servicesOffered, setServicesOffered] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [xp, setXp] = useState(2450);
  const [level, setLevel] = useState(5);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  const user = {
    name: "Radoan",
    avatarUrl: "",
  };

  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem("myHelpRequests")) || [];
    const storedServices = JSON.parse(localStorage.getItem("myServicesOffered")) || [];
    const storedNotifications = JSON.parse(localStorage.getItem("myNotifications")) || [];
    const storedActivity = JSON.parse(localStorage.getItem("myRecentActivity")) || [];

    setHelpRequests(storedRequests);
    setServicesOffered(storedServices);
    setNotifications(storedNotifications);
    setRecentActivity(storedActivity);
  }, []);

  const xpForNextLevel = (lvl) => 1000 + lvl * 750;
  const xpNextLevel = xpForNextLevel(level);
  const xpProgressPercent = Math.min(100, (xp / xpNextLevel) * 100);

  const filteredHelpRequests = useMemo(() => {
    if (!searchTerm.trim()) return helpRequests;
    const lower = searchTerm.toLowerCase();
    return helpRequests.filter(
      ({ title, description, category }) =>
        title.toLowerCase().includes(lower) ||
        description.toLowerCase().includes(lower) ||
        category.toLowerCase().includes(lower)
    );
  }, [searchTerm, helpRequests]);

  const toggleDarkMode = () => {
    setDarkMode((d) => !d);
  };

  const badgesRef = useRef(false);
  useEffect(() => {
    if (!badgesRef.current && BADGES.length > 0) {
      badgesRef.current = true;
      setShowConfetti(true);
      const timeout = setTimeout(() => setShowConfetti(false), 2500);
      return () => clearTimeout(timeout);
    }
  }, []);

  const sectionCardClasses =
    "bg-white border border-orange-300 rounded-xl p-8 shadow-md mb-10";

  const sectionHeaderClasses =
    "text-3xl font-bold text-orange-700 mb-4 border-b-2 border-orange-300 pb-2";

  return (
    <div
      className={`min-h-screen p-6 sm:p-10 font-[Poppins] transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-orange-300"
          : "bg-white text-orange-900"
      }`}
    >
      <ConfettiBurst trigger={showConfetti} />

      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="User Avatar"
              className="w-14 h-14 rounded-full object-cover border-2 border-orange-400"
            />
          ) : (
            <UserCircle size={56} className="text-orange-500" />
          )}
          <div>
            <p className="text-lg font-semibold">
              Welcome back, <span className="capitalize">{user.name}</span> 👋
            </p>
            <button
              className="text-sm text-orange-600 hover:text-orange-800 flex items-center gap-1"
              onClick={() => alert("Edit Profile feature coming soon!")}
              aria-label="Edit Profile"
            >
              <Edit3 size={16} /> Edit Profile
            </button>
          </div>
        </div>
        <button
          onClick={toggleDarkMode}
          aria-label="Toggle Dark Mode"
          className="p-2 rounded-full bg-orange-200 hover:bg-orange-300 transition"
        >
          {darkMode ? (
            <Sun size={24} className="text-orange-300" />
          ) : (
            <Moon size={24} className="text-orange-600" />
          )}
        </button>
      </header>

      <section className="mb-12 max-w-4xl mx-auto bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
          🎮 Your Progress - Level {level}
        </h2>

        <div className="relative w-full h-8 bg-orange-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpProgressPercent}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
          />
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-orange-900 select-none pointer-events-none">
            {xp} XP / {xpNextLevel} XP
          </span>
        </div>
      </section>

      <section className={sectionCardClasses + " max-w-3xl mx-auto"}>
        <label
          htmlFor="searchHelp"
          className="block mb-4 font-semibold text-2xl text-center text-orange-700"
        >
          🔎 Search Your Help Requests
        </label>
        <div className="relative max-w-md mx-auto w-full">
          <input
            type="search"
            id="searchHelp"
            placeholder="Search by title, description or category"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={20} className="absolute top-3.5 left-3 text-orange-400" />
        </div>
      </section>

      <section className={sectionCardClasses}>
        <h2 className={sectionHeaderClasses}>
          <ClipboardList className="inline text-orange-600 mr-2" />
          Your Help Requests
        </h2>
        {filteredHelpRequests.length === 0 ? (
          <p className="italic text-orange-700">No help requests match your search.</p>
        ) : (
          <ul className="grid md:grid-cols-2 gap-6">
            {filteredHelpRequests.map(({ id, title, description, category }, idx) => (
              <li
                key={id || idx}
                className="bg-white border border-orange-200 rounded-xl p-5 shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-orange-900">{title}</h3>
                <p className="text-orange-700">{description}</p>
                <span className="inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-orange-300 to-orange-200 text-orange-900 shadow-sm select-none">
                  {category}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={sectionCardClasses}>
        <h2 className={sectionHeaderClasses}>
          <Handshake className="inline text-orange-600 mr-2" />
          Your Offered Services
        </h2>
        {servicesOffered.length === 0 ? (
          <p className="italic text-orange-700">You haven't offered any services yet.</p>
        ) : (
          <ul className="grid md:grid-cols-2 gap-6">
            {servicesOffered.map(({ id, skills, description, category }, idx) => (
              <li
                key={id || idx}
                className="bg-white border border-orange-200 rounded-xl p-5 shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-orange-900">{skills}</h3>
                <p className="text-orange-700">{description}</p>
                <span className="inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-orange-300 to-orange-200 text-orange-900 shadow-sm select-none">
                  {category}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={sectionCardClasses}>
        <h2 className={sectionHeaderClasses}>
          <Award className="inline text-orange-600 mr-2" />
          Your Badges
        </h2>
        {BADGES.length === 0 ? (
          <p className="italic text-orange-700">No badges earned yet.</p>
        ) : (
          <div className="relative flex flex-wrap justify-center gap-10 p-6">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-xl bg-gradient-to-tr from-yellow-300 via-yellow-400 to-yellow-200 opacity-30 blur-3xl animate-pulse pointer-events-none"
              style={{ filter: "drop-shadow(0 0 10px #facc15)" }}
            />

            {BADGES.map(({ id, name, icon, color }) => (
              <motion.div
                key={id}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 12, delay: id * 0.2 }}
                whileHover={{ scale: 1.1, boxShadow: `0 0 16px 4px ${color}` }}
                className="relative z-10 flex flex-col items-center cursor-pointer select-none"
                title={name}
                style={{ width: 100 }}
              >
                <div
                  className="rounded-full p-5 bg-gradient-to-tr from-yellow-400 to-yellow-300 shadow-lg flex items-center justify-center"
                  style={{ boxShadow: `0 0 16px 4px ${color}`, width: 72, height: 72 }}
                >
                  {icon}
                </div>
                <span className="mt-3 font-semibold text-orange-900 text-center">
                  {name}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className={sectionCardClasses}>
        <h2 className={sectionHeaderClasses}>
          <Bell className="inline text-orange-600 mr-2" />
          Recent Activity
        </h2>
        {recentActivity.length === 0 ? (
          <p className="italic text-orange-700">No recent activity.</p>
        ) : (
          <ul className="space-y-4">
            {recentActivity.map(({ id, message, timestamp }, idx) => (
              <li
                key={id || idx}
                className="bg-white border border-orange-200 rounded-xl p-4 shadow-sm text-orange-800"
              >
                <p>{message}</p>
                <time className="text-xs text-orange-500 block mt-1">
                  {new Date(timestamp).toLocaleString()}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
