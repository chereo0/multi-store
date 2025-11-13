import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getCustomerOrders } from '../../api/services';

const OrdersPage = () => {
  const { isDarkMode } = useTheme();
  const { isGuest } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (isGuest) {
      navigate('/login');
      return;
    }
    (async () => {
      setLoading(true);
      const res = await getCustomerOrders();
      if (res.success) setOrders(res.data || []);
      setLoading(false);
    })();
  }, [isGuest, navigate]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : ''}`}>
      <div className="h-16" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Orders</h1>

        <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-gray-800/70 border border-gray-700' : 'bg-white border border-gray-200 shadow'} `}>
          {loading ? (
            <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>You don't have any orders yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  <tr>
                    <th className="text-left py-2 pr-4">Order ID</th>
                    <th className="text-left py-2 pr-4">Status</th>
                    <th className="text-left py-2 pr-4">Total</th>
                    <th className="text-left py-2 pr-4">Date</th>
                    <th className="text-left py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>
                  {orders.map((o, idx) => (
                    <tr key={(o.id || o.order_id || idx) + ''} className={isDarkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'}>
                      <td className="py-3 pr-4">{o.id || o.order_id || o.orderId}</td>
                      <td className="py-3 pr-4">{o.status || o.order_status || '—'}</td>
                      <td className="py-3 pr-4">{o.total || o.total_formatted || o.total_price || '—'}</td>
                      <td className="py-3 pr-4">{o.date_added || o.created_at || o.date || '—'}</td>
                      <td className="py-3 pr-4">
                        <Link to={`/orders/${o.id || o.order_id || o.orderId}`} className={`px-3 py-1 rounded ${isDarkMode ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-100 text-cyan-700'}`}>
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
