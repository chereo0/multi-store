import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { getHomePageBuilder, getStoresByCategory } from "../api/services";

const StoresPage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();
  const location = useLocation();

  const searchQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get("q") || "").trim().toLowerCase();
  }, [location.search]);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(location.search);
        const categoryId = params.get("categoryId");

        if (categoryId) {
          // Try to fetch stores by category id/slug
          const res = await getStoresByCategory(categoryId);
          if (res) {
            if (res.success) {
              const data = res.data || [];
              setStores(data);
              // Do not show toast; the UI will render "No Stores Available" when data is empty
              return;
            } else {
              // API returned success=false; fallback to empty list (UI will show no stores)
              setStores([]);
              return;
            }
          }
          // if res is falsy, fallthrough to default home builder
        }

        const response = await getHomePageBuilder();
        if (response && response.success && response.data) {
          let fetched = [];
          // homepage builder returns an array of widgets — find one that contains stores/products/items
          if (Array.isArray(response.data)) {
            const widget = response.data.find(
              (it) =>
                Array.isArray(it.stores) ||
                Array.isArray(it.products) ||
                Array.isArray(it.items)
            );
            fetched =
              (widget && (widget.stores || widget.products || widget.items)) ||
              [];
          } else if (Array.isArray(response.data.stores)) {
            fetched = response.data.stores;
          }

          setStores(fetched || []);
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [location.search]);

  const filteredStores = useMemo(() => {
    if (!searchQuery) return stores;
    return (stores || []).filter((store) => {
      const name = (store?.name || "").toLowerCase();
      const desc = (store?.description || "").toLowerCase();
      const slug = (store?.slug || "").toLowerCase();
      return (
        name.includes(searchQuery) ||
        desc.includes(searchQuery) ||
        slug.includes(searchQuery)
      );
    });
  }, [stores, searchQuery]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900" : ""
      }`}
      style={{
        // use same store background image for both dark and light modes
        backgroundImage: "url('/storebg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
  {/* Spacer removed; global padding added in App.js */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1
            className={`text-4xl font-bold mb-4 transition-colors duration-300 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Explore Our Stores
          </h1>
          <div
            className={`w-24 h-1 mx-auto rounded-full ${
              isDarkMode
                ? "bg-gradient-to-r from-cyan-400 to-purple-500"
                : "bg-gradient-to-r from-cyan-500 to-purple-600"
            }`}
          ></div>
          <p
            className={`text-lg mt-6 transition-colors duration-300 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Discover amazing stores from across the multiverse
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <div
              className={`inline-block animate-spin rounded-full h-12 w-12 border-b-2 ${
                isDarkMode ? "border-cyan-400" : "border-cyan-600"
              }`}
            ></div>
            <p
              className={`mt-4 transition-colors duration-300 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Loading stores...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStores.length > 0 ? (
              filteredStores.map((store, idx) => {
                const storeId =
                  store.id ??
                  store.store_id ??
                  store.storeId ??
                  store._id ??
                  store.slug ??
                  idx;
                return (
                  <Link
                    key={store.id || store.store_id || store.slug || idx}
                    to={`/store/${storeId}`}
                    className={`group rounded-2xl p-6 backdrop-blur-md transition-all duration-300 hover:scale-105 ${
                      isDarkMode
                        ? "bg-gray-800/50 border border-cyan-400/30 shadow-2xl shadow-cyan-400/10 hover:shadow-cyan-400/20"
                        : "bg-white/80 border border-gray-200 shadow-xl hover:shadow-2xl"
                    }`}
                  >
                    <div className="text-center">
                      <div
                        className={`w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden flex items-center justify-center ${
                          isDarkMode ? "bg-gray-700/50" : "bg-gray-100"
                        }`}
                      >
                        <img
                          src={
                            store.logo || store.raw?.profile_image || store.raw?.logo || store.profile_image || '/no-image.png'
                          }
                          alt={store.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3
                        className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {store.name || "Quantum Store"}
                      </h3>
                      <p
                        className={`text-sm mb-4 transition-colors duration-300 ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {store.description ||
                          "Explore amazing products from this quantum store"}
                      </p>
                      <div
                        className={`inline-block px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                          isDarkMode
                            ? "bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/30"
                            : "bg-cyan-100 text-cyan-600 group-hover:bg-cyan-200"
                        }`}
                      >
                        Visit Store
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full text-center">
                <div
                  className={`rounded-2xl p-8 backdrop-blur-md transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-800/50 border border-cyan-400/30 shadow-2xl shadow-cyan-400/10"
                      : "bg-white/80 border border-gray-200 shadow-xl"
                  }`}
                >
                  <div
                    className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                      isDarkMode ? "bg-gray-700/50" : "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`w-12 h-12 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h3
                    className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {searchQuery ? "No matching stores" : "No Stores Available"}
                  </h3>
                  <p
                    className={`transition-colors duration-300 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {searchQuery
                      ? "Try a different search keyword."
                      : "Check back later for new stores in the multiverse!"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Featured Store removed per request; stores displayed above come from home_page_builder */}
      </div>
    </div>
  );
};

export default StoresPage;
