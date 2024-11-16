/////////////////////////////////////////////////////////////

import React, { useState, useEffect } from "react";
import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react";
import Footer from "../component/Footer/Footer";
import Header from "../component/Header/Header";

const ProfilePage = () => {
  // Add dark mode state
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Existing state management
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("/api/placeholder/150/150");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState("");

  // Image popup state
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 2;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  useEffect(() => {
    fetchProfile();
    fetchOrders();
  }, []);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setName(data.user.username);
      setEmail(data.user.email);
      if (data.user.profileImage) {
        setImageUrl(`http://localhost:5000${data.user.profileImage}`);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile data");
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:5000/api/users/orders", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.message || "Failed to load order history");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShowImages = (order) => {
    const itemsWithImages = order.items?.filter(
      (item) => item.image && item.image.length > 0
    );

    if (itemsWithImages && itemsWithImages.length > 0) {
      setCurrentItems(itemsWithImages);
      setCurrentImages(itemsWithImages.map((item) => item.image));
      setCurrentImageIndex(0);
      setShowImagePopup(true);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUpdateSuccess(false);

    const formData = new FormData();
    formData.append("username", name);
    formData.append("email", email);
    if (password) formData.append("password", password);
    if (imageFile) formData.append("profileImage", imageFile);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      if (data.user.profileImage) {
        setImageUrl(`http://localhost:5000${data.user.profileImage}`);
      }
      setUpdateSuccess(true);
      setPassword("");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const ImagePopup = () => {
    if (!showImagePopup || !currentImages.length) return null;

    const nextSlide = (e) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) =>
        prev === currentImages.length - 1 ? 0 : prev + 1
      );
    };

    const prevSlide = (e) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) =>
        prev === 0 ? currentImages.length - 1 : prev - 1
      );
    };

    const currentItem = currentItems[currentImageIndex];

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
        <div className="relative max-w-4xl w-full mx-4 bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowImagePopup(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-50"
          >
            <X size={24} />
          </button>

          <div className="relative">
            <img
              src={`http://localhost:5000/${currentImages[currentImageIndex]}`}
              alt={`Product ${currentImageIndex + 1}`}
              className="w-full h-auto object-contain max-h-[60vh]"
            />

            {currentImages.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          <div className="p-4 bg-white dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentItem.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Quantity: {currentItem.quantity}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Price: {currentItem.price}JD
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Subtotal: {(currentItem.quantity * currentItem.price).toFixed(0)}
              JD
            </p>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <div className="flex space-x-2">
              {currentImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex
                      ? "bg-blue-600"
                      : "bg-gray-400 hover:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={darkMode ? "dark" : ""}>
        <Header handleDarkMode={toggleDarkMode} darkMode={darkMode} />

        <main className="px-5 md:px-16 py-8 bg-gray-50 dark:bg-gray-800">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
              Your Profile
            </h1>

            {/* Alert Messages */}
            {error && (
              <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 dark:bg-red-900 dark:text-red-200">
                {error}
              </div>
            )}

            {updateSuccess && (
              <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 dark:bg-green-900 dark:text-green-200">
                Profile updated successfully!
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Update Form */}
              <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
                {profileLoading ? (
                  <div className="text-center py-4 dark:text-white">
                    Loading profile...
                  </div>
                ) : (
                  <>
                    <div className="mb-6 flex justify-center">
                      <div className="relative">
                        <img
                          src={imageUrl}
                          alt="Profile"
                          className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-600 shadow-lg"
                        />
                        <label
                          htmlFor="profile-picture"
                          className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
                        >
                          <Camera className="w-4 h-4 text-white" />
                          <input
                            type="file"
                            id="profile-picture"
                            className="hidden"
                            onChange={handleImageChange}
                            accept="image/*"
                          />
                        </label>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                          New Password (optional)
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                          minLength="6"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors dark:ring-offset-gray-800"
                      >
                        Update Profile
                      </button>
                    </form>
                  </>
                )}
              </div>

              {/* Order History */}
              <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">
                  Order History
                </h2>

                {loading ? (
                  <div className="text-center py-4 dark:text-white">
                    Loading orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No orders found
                  </div>
                ) : (
                  <>
                    <div className="space-y-6">
                      {currentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow dark:text-white"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <p className="font-semibold dark:text-white">
                                Order #{order.id.slice(-6).toUpperCase()}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(order.date).toLocaleDateString()}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${
                                order.status === "completed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </div>

                          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex justify-between items-center">
                              <p className="text-right font-semibold dark:text-white">
                                Total: {order.amount.toFixed(0) / 100}JD
                              </p>

                              <button
                                onClick={() => handleShowImages(order)}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                              >
                                View Images (
                                {order.items.reduce(
                                  (count, item) => count + (item.image ? 1 : 0),
                                  0
                                )}
                                )
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="mt-6 flex justify-center items-center space-x-4">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`p-2 rounded-full ${
                            currentPage === 1
                              ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                              : "text-blue-500 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700"
                          }`}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-8 h-8 rounded-full ${
                              currentPage === pageNum
                                ? "bg-blue-500 text-white"
                                : "text-gray-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-700"
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`p-2 rounded-full ${
                            currentPage === totalPages
                              ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                              : "text-blue-500 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700"
                          }`}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="mt-6 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md dark:bg-blue-900 dark:border-blue-400 dark:text-blue-200">
              <p>
                Keep your profile up to date to receive personalized
                recommendations for electric car parts!
              </p>
            </div>
          </div>
        </main>

        {/* Image Popup Component */}
        {showImagePopup && <ImagePopup />}
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
