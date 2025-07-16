import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

function StarRating({ rating, setRating, editable = false }) {
  const [hover, setHover] = useState(0);
  return (
    <div
      className="flex space-x-1 select-none"
      role="radiogroup"
      aria-label="Importance rating"
      style={{ fontSize: "1.5rem", lineHeight: 1 }}
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
          className={`focus:outline-none focus:ring-2 focus:ring-orange-500 rounded ${
            star <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
          }`}
          style={{ fontSize: "1.8rem", lineHeight: 1 }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function NeedHelp() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [contact, setContact] = useState("");
  const [importance, setImportance] = useState(0);
  const [requests, setRequests] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [helperOffers, setHelperOffers] = useState([]);

  useEffect(() => {
    setRequests([]);

    try {
      const storedOffers = localStorage.getItem("offers");
      if (storedOffers) {
        setHelperOffers(JSON.parse(storedOffers));
      }
    } catch (err) {
      console.error("Failed to load offers from localStorage", err);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!title || !description || !contact) {
      alert("Please fill all required fields.");
      return;
    }
    if (importance === 0) {
      alert("Please rate the importance.");
      return;
    }
    if (!imageFile) {
      alert("Please upload a picture.");
      return;
    }

    const newRequest = {
      id: Date.now(),
      title,
      description,
      category,
      contact,
      importance,
      imagePreview,
    };

    setRequests([newRequest, ...requests]);

    setTitle("");
    setDescription("");
    setCategory("General");
    setContact("");
    setImportance(0);
    setImageFile(null);
    setImagePreview(null);
  }

  return (
    <div
      className={`min-h-screen p-6 max-w-4xl mx-auto font-[Poppins] transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-gradient-to-br from-orange-50 to-white text-orange-900"
      }`}
    >
      <div className="flex justify-between items-center mb-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold"
        >
          🛠️I Need Help
        </motion.h2>
        <button
          onClick={() => setDarkMode((v) => !v)}
          aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="px-4 py-2 rounded-full border border-orange-500 text-orange-600 dark:text-orange-300 dark:border-orange-300 hover:bg-orange-500 hover:text-white transition"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className={`${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-orange-200"
        } rounded-2xl shadow-lg p-8 mb-12 border backdrop-blur-md`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        aria-label="Help request submission form"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-3">
            <label htmlFor="title" className="font-semibold mb-1 block">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief title of your request"
              required
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none transition"
              aria-required="true"
            />
          </div>

          <div className="md:col-span-3">
            <label htmlFor="description" className="font-semibold mb-1 block">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description"
              rows={4}
              required
              className="w-full border rounded-xl px-4 py-2 resize-none focus:ring-2 focus:ring-orange-400 outline-none transition"
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="category" className="font-semibold mb-1 block">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none transition"
            >
              {Object.keys(CATEGORY_COLORS).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="contact" className="font-semibold mb-1 block">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              id="contact"
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="+8801234567890"
              required
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none transition"
              aria-required="true"
            />
          </div>

          <div className="md:col-span-3">
            <label htmlFor="imageUpload" className="font-semibold mb-1 block">
              Upload Picture <span className="text-red-500">*</span>
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-orange-300 file:text-orange-700 file:bg-orange-50 hover:file:bg-orange-100 transition cursor-pointer"
              aria-required="true"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-4 max-h-48 rounded-lg object-contain shadow-md"
              />
            )}
          </div>

          <div className="flex flex-col">
            <label className="font-semibold mb-1 block">Importance (Rate your need)</label>
            <StarRating rating={importance} setRating={setImportance} editable />
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg transition"
        >
          Post Request
        </button>
      </motion.form>

      <motion.div layout>
        <h3 className="text-3xl font-bold mb-6">📝 Active Help Requests</h3>
        <AnimatePresence>
          {requests.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-orange-600 dark:text-orange-300"
            >
              No active requests yet.
            </motion.p>
          )}
          {requests.map(({ id, title, description, category, contact, importance, imagePreview }) => (
            <motion.div
              key={id || title}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-orange-200 dark:border-gray-700 p-6 mb-6 cursor-pointer hover:shadow-2xl transition`}
              onClick={() => setSelectedRequest({ id, title, description, category, contact, importance, imagePreview })}
              aria-label={`Help request titled ${title} in category ${category}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSelectedRequest({ id, title, description, category, contact, importance, imagePreview });
              }}
            >
              <div className="flex justify-between items-center">
                <h4 className="text-xl font-bold text-orange-900 dark:text-orange-300">{title}</h4>
                <div className="select-none">
                  <StarRating rating={importance} />
                </div>
              </div>
              <p className="mt-2 text-orange-800 dark:text-orange-400">{description}</p>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Request"
                  className="mt-3 max-h-36 rounded-lg object-cover w-full"
                />
              )}
              <span
                className={`inline-block mt-4 px-3 py-1 rounded-full font-semibold text-xs ${
                  CATEGORY_COLORS[category] || "bg-gray-300 text-gray-900"
                }`}
              >
                {category}
              </span>
              <p className="mt-2 text-sm text-orange-700 dark:text-orange-200">
                Contact:{" "}
                <a href={`tel:${contact}`} className="underline hover:text-orange-500">
                  {contact}
                </a>
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <motion.div layout className="mt-12">
        <h3 className="text-3xl font-bold mb-6">🧑‍🔧 Helpers Bulletin</h3>
        <AnimatePresence>
          {helperOffers.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-orange-600 dark:text-orange-300"
            >
              No helpers have posted offers yet.
            </motion.p>
          ) : (
            helperOffers.map((offer) => (
              <motion.div
                key={offer.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-orange-200 dark:border-gray-700 p-6 mb-6 cursor-pointer hover:shadow-2xl transition`}
                aria-label={`Helper offer: ${offer.skills} in category ${offer.category}`}
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-xl font-bold text-orange-900 dark:text-orange-300">
                    {offer.skills || offer.title || "Helper Offer"}
                  </h4>
                  <span
                    className={`inline-block px-3 py-1 rounded-full font-semibold text-xs ${
                      CATEGORY_COLORS[offer.category] || "bg-gray-300 text-gray-900"
                    }`}
                  >
                    {offer.category}
                  </span>
                </div>
                <p className="mt-2 text-orange-800 dark:text-orange-400">{offer.description}</p>
                {offer.imagePreview && (
                  <img
                    src={offer.imagePreview}
                    alt="Helper uploaded"
                    className="mt-3 max-h-36 rounded-lg object-cover w-full"
                  />
                )}
                <p className="mt-2 text-sm text-orange-700 dark:text-orange-200">
                  Contact:{" "}
                  <a href={`tel:${offer.contact}`} className="underline hover:text-orange-500">
                    {offer.contact}
                  </a>
                </p>
                <p className="mt-1 text-orange-700 dark:text-orange-200">Mobile: {offer.mobile}</p>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            key="requestModal"
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
                onClick={() => setSelectedRequest(null)}
                aria-label="Close request details"
                className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 hover:text-red-600 text-2xl font-bold"
              >
                ×
              </button>
              <h3 className="text-3xl font-bold mb-4 text-orange-700 dark:text-orange-400">
                {selectedRequest.title}
              </h3>
              <p className="mb-4 text-gray-800 dark:text-gray-300">{selectedRequest.description}</p>
              {selectedRequest.imagePreview && (
                <img
                  src={selectedRequest.imagePreview}
                  alt="Request"
                  className="mb-4 max-h-48 rounded-lg object-contain w-full"
                />
              )}
              <p>
                <strong>Category:</strong> {selectedRequest.category}
              </p>
              <p>
                <strong>Contact Mobile:</strong>{" "}
                <a href={`tel:${selectedRequest.contact}`} className="underline">
                  {selectedRequest.contact}
                </a>
              </p>
              <div className="mt-4 flex items-center">
                <span className="mr-2 font-semibold">Importance:</span>
                <StarRating rating={selectedRequest.importance} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
