//////////////////////////////////////////////
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";

const OrdersTable = ({ onOrdersUpdate }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/api/orders");
      console.log("Orders response:", response.data); // Debug log
      setOrders(response.data);
      setFilteredOrders(response.data);
      if (onOrdersUpdate) {
        onOrdersUpdate();
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = orders.filter(
      (order) =>
        order._id?.toLowerCase().includes(term) ||
        order.user?.username?.toLowerCase().includes(term) ||
        order.cartItems?.some((item) =>
          item.shopOwner?.name?.toLowerCase().includes(term)
        )
    );
    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:4000/api/orders/${orderId}/update-status`,
        {
          status: newStatus,
        }
      );
      await fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status");
    }
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">Error: {error}</div>;
  }

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 sm:p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      {/* Responsive header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Order List</h2>
        <div className="relative w-full sm:w-auto min-w-[200px] sm:min-w-[300px]">
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center text-gray-400 py-4">No orders found</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Shop Owner
                  </th>
                  {/* <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th> */}
                </tr>
              </thead>

              <tbody className="divide divide-gray-700">
                {currentOrders.map((order) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                      {order.user?.username || "N/A"}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                      ${order.amount?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {order.cartItems
                        ?.map((item) => item.shopOwner?.name)
                        .filter(Boolean)
                        .join(", ") || "N/A"}
                    </td>
                    {/* <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {order.status !== "completed" && (
                        <button
                          className="text-indigo-400 hover:text-indigo-300 mr-2"
                          onClick={() =>
                            handleUpdateStatus(order._id, "completed")
                          }
                        >
                          <Eye size={18} />
                        </button>
                      )}
                    </td> */}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Responsive pagination controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="text-sm text-gray-400 order-2 sm:order-1">
              Showing {indexOfFirstOrder + 1} to{" "}
              {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
            </div>
            <div className="flex items-center space-x-2 order-1 sm:order-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-gray-300 min-w-[100px] text-center">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                  currentPage === totalPages
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default OrdersTable;
