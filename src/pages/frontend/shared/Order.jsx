import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import useAxiosPublic from "@/hooks/axiosPublic";
import useRole from "@/hooks/useRole";

const Order = () => {
  const axiosPublic = useAxiosPublic();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  

  const {profile} = useRole();
  const currentUserId = profile?._id;
  console.log(currentUserId)
  console.log(orders)
  // Fetch all orders from backend
  const fetchOrders = async () => {
    try {
      const res = await axiosPublic.get("/api/v1/orders");
      const userOrders = res.data.data.filter(order => order.orderedBy === currentUserId);
      setOrders(userOrders);
      //
    } catch (err) {
      console.error("Error fetching orders:", err);
      Swal.fire("Error", "Failed to fetch orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [axiosPublic]);

  const filteredOrders = orders.filter(
    (order) =>
      order.product.title.toLowerCase().includes(search.toLowerCase()) ||
      order.product.category.toLowerCase().includes(search.toLowerCase()) ||
      order.status.toLowerCase().includes(search.toLowerCase()) ||
      (order.product.addedByMerchant.name || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading orders...</div>;
  }

  return (
    <motion.div
      className="p-6 bg-gray-50 dark:bg-[#0f0f14] min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        All Orders
      </h2>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search by product, category, merchant, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-5 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-pink-500 shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No orders found.
          </div>
        ) : (
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Quantity</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Merchant</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Ordered By</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.map((order, idx) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <td className="px-4 py-3">{idx + 1}</td>
                  <td className="px-4 py-3">{order.product.title}</td>
                  <td className="px-4 py-3">{order.product.category}</td>
                  <td className="px-4 py-3">{order.quantity}</td>
                  <td className="px-4 py-3">{order.product.retailPrice * order.quantity} BDT</td>
                  <td className="px-4 py-3">{order.product.addedByMerchant.name}</td>
                  <td className="px-4 py-3 capitalize">{order.status}</td>
                  <td className="px-4 py-3">{order.orderedBy}</td>
                  <td className="px-4 py-3">{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default Order;
