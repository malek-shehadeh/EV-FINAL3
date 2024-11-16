/////////////////////////////////////////////////////////////////////

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Menu,
  ShoppingBag,
  Package,
  ShoppingCart,
  User,
  LogOut,
  Plus,
  BoxIcon,
  Store,
  ClipboardList,
  UserCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const SIDEBAR_ITEMS = [
  {
    name: "Add Product",
    icon: Plus,
    color: "#dcfce7", // green-100
    bgColor: "bg-green-800",
    action: "add",
    href: "/addproduct",
  },
  {
    name: "Product List",
    icon: Store,
    color: "#bbf7d0", // green-200
    bgColor: "bg-green-800",
    action: "list",
    href: "/products",
  },
  {
    name: "Orders",
    icon: ClipboardList,
    color: "#86efac", // green-300
    bgColor: "bg-green-800",
    action: "orders",
    href: "/orders",
  },
  {
    name: "Shop Owner Profile",
    icon: UserCircle,
    color: "#4ade80", // green-400
    bgColor: "bg-green-800",
    action: "profile",
    href: "/profile",
  },
];

const SidebarComponent = ({ setActivePage }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("shopOwnerToken");

  const handleLogout = () => {
    localStorage.removeItem("shopOwnerToken");
    navigate("/login");
  };

  return (
    <>
      <div className={`flex-shrink-0 ${isSidebarOpen ? "w-64" : "w-20"}`} />

      <motion.div
        className={`fixed left-0 top-0 z-10 h-full transition-all duration-300 ease-in-out`}
        animate={{ width: isSidebarOpen ? 256 : 80 }}
      >
        <div className="h-full bg-green-800 bg-opacity-95 backdrop-blur-md p-4 flex flex-col border-r border-green-700">
          <div className="flex items-center justify-between mb-8">
            <motion.h2
              className={`text-xl font-bold text-green-50 ${
                !isSidebarOpen && "hidden"
              }`}
            >
              Shop Owner
            </motion.h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Menu size={24} className="text-green-50" />
            </motion.button>
          </div>

          <nav className="flex-grow">
            {SIDEBAR_ITEMS.map((item) => (
              <Link
                key={item.action}
                to={item.href}
                className="block text-green-50 no-underline"
                onClick={() => setActivePage(item.action)}
              >
                <motion.div className="flex items-center p-3 text-sm font-medium rounded-lg hover:bg-green-700 transition-colors mb-2 cursor-pointer">
                  <div
                    className={`p-2 rounded-lg ${item.bgColor} bg-opacity-30`}
                  >
                    <item.icon
                      size={20}
                      strokeWidth={2.5}
                      style={{
                        color: item.color,
                        minWidth: "20px",
                      }}
                    />
                  </div>
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        className="ml-3 whitespace-nowrap text-green-50"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            ))}

            {isLoggedIn && (
              <motion.div
                className="flex items-center p-3 text-sm font-medium rounded-lg hover:bg-green-700 transition-colors mb-2 cursor-pointer mt-auto"
                onClick={handleLogout}
              >
                <div className="p-2 rounded-lg bg-green-800 bg-opacity-30">
                  <LogOut
                    size={20}
                    strokeWidth={2.5}
                    style={{
                      color: "#dcfce7", // green-100
                      minWidth: "20px",
                    }}
                  />
                </div>
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-3 whitespace-nowrap text-green-50"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                    >
                      Logout
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </nav>
        </div>
      </motion.div>
    </>
  );
};

export default SidebarComponent;
