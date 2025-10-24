import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { getHomePageBuilder } from "../api/services";

const StoresPage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchStoresFromHomeBuilder = async () => {
      try {
        setLoading(true);
        const response = await getHomePageBuilder();
        if (response && response.success && response.data) {
          const homeData = response.data;

            // Robust extractor: search for arrays inside homeData that look like stores
            const extractStores = (d) => {
              const results = [];

              const testArray = (arr) => {
                if (!Array.isArray(arr)) return false;
                // consider an array of store-like objects if many items have a name and some id
                const sample = arr.slice(0, 5);
                const score = sample.reduce((s, it) => {
                  if (!it || typeof it !== 'object') return s;
                  if (it.name && (it.id || it.store_id || it.slug || it.storeId || it._id)) return s + 2;
                  if (it.name) return s + 1;
                  return s;
                }, 0);
                return score >= sample.length; // heuristic: most items appear store-like
              };

              // If top-level is array, check candidates
              if (Array.isArray(d)) {
                for (const item of d) {
                  if (Array.isArray(item?.stores)) results.push(...item.stores);
                  if (Array.isArray(item?.products)) results.push(...item.products);
                  if (Array.isArray(item?.items)) results.push(...item.items);
                  // direct arrays of store-like objects
                  if (Array.isArray(item) && testArray(item)) results.push(...item);
                }
                // also check if the array itself looks like store list
                if (testArray(d)) results.push(...d);
              } else if (d && typeof d === 'object') {
                // check common keys
                if (Array.isArray(d.stores)) results.push(...d.stores);
                if (Array.isArray(d.products)) results.push(...d.products);
                if (Array.isArray(d.items)) results.push(...d.items);
                // also inspect nested arrays one level deep
                for (const k of Object.keys(d)) {
                  const v = d[k];
                  if (Array.isArray(v) && testArray(v)) results.push(...v);
                }
              }

              return results;
            };

            let fetched = extractStores(homeData) || [];

            // Deduplicate by id/slug/name
            const seen = new Set();
            fetched = fetched.filter((s) => {
              const idKey = s?.id ?? s?.store_id ?? s?.slug ?? s?.storeId ?? s?._id ?? s?.name;
              if (!idKey) return false;
              if (seen.has(String(idKey))) return false;
              seen.add(String(idKey));
              return true;
            });

            console.log('Stores extracted from home_page_builder:', fetched.length, fetched.slice(0, 3));
          setStores(fetched || []);
        }
      } catch (error) {
        console.error("Error fetching stores from home_page_builder:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoresFromHomeBuilder();
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900" : ""
      }`}
      style={
        !isDarkMode
          ? {
              backgroundImage: "url(/white%20backgroud.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundAttachment: "fixed",
            }
          : {}
      }
    >
      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>

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
            {stores.length > 0 ? (
              stores.map((store, idx) => {
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
                        className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                          isDarkMode ? "bg-gray-700/50" : "bg-gray-100"
                        }`}
                      >
                        <span
                          className={`text-2xl font-bold ${
                            isDarkMode ? "text-cyan-400" : "text-cyan-600"
                          }`}
                        >
                          {store.name
                            ? store.name.charAt(0).toUpperCase()
                            : "S"}
                        </span>
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
                    No Stores Available
                  </h3>
                  <p
                    className={`transition-colors duration-300 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Check back later for new stores in the multiverse!
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
