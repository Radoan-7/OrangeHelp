import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, MessageSquare, Edit3 } from "lucide-react";
import WantToHelp from "./WantToHelp";
import NeedHelp from "./NeedHelp";
import Dashboard from "./Dashboard";

function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler]);
}

function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [hasNew, setHasNew] = useState(true);
  const bellRef = useRef();

  const alerts = [
    "📢 Sarah requested help for cleaning.",
    "🛠️ Mike offered handyman services.",
    "🎉 Emily joined the community.",
    "🔗 3 new connections made today!",
  ];

  useClickOutside(bellRef, () => setOpen(false));

  const toggleBell = () => {
    setOpen(!open);
    setHasNew(false);
  };

  return (
    <div ref={bellRef} className="mb-4 relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleBell}
        className="relative bg-white/30 backdrop-blur-md p-3 rounded-full shadow-lg hover:shadow-xl transition border border-orange-200"
        aria-label="View Notifications"
      >
        <Bell className="w-6 h-6 text-orange-800" />
        {hasNew && (
          <>
            <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
            <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500"></span>
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mt-3 bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-4 w-72 text-orange-800 text-sm border border-orange-100"
          >
            <h4 className="font-bold mb-3 text-orange-900">🔔 Recent Alerts</h4>
            <ul className="space-y-2 max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-100">
              {alerts.map((alert, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start bg-orange-50/50 p-2 rounded-lg hover:bg-orange-100 transition"
                >
                  <span className="text-lg mr-2">📣</span>
                  <span>{alert}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MessagesButton() {
  const [open, setOpen] = useState(false);
  const [hasNew, setHasNew] = useState(true);
  const msgRef = useRef();

  const messages = [
    "👋 Hi! Can you help me with my garden?",
    "🧹 Is cleaning service available this weekend?",
    "🔧 I need a quick handyman for fixing a door.",
  ];

  useClickOutside(msgRef, () => setOpen(false));

  const toggleMessages = () => {
    setOpen(!open);
    setHasNew(false);
  };

  return (
    <div ref={msgRef} className="mb-4 relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMessages}
        className="relative bg-white/30 backdrop-blur-md p-3 rounded-full shadow-lg hover:shadow-xl transition border border-orange-200"
        aria-label="View Messages"
      >
        <MessageSquare className="w-6 h-6 text-orange-800" />
        {hasNew && (
          <>
            <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
            <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500"></span>
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mt-3 bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-4 w-72 text-orange-800 text-sm border border-orange-100"
          >
            <h4 className="font-bold mb-3 text-orange-900">✉️ Recent Messages</h4>
            <ul className="space-y-2 max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-100">
              {messages.map((msg, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start bg-orange-50/50 p-2 rounded-lg hover:bg-orange-100 transition"
                >
                  <span className="text-lg mr-2">💬</span>
                  <span>{msg}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [hasNew, setHasNew] = useState(true);
  const fbRef = useRef();

  const feedbacks = [
    "👍 Great platform, easy to use!",
    "💡 Add dark mode feature please.",
    "🐞 Found a bug in the dashboard.",
  ];

  useClickOutside(fbRef, () => setOpen(false));

  const toggleFeedback = () => {
    setOpen(!open);
    setHasNew(false);
  };

  return (
    <div ref={fbRef} className="mb-4 relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleFeedback}
        className="relative bg-white/30 backdrop-blur-md p-3 rounded-full shadow-lg hover:shadow-xl transition border border-orange-200"
        aria-label="View Feedback"
      >
        <Edit3 className="w-6 h-6 text-orange-800" />
        {hasNew && (
          <>
            <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
            <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-red-500"></span>
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mt-3 bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-4 w-72 text-orange-800 text-sm border border-orange-100"
          >
            <h4 className="font-bold mb-3 text-orange-900">📝 Recent Feedback</h4>
            <ul className="space-y-2 max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-100">
              {feedbacks.map((fb, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start bg-orange-50/50 p-2 rounded-lg hover:bg-orange-100 transition"
                >
                  <span className="text-lg mr-2">🗒️</span>
                  <span>{fb}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HelperCard({ helper, index }) {
  const initials = helper.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      tabIndex={0}
      className="bg-gradient-to-tr from-orange-200 to-orange-100 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center
                 hover:scale-105 transition-transform duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-orange-400"
      aria-label={`Top helper ${index + 1}: ${helper.name}, rating ${helper.rating} stars`}
    >
      <div
        className="bg-orange-400 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-3 select-none"
        aria-hidden="true"
      >
        {initials}
      </div>

      <div className="text-xl font-bold text-orange-900 mb-2">
        {index + 1}. {helper.name}
      </div>

      <div
        className="flex items-center space-x-1 text-yellow-400 font-semibold mb-1"
        aria-label={`${helper.rating} out of 5 stars`}
      >
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${
                i < Math.floor(helper.rating)
                  ? "fill-current"
                  : "stroke-current stroke-2"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill={i < Math.floor(helper.rating) ? "currentColor" : "none"}
              stroke="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.973c.3.92-.755 1.688-1.54 1.118L10 13.347l-3.38 2.455c-.785.57-1.84-.197-1.54-1.118l1.287-3.973a1 1 0 00-.364-1.118L3.623 9.4c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.974z" />
            </svg>
          ))}
      </div>

      <div className="text-sm text-orange-600 mb-3">{helper.services} services</div>

      <button
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        onClick={() => alert(`Contacting ${helper.name}...`)}
        aria-label={`Contact ${helper.name}`}
      >
        Contact
      </button>
    </div>
  );
}

function Home() {
  const topHelpers = [
    { name: "Emily Davis", rating: 4.9, reviews: 15, services: 2 },
    { name: "Sarah Johnson", rating: 4.8, reviews: 12, services: 5 },
    { name: "Mike Chen", rating: 4.6, reviews: 8, services: 3 },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 p-6 flex flex-col items-center justify-center space-y-10 relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/orange-peel.png')",
      }}
    >
      <div className="fixed top-6 left-6 z-50 flex flex-col items-center">
        <NotificationsBell />
        <MessagesButton />
        <FeedbackButton />
      </div>

      <div className="fixed top-6 right-6 z-50 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-1 shadow-md">
        <button
          className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700
                     text-white font-semibold px-6 py-2.5 rounded-full shadow-lg
                     focus:outline-none focus:ring-4 focus:ring-orange-400 transition transform
                     hover:scale-105 active:scale-95
                     drop-shadow-md"
          onClick={() => alert("Login feature coming soon!")}
          aria-label="Login to your account"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.121 17.804A13.937 13.937 0 0112 15c2.761 0 5.294.892 7.378 2.42M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>Login</span>
        </button>
      </div>

      <header className="flex items-center space-x-4 z-10 select-none">
        <img
          src="https://cdn-icons-png.flaticon.com/512/721/721098.png"
          alt="Orange Logo"
          className="w-14 h-14 animate-bounce"
        />
        <h1 className="text-5xl font-extrabold text-orange-900">OrangeHelp</h1>
      </header>

      <p className="text-xl font-semibold italic text-orange-700 tracking-wide text-center max-w-lg z-10">
        Connecting communities through helping hands.
      </p>

      <nav className="flex flex-col md:flex-row md:space-x-16 space-y-8 md:space-y-0 mt-8 items-center z-10">
        <Link
          to="/need-help"
          className="w-80 h-40 bg-gradient-to-br from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700
                     text-white text-2xl font-extrabold rounded-3xl shadow-lg shadow-orange-400/60
                     flex flex-col justify-center items-center text-center
                     transition transform hover:scale-105 active:scale-95 duration-300
                     ring-4 ring-orange-300 hover:ring-orange-400 focus:outline-none focus:ring-offset-2 focus:ring-offset-white
                     cursor-pointer select-none"
          aria-label="I Need Help - Post a request or browse available helpers"
        >
          <div>I Need Help</div>
          <div className="text-sm font-normal text-orange-200 mt-3 max-w-[210px]">
            Post a request or browse available helpers.
          </div>
        </Link>

        <Link
          to="/want-to-help"
          className="w-80 h-40 bg-gradient-to-br from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700
                     text-white text-2xl font-extrabold rounded-3xl shadow-lg shadow-orange-400/60
                     flex flex-col justify-center items-center text-center
                     transition transform hover:scale-105 active:scale-95 duration-300
                     ring-4 ring-orange-300 hover:ring-orange-400 focus:outline-none focus:ring-offset-2 focus:ring-offset-white
                     cursor-pointer select-none"
          aria-label="I Want to Help - Offer your services to the community"
        >
          <div>I Want to Help</div>
          <div className="text-sm font-normal text-orange-200 mt-3 max-w-[210px]">
            Offer your services to the community.
          </div>
        </Link>
      </nav>

      <Link
        to="/dashboard"
        className="mt-8 inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600
                   hover:from-orange-600 hover:to-orange-700 text-white rounded-3xl font-extrabold shadow-lg
                   hover:shadow-orange-400/70 transition transform hover:scale-105 active:scale-95 duration-300
                   ring-4 ring-orange-300 hover:ring-orange-400 focus:outline-none focus:ring-offset-2 focus:ring-offset-white
                   cursor-pointer select-none z-10"
        aria-label="Go to your dashboard"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" />
        </svg>
        Go to Dashboard
      </Link>

      <section className="mt-10 bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl z-10">
        <h2 className="text-3xl font-extrabold text-orange-800 mb-6 text-center select-none">
          🏆 Top Helpers
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {topHelpers.map((helper, index) => (
            <HelperCard helper={helper} index={index} key={index} />
          ))}
        </div>
      </section>

      <section className="mt-6 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6 z-10">
        <div
          className="flex flex-col items-center bg-orange-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow cursor-default select-none"
          aria-label="Connections made"
        >
          <div className="text-orange-500 text-4xl mb-2 animate-pulse" aria-hidden="true">
            🔗
          </div>
          <p className="text-orange-700 font-semibold text-lg">3+ Connections Made</p>
        </div>
        <div
          className="flex flex-col items-center bg-orange-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow cursor-default select-none"
          aria-label="Community members"
        >
          <div className="text-orange-500 text-4xl mb-2 animate-pulse" aria-hidden="true">
            👥
          </div>
          <p className="text-orange-700 font-semibold text-lg">3+ Community Members</p>
        </div>
        <div
          className="flex flex-col items-center bg-orange-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow cursor-default select-none"
          aria-label="Average rating"
        >
          <div className="text-orange-500 text-4xl mb-2 animate-pulse" aria-hidden="true">
            ⭐
          </div>
          <p className="text-orange-700 font-semibold text-lg">4.7 Average Rating</p>
        </div>
      </section>

      <footer className="mt-8 text-center text-orange-600 font-medium select-none z-10">
        Made by <span className="font-bold">♦️Radoan</span>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/want-to-help" element={<WantToHelp />} />
      <Route path="/need-help" element={<NeedHelp />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
