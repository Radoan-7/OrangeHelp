import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png",
});

const CATEGORY_COLORS = {
  Handyman: "bg-yellow-300 text-yellow-900",
  "Cleaning & Housekeeping": "bg-green-300 text-green-900",
  "Delivery & Errands": "bg-blue-300 text-blue-900",
  "Gardening & Landscaping": "bg-teal-300 text-teal-900",
  "Electrical & Plumbing": "bg-purple-300 text-purple-900",
  "Moving & Packing": "bg-pink-300 text-pink-900",
  "Babysitting & Childcare": "bg-red-300 text-red-900",
  "Pet Care & Walking": "bg-indigo-300 text-indigo-900",
  "Tutoring & Lessons": "bg-gray-300 text-gray-900",
  "Personal Assistance": "bg-orange-300 text-orange-900",
  Other: "bg-gray-400 text-gray-900",
};

const LANGUAGES = {
  en: {
    title: "🤝 I Want to Help",
    skills: "Skills / Services",
    description: "Description",
    price: "Price (optional)",
    category: "Category",
    contactEmail: "Contact Email",
    mobileNumber: "Mobile Number",
    uploadImage: "Upload Image (optional)",
    submitOffer: "🚀 Submit Offer",
    filterLabel: "🔍 For research purposes, helpers can filter their posts below",
    searchPlaceholder: "Search skill or description...",
    activeOffers: "📋 Active Help Offers",
    noOffers: "No offers match your search.",
    sortBy: "Sort by",
    sortOptions: {
      newest: "Newest",
      priceLow: "Price: Low to High",
      priceHigh: "Price: High to Low",
      rating: "Highest Rated",
    },
    writeReview: "Write Review",
    reviews: "Reviews",
    rating: "Skill Star",
    favorite: "Favorite",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    profile: "Profile",
    contactOptions: "Contact Options",
    phone: "Phone",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    chatWithHelper: "Chat with Helper",
    send: "Send",
    enterMessage: "Enter message...",
    expiryDate: "Expiry Date",
    expiredLabel: "Expired",
  },
};

function StarRating({ rating, setRating, editable = false }) {
  const [hover, setHover] = useState(0);
  return (
    <div
      className="flex space-x-1"
      role="radiogroup"
      aria-label="Rating"
      style={{ lineHeight: 1, fontSize: "1.5rem" }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => editable && setRating(star)}
          onMouseEnter={() => editable && setHover(star)}
          onMouseLeave={() => editable && setHover(0)}
          aria-checked={rating === star}
          role="radio"
          tabIndex={editable ? 0 : -1}
          className={`select-none leading-none ${
            star <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded`}
          style={{ verticalAlign: "middle", fontSize: "1.8rem", lineHeight: 1 }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function WantToHelp() {
  const [lang, setLang] = useState("en");
  const t = LANGUAGES[lang];

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Handyman");
  const [contact, setContact] = useState("");
  const [mobile, setMobile] = useState("");
  const [expiry, setExpiry] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [offers, setOffers] = useState(() => {
    try {
      const saved = localStorage.getItem("offers");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [searchCategory, setSearchCategory] = useState("All");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  const [favorites, setFavorites] = useState(() => {
    try {
      const favs = localStorage.getItem("favorites");
      return favs ? JSON.parse(favs) : [];
    } catch {
      return [];
    }
  });

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatScrollRef = useRef(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const [newOfferRating, setNewOfferRating] = useState(0);

  const [views, setViews] = useState(() => {
    try {
      const saved = localStorage.getItem("views");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("offers", JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("views", JSON.stringify(views));
  }, [views]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  function handleView(id) {
    setViews((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!skills || !description || !contact || !mobile) {
      alert("Please fill all required fields including mobile number.");
      return;
    }
    if (newOfferRating === 0) {
      alert("Please give a rating for your offer.");
      return;
    }
    let numericPrice = 0;
    if (price) {
      const priceMatch = price.match(/\d+/);
      numericPrice = priceMatch ? parseInt(priceMatch[0], 10) : 0;
    }

    const newOffer = {
      id: Date.now(),
      skills,
      description,
      price: price || "Free",
      priceNum: numericPrice,
      contact,
      mobile,
      expiry: expiry ? new Date(expiry).getTime() : null,
      imagePreview,
      rating: newOfferRating,
      reviews: [],
      category,
      location: null,
      views: 0,
    };

    setOffers([newOffer, ...offers]);
    setSkills("");
    setDescription("");
    setPrice("");
    setContact("");
    setMobile("");
    setExpiry("");
    setImageFile(null);
    setImagePreview(null);
    setNewOfferRating(0);
  }

  const now = Date.now();
  const filteredOffers = offers
    .filter((offer) => {
      if (offer.expiry && offer.expiry < now) return false;
      const matchCategory =
        searchCategory === "All" || offer.category === searchCategory;
      const matchKeyword =
        offer.skills.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchKeyword.toLowerCase());
      return matchCategory && matchKeyword;
    })
    .sort((a, b) => {
      if (sortOption === "newest") return b.id - a.id;
      if (sortOption === "priceLow") return (a.priceNum || 0) - (b.priceNum || 0);
      if (sortOption === "priceHigh") return (b.priceNum || 0) - (a.priceNum || 0);
      if (sortOption === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  function toggleFavorite(id) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  function addReview(offerId, rating, text) {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === offerId
          ? {
              ...o,
              reviews: [...o.reviews, { rating, text, date: Date.now() }],
              rating:
                ((o.rating * o.reviews.length + rating) /
                  (o.reviews.length + 1)) || rating,
            }
          : o
      )
    );
  }

  function openChat(offer) {
    setChatMessages([
      { from: "helper", text: `Hi! How can I help you with ${offer.skills}?` },
    ]);
    setChatOpen(true);
  }

  function sendMessage() {
    if (!chatInput.trim()) return;
    setChatMessages((msgs) => [...msgs, { from: "user", text: chatInput }]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((msgs) => [
        ...msgs,
        { from: "helper", text: "Thanks for reaching out! I'll get back to you soon." },
      ]);
    }, 1500);
  }

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  function openProfile(offer) {
    setProfileData(offer);
    setProfileOpen(true);
  }

  function onImageChange(e) {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  }

  return (
    <div
      className={`min-h-screen p-6 max-w-6xl mx-auto font-[Poppins] ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-gradient-to-br from-orange-50 to-white"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-orange-700 dark:text-orange-400"
        >
          {t.title}
        </motion.h2>
        <button
          onClick={() => setDarkMode((v) => !v)}
          aria-label={darkMode ? t.lightMode : t.darkMode}
          className="px-4 py-2 rounded-full border border-orange-500 text-orange-600 dark:text-orange-300 dark:border-orange-300 hover:bg-orange-500 hover:text-white transition"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className={`${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-orange-200"
        } rounded-2xl shadow-lg p-8 mb-10 border backdrop-blur-md`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="font-semibold mb-1 block" htmlFor="skillsInput">
              {t.skills} <span className="text-red-500">*</span>
            </label>
            <input
              id="skillsInput"
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. Fixing, Cleaning, Delivery"
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none transition"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label className="font-semibold mb-1 block" htmlFor="categorySelect">
              {t.category}
            </label>
            <select
              id="categorySelect"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none transition"
              aria-label="Select service category"
            >
              {Object.keys(CATEGORY_COLORS).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="font-semibold mb-1 block" htmlFor="descInput">
              {t.description} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="descInput"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your skills, availability, etc."
              className="w-full border rounded-xl px-4 py-2 resize-none focus:ring-2 focus:ring-orange-400 outline-none transition"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label className="font-semibold mb-1 block" htmlFor="priceInput">
              {t.price}
            </label>
            <input
              id="priceInput"
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Optional, e.g. $20/hour"
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none transition"
              aria-describedby="priceHelp"
            />
            <small id="priceHelp" className="text-xs text-gray-500 dark:text-gray-400">
              Leave empty if free or negotiable
            </small>
          </div>

          <div>
            <label className="font-semibold mb-1 block" htmlFor="contactEmail">
              {t.contactEmail} <span className="text-red-500">*</span>
            </label>
            <input
              id="contactEmail"
              type="email"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="you@example.com"
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none transition"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label className="font-semibold mb-1 block" htmlFor="mobileNumber">
              {t.mobileNumber} <span className="text-red-500">*</span>
            </label>
            <input
              id="mobileNumber"
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="+1234567890"
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none transition"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label className="font-semibold mb-1 block" htmlFor="expiryDate">
              {t.expiryDate}
            </label>
            <input
              id="expiryDate"
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none transition"
            />
            <small className="text-xs text-gray-500 dark:text-gray-400">
              Optional - when your offer expires
            </small>
          </div>

          <div className="md:col-span-2">
            <label className="font-semibold mb-1 block">{t.rating}</label>
            <StarRating
              rating={newOfferRating}
              setRating={setNewOfferRating}
              editable
            />
          </div>

          <div>
            <label className="font-semibold mb-1 block" htmlFor="imageUpload">
              {t.uploadImage}
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="w-full"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 max-h-36 rounded-lg object-cover"
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition"
        >
          {t.submitOffer}
        </button>
      </motion.form>

      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          aria-label="Search skills or description"
          className="w-full md:w-1/2 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none transition"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <select
          aria-label="Filter by category"
          className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none transition"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {Object.keys(CATEGORY_COLORS).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          aria-label="Sort offers"
          className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none transition"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          {Object.entries(t.sortOptions).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <motion.div layout>
        <h3 className="text-3xl font-bold text-orange-700 dark:text-orange-400 mb-6">
          {t.activeOffers}
        </h3>
        {filteredOffers.length === 0 ? (
          <p className="text-orange-600 dark:text-orange-300">{t.noOffers}</p>
        ) : (
          <ul className="grid gap-8 md:grid-cols-2">
            <AnimatePresence>
              {filteredOffers.map((offer) => {
                const {
                  id,
                  skills,
                  description,
                  price,
                  contact,
                  mobile,
                  category,
                  expiry,
                  imagePreview,
                  rating,
                  reviews,
                } = offer;
                const isExpired = expiry && expiry < now;
                const isFavorite = favorites.includes(id);

                return (
                  <motion.li
                    key={id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    onClick={() => {
                      handleView(id);
                      openProfile(offer);
                    }}
                    className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-orange-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-2xl transition`}
                    aria-label={`Offer for ${skills} in ${category}`}
                  >
                    {isExpired && (
                      <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-semibold text-xs z-20">
                        {t.expiredLabel}
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(id);
                      }}
                      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                      className={`absolute top-4 left-4 text-2xl transition ${
                        isFavorite ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400"
                      }`}
                    >
                      ★
                    </button>

                    <span
                      className={`inline-block px-3 py-1 rounded-full font-semibold text-xs ${
                        CATEGORY_COLORS[category] || "bg-gray-300 text-gray-900"
                      }`}
                    >
                      {category}
                    </span>

                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt={`Offer for ${skills}`}
                        className="w-full max-h-48 object-cover rounded-lg my-3"
                        loading="lazy"
                      />
                    )}

                    <h4 className="text-2xl font-bold mt-3 text-orange-900 dark:text-orange-300">
                      {skills}
                    </h4>

                    <p className="mt-1 text-orange-800 dark:text-orange-400">{description}</p>

                    <p className="mt-2 text-sm font-semibold text-orange-600 dark:text-orange-300">
                      Price: {price}
                    </p>

                    <div
                      className="mt-2 text-sm flex flex-wrap gap-4 text-orange-700 dark:text-orange-200"
                      aria-label={t.contactOptions}
                    >
                      <a href={`mailto:${contact}`} className="underline hover:text-orange-500">
                        {contact}
                      </a>
                      <a
                        href={`tel:${mobile}`}
                        className="underline hover:text-orange-500"
                        aria-label={`${t.phone}: ${mobile}`}
                      >
                        {mobile}
                      </a>
                      <a
                        href={`https://wa.me/${mobile.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-green-600"
                        aria-label={`${t.whatsapp} ${mobile}`}
                      >
                        WhatsApp
                      </a>
                      <a
                        href={`https://t.me/${mobile.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-500"
                        aria-label={`${t.telegram} ${mobile}`}
                      >
                        Telegram
                      </a>
                    </div>

                    <div className="flex items-center space-x-2 mt-3">
                      <StarRating rating={Math.round(rating)} />
                      <span className="text-sm text-orange-600 dark:text-orange-400">
                        ({reviews.length} {t.reviews})
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openProfile(offer);
                        }}
                        className="px-4 py-2 rounded-lg bg-orange-400 hover:bg-orange-500 text-white font-semibold transition"
                      >
                        {t.profile}
                      </button>

                      <ReviewModalButton offer={offer} addReview={addReview} />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openChat(offer);
                        }}
                        className="px-4 py-2 rounded-lg bg-green-400 hover:bg-green-500 text-white font-semibold transition"
                      >
                        {t.chatWithHelper}
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 select-none">
                      👁️ Viewed {views[id] || 0} times
                    </p>

                    {offer.location && (
                      <div className="mt-4 h-40 rounded-lg overflow-hidden">
                        <MapContainer
                          center={[offer.location.lat, offer.location.lng]}
                          zoom={13}
                          scrollWheelZoom={false}
                          style={{ height: "100%", width: "100%" }}
                          aria-label="Helper location map"
                        >
                          <TileLayer
                            attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <Marker position={[offer.location.lat, offer.location.lng]}>
                            <Popup>{skills}</Popup>
                          </Marker>
                        </MapContainer>
                      </div>
                    )}
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </motion.div>

      <AnimatePresence>
        {profileOpen && profileData && (
          <motion.div
            key="profileModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-6 z-50"
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
              className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 relative shadow-lg"
            >
              <button
                onClick={() => setProfileOpen(false)}
                aria-label="Close profile modal"
                className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 hover:text-red-600 text-2xl font-bold"
              >
                ×
              </button>
              <h3 className="text-3xl font-bold mb-4 text-orange-700 dark:text-orange-400">
                {profileData.skills}
              </h3>
              <p className="mb-4 text-gray-800 dark:text-gray-300">{profileData.description}</p>
              <p>
                <strong>{t.category}:</strong> {profileData.category}
              </p>
              <p>
                <strong>{t.price}:</strong> {profileData.price}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${profileData.contact}`} className="underline">
                  {profileData.contact}
                </a>
              </p>
              <p>
                <strong>Mobile:</strong>{" "}
                <a href={`tel:${profileData.mobile}`} className="underline">
                  {profileData.mobile}
                </a>
              </p>
              {profileData.imagePreview && (
                <img
                  src={profileData.imagePreview}
                  alt="Helper upload"
                  className="mt-4 max-h-48 rounded-lg w-full object-cover"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chatOpen && (
          <motion.div
            key="chatModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex flex-col justify-end p-4 z-50"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              className="bg-white dark:bg-gray-800 rounded-t-3xl p-4 max-w-md w-full mx-auto flex flex-col"
              style={{ maxHeight: "70vh" }}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xl font-semibold text-orange-700 dark:text-orange-400">
                  {t.chatWithHelper}
                </h4>
                <button
                  onClick={() => setChatOpen(false)}
                  aria-label="Close chat"
                  className="text-2xl font-bold text-gray-700 dark:text-gray-300"
                >
                  ×
                </button>
              </div>

              <div
                ref={chatScrollRef}
                className="flex-grow overflow-auto border border-orange-300 rounded p-2 bg-orange-50 dark:bg-gray-900"
                aria-live="polite"
              >
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`mb-2 max-w-[80%] p-2 rounded ${
                      msg.from === "user"
                        ? "bg-orange-400 text-white self-end"
                        : "bg-gray-200 dark:bg-gray-700 self-start text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="mt-2 flex space-x-2"
              >
                <input
                  type="text"
                  aria-label={t.enterMessage}
                  placeholder={t.enterMessage}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-grow rounded-xl border border-orange-300 dark:border-gray-600 px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                />
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 rounded-xl font-semibold"
                >
                  {t.send}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReviewModalButton({ offer, addReview }) {
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [text, setText] = React.useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }
    addReview(offer.id, rating, text);
    setOpen(false);
    setRating(0);
    setText("");
  }

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-semibold transition"
        aria-haspopup="dialog"
      >
        Write Review
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="reviewModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-6 z-50"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
              className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 relative shadow-lg"
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Close review modal"
                className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 hover:text-red-600 text-2xl font-bold"
              >
                ×
              </button>
              <h3 className="text-3xl font-bold mb-4 text-yellow-700 dark:text-yellow-400">
                Write a Review
              </h3>
              <form onSubmit={handleSubmit}>
                <label className="font-semibold block mb-2">Rating</label>
                <StarRating rating={rating} setRating={setRating} editable />
                <label className="font-semibold block mt-4 mb-2" htmlFor="reviewText">
                  Review
                </label>
                <textarea
                  id="reviewText"
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2 resize-none focus:ring-2 focus:ring-yellow-400 outline-none transition"
                  placeholder="Write your review here..."
                />
                <button
                  type="submit"
                  className="mt-6 px-6 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-bold transition"
                >
                  Submit
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
