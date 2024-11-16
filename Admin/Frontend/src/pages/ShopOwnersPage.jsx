// import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
// import { motion } from "framer-motion";

// import Header from "../components/common/Header";
// import StatCard from "../components/common/StatCard";

// import ShopOwner from "../components/ShopOwner/ShopOwner";

// const userStats = {
//   totalUsers: 152845,
//   newUsersToday: 243,
//   activeUsers: 98520,
//   churnRate: "2.4%",
// };

// const ShopOwnersPage = () => {
//   return (
//     <div className="flex-1 overflow-auto relative z-10">
//       <Header title="ShopOwnerUser" />

//       <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
//         {/* STATS */}
//         <motion.div
//           className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1 }}
//         >
//           <StatCard
//             name="Total Users"
//             icon={UsersIcon}
//             value={userStats.totalUsers.toLocaleString()}
//             color="#6366F1"
//           />
//           <StatCard
//             name="New Users Today"
//             icon={UserPlus}
//             value={userStats.newUsersToday}
//             color="#10B981"
//           />
//           <StatCard
//             name="Active Users"
//             icon={UserCheck}
//             value={userStats.activeUsers.toLocaleString()}
//             color="#F59E0B"
//           />
//           <StatCard
//             name="Churn Rate"
//             icon={UserX}
//             value={userStats.churnRate}
//             color="#EF4444"
//           />
//         </motion.div>

//         <ShopOwner />

//         {/* USER CHARTS */}
//         {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
//           <UserGrowthChart />
//           <UserActivityHeatmap />
//           <UserDemographicsChart />
//         </div> */}
//       </main>
//     </div>
//   );
// };
// export default ShopOwnersPage;
///////////////////////////////////////////

import { useState, useEffect } from "react";
import axios from "axios";
import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import ShopOwner from "../components/ShopOwner/ShopOwner";

const ShopOwnersPage = () => {
  const [shopStats, setShopStats] = useState({
    totalShops: 0,
    newShopsToday: 0,
    activeShops: 0,
    churnRate: "0%",
  });

  useEffect(() => {
    fetchShopStats();
  }, []);

  const fetchShopStats = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/shopowners");
      const shops = response.data;

      // Get today's date at midnight for comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Calculate statistics
      const stats = {
        totalShops: shops.length,

        // Count shops created today
        newShopsToday: shops.filter((shop) => {
          const createdAt = new Date(shop.createdAt);
          createdAt.setHours(0, 0, 0, 0);
          return createdAt.getTime() === today.getTime();
        }).length,

        // Count active shops (shops that are approved)
        activeShops: shops.filter((shop) => shop.isApproved).length,

        // Calculate churn rate (percentage of inactive shops)
        churnRate:
          shops.length > 0
            ? (
                (shops.filter((shop) => !shop.isApproved).length /
                  shops.length) *
                100
              ).toFixed(1) + "%"
            : "0%",
      };

      setShopStats(stats);
    } catch (error) {
      console.error("Error fetching shop stats:", error);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Shop Owners" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Shops"
            icon={UsersIcon}
            value={shopStats.totalShops.toLocaleString()}
            color="#6366F1"
          />
          <StatCard
            name="New Shops Today"
            icon={UserPlus}
            value={shopStats.newShopsToday.toString()}
            color="#10B981"
          />
          <StatCard
            name="Active Shops"
            icon={UserCheck}
            value={shopStats.activeShops.toLocaleString()}
            color="#F59E0B"
          />
          <StatCard
            name="Churn Rate"
            icon={UserX}
            value={shopStats.churnRate}
            color="#EF4444"
          />
        </motion.div>

        <ShopOwner onShopsUpdate={fetchShopStats} />
      </main>
    </div>
  );
};

export default ShopOwnersPage;
