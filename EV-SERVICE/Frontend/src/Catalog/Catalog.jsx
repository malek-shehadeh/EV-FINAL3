// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Header from "../component/Header/Header";
// import Footer from "../component/Footer/Footer";

// const CatalogPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("All");
//   const [priceSort, setPriceSort] = useState("asc");
//   const [darkMode, setDarkMode] = useState(false);
//   const [cartItemsCount, setCartItemsCount] = useState(0);
//   const [shopOwnerFilter, setShopOwnerFilter] = useState("");

//   useEffect(() => {
//     // Get shop owner from URL query parameters
//     const params = new URLSearchParams(location.search);
//     const shopOwner = params.get("shopOwner");
//     if (shopOwner) {
//       setShopOwnerFilter(shopOwner);
//     }

//     fetchProducts();
//   }, [location.search]);

//   const fetchProducts = async () => {
//     try {
//       const response = await fetch(
//         "http://localhost:5000/api/catalog/approved"
//       );
//       const data = await response.json();
//       setProducts(data);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   const toggleDarkMode = () => setDarkMode(!darkMode);

//   const viewProductDetails = (productId) => {
//     navigate(`/details/${productId}`);
//   };

//   const filteredProducts = products
//     .filter(
//       (product) =>
//         product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//         (categoryFilter === "All" || product.category === categoryFilter) &&
//         (!shopOwnerFilter ||
//           (product.shopOwner &&
//             product.shopOwner.ownerName.toLowerCase() ===
//               shopOwnerFilter.toLowerCase()))
//     )
//     .sort((a, b) =>
//       priceSort === "asc" ? a.price - b.price : b.price - a.price
//     );

//   const clearFilters = () => {
//     setSearchTerm("");
//     setCategoryFilter("All");
//     setShopOwnerFilter("");
//     navigate("/catalog"); // Remove query parameters
//   };

//   return (
//     <div className={darkMode ? "dark" : ""}>
//       <Header
//         handleDarkMode={toggleDarkMode}
//         darkMode={darkMode}
//         cartItemsCount={cartItemsCount}
//       />
//       <div className="bg-white dark:bg-gray-900 dark:text-white pt-28">
//         <div className="flex justify-between items-center mb-6 pl-16 pr-16">
//           <h1 className="text-3xl font-bold">Product Catalog</h1>
//           {shopOwnerFilter && (
//             <div className="flex items-center gap-4">
//               <span className="text-sm text-gray-600 dark:text-gray-400">
//                 Filtered by shop: {shopOwnerFilter}
//               </span>
//               <button
//                 onClick={clearFilters}
//                 className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           )}
//         </div>
//         <div className="flex flex-col md:flex-row justify-between items-center mb-6 px-16">
//           <input
//             type="text"
//             placeholder="Search products..."
//             className="border p-2 rounded mb-2 md:mb-0 md:mr-2 dark:bg-gray-700 dark:border-gray-600"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <select
//             className="border p-2 rounded mb-2 md:mb-0 md:mr-2 dark:bg-gray-700 dark:border-gray-600"
//             value={categoryFilter}
//             onChange={(e) => setCategoryFilter(e.target.value)}
//           >
//             <option value="All">All Categories</option>
//             <option value="Electronics">Electronics</option>
//             <option value="Clothing">Clothing</option>
//             <option value="Books">Books</option>
//             {/* Add more categories as needed */}
//           </select>
//           <select
//             className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
//             value={priceSort}
//             onChange={(e) => setPriceSort(e.target.value)}
//           >
//             <option value="asc">Price: Low to High</option>
//             <option value="desc">Price: High to Low</option>
//           </select>
//         </div>
//         <div className="px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
//           {filteredProducts.map((product) => (
//             <div
//               key={product._id}
//               className="border p-4 rounded-lg shadow-lg transition-transform duration-300 hover:-translate-y-2 dark:bg-gray-800 dark:border-gray-700"
//             >
//               <img
//                 src={`http://localhost:5000/${product.images[0]}`}
//                 alt={product.name}
//                 className="w-full h-48 object-cover mb-4 rounded"
//               />
//               <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
//               <p className="text-gray-600 dark:text-gray-400 mb-2">
//                 Category: {product.category}
//               </p>
//               <p className="text-lg font-bold">${product.price}</p>
//               {product.shopOwner && (
//                 <div className="mt-2">
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     Shop: {product.shopOwner.ownerName}
//                   </p>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     Location: {product.shopOwner.shopLocation}
//                   </p>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     Phone: {product.shopOwner.shopPhone}
//                   </p>
//                 </div>
//               )}
//               <button
//                 className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
//                 onClick={() => viewProductDetails(product._id)}
//               >
//                 View Details
//               </button>
//             </div>
//           ))}
//         </div>
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default CatalogPage;
// ///////////////////////////////////////////
// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Header from "../component/Header/Header";
// import Footer from "../component/Footer/Footer";

// const CatalogPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("All");
//   const [priceSort, setPriceSort] = useState("asc");
//   const [darkMode, setDarkMode] = useState(false);
//   const [cartItemsCount, setCartItemsCount] = useState(0);
//   const [shopOwnerFilter, setShopOwnerFilter] = useState("");

//   useEffect(() => {
//     // Get shop owner from URL query parameters
//     const params = new URLSearchParams(location.search);
//     const shopOwner = params.get("shopOwner");
//     if (shopOwner) {
//       setShopOwnerFilter(shopOwner);
//     }

//     fetchProducts();
//   }, [location.search]);

//   const fetchProducts = async () => {
//     try {
//       const response = await fetch(
//         "http://localhost:5000/api/catalog/approved"
//       );
//       const data = await response.json();
//       setProducts(data);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   const toggleDarkMode = () => setDarkMode(!darkMode);

//   const viewProductDetails = (productId) => {
//     navigate(`/details/${productId}`);
//   };

//   const filteredProducts = products
//     .filter(
//       (product) =>
//         product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//         (categoryFilter === "All" || product.category === categoryFilter) &&
//         (!shopOwnerFilter ||
//           (product.shopOwner &&
//             product.shopOwner.ownerName.toLowerCase() ===
//               shopOwnerFilter.toLowerCase()))
//     )
//     .sort((a, b) =>
//       priceSort === "asc" ? a.price - b.price : b.price - a.price
//     );

//   const clearFilters = () => {
//     setSearchTerm("");
//     setCategoryFilter("All");
//     setShopOwnerFilter("");
//     navigate("/catalog"); // Remove query parameters
//   };

//   return (
//     <div className={darkMode ? "dark" : ""}>
//       <Header
//         handleDarkMode={toggleDarkMode}
//         darkMode={darkMode}
//         cartItemsCount={cartItemsCount}
//       />
//       <div className="bg-white dark:bg-gray-900 dark:text-white pt-28 px-5 md:px-16">
//         <div className="mx-auto max-w-6xl">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-3xl font-bold">Product Catalog</h1>
//             {shopOwnerFilter && (
//               <div className="flex items-center gap-4">
//                 <span className="text-sm text-gray-600 dark:text-gray-400">
//                   Filtered by shop: {shopOwnerFilter}
//                 </span>
//                 <button
//                   onClick={clearFilters}
//                   className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400"
//                 >
//                   Clear Filters
//                 </button>
//               </div>
//             )}
//           </div>

//           <div className="flex flex-col md:flex-row justify-between items-center mb-6">
//             <input
//               type="text"
//               placeholder="Search products..."
//               className="border p-2 rounded mb-2 md:mb-0 md:mr-2 dark:bg-gray-700 dark:border-gray-600"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <select
//               className="border p-2 rounded mb-2 md:mb-0 md:mr-2 dark:bg-gray-700 dark:border-gray-600"
//               value={categoryFilter}
//               onChange={(e) => setCategoryFilter(e.target.value)}
//             >
//               <option value="All">All Categories</option>
//               <option value="Electronics">Electronics</option>
//               <option value="Clothing">Clothing</option>
//               <option value="Books">Books</option>
//               {/* Add more categories as needed */}
//             </select>
//             <select
//               className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
//               value={priceSort}
//               onChange={(e) => setPriceSort(e.target.value)}
//             >
//               <option value="asc">Price: Low to High</option>
//               <option value="desc">Price: High to Low</option>
//             </select>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredProducts.map((product) => (
//               <div
//                 key={product._id}
//                 className="border p-4 rounded-lg shadow-lg transition-transform duration-300 hover:-translate-y-2 dark:bg-gray-800 dark:border-gray-700"
//               >
//                 <img
//                   src={`http://localhost:5000/${product.images[0]}`}
//                   alt={product.name}
//                   className="w-full h-48 object-cover mb-4 rounded"
//                 />
//                 <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
//                 <p className="text-gray-600 dark:text-gray-400 mb-2">
//                   Category: {product.category}
//                 </p>
//                 <p className="text-lg font-bold">{product.price}JD</p>
//                 {product.shopOwner && (
//                   <div className="mt-2">
//                     <p className="text-sm text-gray-600 dark:text-gray-400">
//                       Shop: {product.shopOwner.ownerName}
//                     </p>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">
//                       Location: {product.shopOwner.shopLocation}
//                     </p>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">
//                       Phone: {product.shopOwner.shopPhone}
//                     </p>
//                   </div>
//                 )}
//                 <button
//                   className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
//                   onClick={() => viewProductDetails(product._id)}
//                 >
//                   View Details
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default CatalogPage;
/////////////////////////////

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../component/Header/Header";
import Footer from "../component/Footer/Footer";

const CatalogPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priceSort, setPriceSort] = useState("asc");
  const [darkMode, setDarkMode] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [shopOwnerFilter, setShopOwnerFilter] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Show 9 items per page (3x3 grid)

  useEffect(() => {
    // Get shop owner from URL query parameters
    const params = new URLSearchParams(location.search);
    const shopOwner = params.get("shopOwner");
    if (shopOwner) {
      setShopOwnerFilter(shopOwner);
    }

    fetchProducts();
  }, [location.search]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/catalog/approved"
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const viewProductDetails = (productId) => {
    navigate(`/details/${productId}`);
  };

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (categoryFilter === "All" || product.category === categoryFilter) &&
        (!shopOwnerFilter ||
          (product.shopOwner &&
            product.shopOwner.ownerName.toLowerCase() ===
              shopOwnerFilter.toLowerCase()))
    )
    .sort((a, b) =>
      priceSort === "asc" ? a.price - b.price : b.price - a.price
    );

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All");
    setShopOwnerFilter("");
    setCurrentPage(1); // Reset to first page when clearing filters
    navigate("/catalog");
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <Header
        handleDarkMode={toggleDarkMode}
        darkMode={darkMode}
        cartItemsCount={cartItemsCount}
      />
      <div className="bg-white dark:bg-gray-900 dark:text-white pt-28 px-5 md:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Product Catalog</h1>
            {shopOwnerFilter && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Filtered by shop: {shopOwnerFilter}
                </span>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Search products..."
              className="border p-2 rounded mb-2 md:mb-0 md:mr-2 dark:bg-gray-700 dark:border-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="border p-2 rounded mb-2 md:mb-0 md:mr-2 dark:bg-gray-700 dark:border-gray-600"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
            </select>
            <select
              className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
            >
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((product) => (
              <div
                key={product._id}
                className="border p-4 rounded-lg shadow-lg transition-transform duration-300 hover:-translate-y-2 dark:bg-gray-800 dark:border-gray-700"
              >
                <img
                  src={`http://localhost:5000/${product.images[0]}`}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Category: {product.category}
                </p>
                <p className="text-lg font-bold">{product.price}JD</p>
                {product.shopOwner && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Shop: {product.shopOwner.ownerName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Location: {product.shopOwner.shopLocation}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Phone: {product.shopOwner.shopPhone}
                    </p>
                  </div>
                )}
                <button
                  className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                  onClick={() => viewProductDetails(product._id)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 mb-8">
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700"
                      : "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                  }`}
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white dark:bg-blue-700"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700"
                      : "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CatalogPage;
