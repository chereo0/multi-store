import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
// import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
// import ThreeScene from "../../components/ThreeScene";
import HeroSlideshow from "../../components/HeroSlideshow";
import { getStores, getHomePageBuilder } from "../../api/services";

// Helper function to get icon for category
const getCategoryIcon = (categoryName) => {
  const name = categoryName?.toLowerCase() || "";
  if (name.includes("food")) return "🍔";
  if (name.includes("fashion") || name.includes("accessories")) return "👗";
  if (name.includes("market")) return "🛒";
  if (name.includes("flower")) return "🌸";
  if (name.includes("self-care") || name.includes("beauty")) return "💄";
  if (name.includes("electronic") || name.includes("gadget")) return "📱";
  if (name.includes("home") || name.includes("living")) return "🏠";
  if (name.includes("book")) return "📚";
  if (name.includes("sport")) return "⚽";
  return "⭐";
};

const Homepage = () => {
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [stores, setStores] = useState([]);
  const [storesLoading, setStoresLoading] = useState(true);
  const [homeData, setHomeData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const { user } = useAuth();
  // const { getCartItemsCount } = useCart();
  const { isDarkMode, colors } = useTheme();

  useEffect(() => {
    // Simulate loading and trigger animations
    setTimeout(() => {
      setLoading(false);
      setIsVisible(true);
    }, 100);

    // Fetch homepage builder data
    const fetchHomeData = async () => {
      try {
        const response = await getHomePageBuilder();
        if (response.success && response.data) {
          console.log("Homepage builder data:", response.data);
          setHomeData(response.data);

          // Extract categories from the data array
          if (Array.isArray(response.data)) {
            const categoryData = response.data.find(
              (item) => item.type === "category_carousel"
            );
            if (categoryData && categoryData.categories) {
              setCategories(categoryData.categories);
              console.log("Categories extracted:", categoryData.categories);
            }

            // Extract banners
            const bannerData = response.data.find(
              (item) =>
                item.type === "banner_carousel" || item.type === "banner"
            );
            if (bannerData && bannerData.banners) {
              setBanners(bannerData.banners);
              console.log("Banners extracted:", bannerData.banners);
            }

            // Extract new arrivals
            const newArrivalData = response.data.find(
              (item) => item.type === "new_arrival_carousel"
            );
            console.log("New arrival data found:", newArrivalData);
            if (newArrivalData) {
              const products =
                newArrivalData.products ||
                newArrivalData.stores ||
                newArrivalData.items ||
                [];
              setNewArrivals(products);
              console.log("New arrivals extracted:", products);
              // Log the full first item to see its structure
              if (products.length > 0) {
                console.log(
                  "FULL first item object:",
                  JSON.stringify(products[0], null, 2)
                );
                console.log("First item keys:", Object.keys(products[0]));
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      }
    };

    // Fetch stores data
    const fetchStores = async () => {
      try {
        setStoresLoading(true);
        const response = await getStores();
        if (response.success) {
          setStores(response.data);
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      } finally {
        setStoresLoading(false);
      }
    };

    fetchHomeData();
    fetchStores();
  }, []);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div
            className={`animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4 ${
              isDarkMode ? "border-blue-400" : "border-blue-600"
            }`}
          ></div>
          <div
            className={`text-xl font-medium transition-colors duration-300 ${
              colors[isDarkMode ? "dark" : "light"].text
            }`}
          >
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900" : ""
      }`}
      style={{}}
    >
  {/* Global top padding now handled in App.js */}

      {/* Hero Section - 3D Slideshow (no background) */}
      <section
        id="home"
        className={`relative overflow-hidden w-full`}
        style={{}}
      >
        {/* Build slideshow images from banners or fallback images */}
        <div className="w-full relative z-10">
          {(() => {
            const heroImages = Array.isArray(banners)
              ? banners
                  .map((b) =>
                    b?.image || b?.banner || b?.url || b?.src || b?.background_image
                  )
                  .filter(Boolean)
              : [];
            const fallback = [
              "/landing-bg.jpg",
              "/Gemini_Generated_Image_enzgvmenzgvmenzg.png",
              "/Gemini_Generated_Image_pc6crxpc6crxpc6c.png",
            ];
            const slides = heroImages.length ? heroImages : fallback;
            return <HeroSlideshow images={slides} height="100vh" />;
          })()}
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 mt-10">
          <div
            className={`transform transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {/* Main Headline */}
            <h1
              className={`text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight transition-colors duration-300 ${
                colors[isDarkMode ? "dark" : "light"].text
              }`}
            >
              {homeData?.hero?.title || "DISCOVER INFINITE"}{" "}
              <span
                className="bg-gradient-to-r from-[#00E5FF] to-[#FF00FF] bg-clip-text text-transparent"
                style={{
                  textShadow: "0 0 30px rgba(0, 229, 255, 0.5)",
                  filter: "drop-shadow(0 0 20px rgba(255, 0, 255, 0.3))",
                }}
              >
                {homeData?.hero?.highlight || "COMMERCE"}
              </span>
            </h1>

            {/* Subheading */}
            <p
              className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed transition-colors duration-300 ${
                colors[isDarkMode ? "dark" : "light"].textSecondary
              }`}
              style={{
                textShadow: isDarkMode
                  ? "0 0 10px rgba(176, 184, 193, 0.3)"
                  : "none",
              }}
            >
              {homeData?.hero?.subtitle ||
                "Where every click is a journey to new possibilities."}
            </p>

            {/* CTA Button */}
            <div className="mb-16">
              <Link
                to={homeData?.hero?.cta_link || "/categories"}
                className="inline-block px-12 py-4 rounded-full text-lg font-semibold text-white transition-all duration-300 hover:scale-105 transform"
                style={{
                  background: "linear-gradient(90deg, #00E5FF, #FF00FF)",
                  boxShadow:
                    "0 0 30px rgba(0, 229, 255, 0.4), 0 0 60px rgba(255, 0, 255, 0.2)",
                  textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                }}
              >
                {homeData?.hero?.cta_text || "START YOUR ADVENTURE"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Section */}
      {categories.length > 0 && (
        <section
          id="services"
          className={`py-20 transition-colors duration-300 ${
            isDarkMode ? "bg-gray-900" : "bg-gray-50"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`transform transition-all duration-1000 delay-300 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="text-center mb-16">
                <h2
                  className={`text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300 ${
                    colors[isDarkMode ? "dark" : "light"].text
                  }`}
                  style={{
                    textShadow: isDarkMode
                      ? "0 0 20px rgba(0, 229, 255, 0.5)"
                      : "none",
                  }}
                >
                  FEATURED CATEGORIES
                </h2>
                <p
                  className={`text-xl max-w-2xl mx-auto transition-colors duration-300 ${
                    colors[isDarkMode ? "dark" : "light"].textSecondary
                  }`}
                >
                  Explore our digital universe of infinite possibilities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Category Cards from API */}
                {categories.map((category, index) => {
                  const glowColor = index % 2 === 0 ? "#00E5FF" : "#FF00FF";
                  const categoryIcon = getCategoryIcon(category.name);

                  return (
                    <div
                      key={category.category_id || index}
                      className="relative group cursor-pointer"
                    >
                      <div
                        className={`relative p-8 rounded-2xl transition-all duration-500 group-hover:scale-105 ${
                          isDarkMode
                            ? "bg-white/3 backdrop-blur-md"
                            : "bg-white/80 backdrop-blur-md"
                        }`}
                        style={{
                          border: `1px solid ${glowColor}`,
                          boxShadow: `0 0 30px ${glowColor}30, inset 0 0 30px ${glowColor}10`,
                        }}
                      >
                        {/* Hexagonal Pattern Overlay */}
                        <div
                          className={`absolute inset-0 transition-opacity duration-300 ${
                            isDarkMode ? "opacity-10" : "opacity-5"
                          }`}
                          style={{
                            backgroundImage: `
                              radial-gradient(circle at 25% 25%, ${glowColor} 2px, transparent 2px),
                              radial-gradient(circle at 75% 75%, ${glowColor} 2px, transparent 2px)
                            `,
                            backgroundSize: "40px 40px",
                          }}
                        />

                        <div className="text-center relative z-10">
                          <div
                            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:rotate-12"
                            style={{
                              background: `linear-gradient(135deg, ${glowColor}20, ${glowColor}40)`,
                              border: `2px solid ${glowColor}`,
                              boxShadow: `0 0 25px ${glowColor}50`,
                            }}
                          >
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-12 h-12 object-contain"
                              />
                            ) : (
                              <span className="text-3xl">{categoryIcon}</span>
                            )}
                          </div>

                          <h3
                            className={`text-2xl font-bold mb-3 transition-colors duration-300 ${
                              colors[isDarkMode ? "dark" : "light"].text
                            }`}
                            style={{
                              textShadow: isDarkMode
                                ? `0 0 15px ${glowColor}80`
                                : "none",
                            }}
                          >
                            {category.name.replace(/&amp;/g, "&")}
                          </h3>

                          <p
                            className={`mb-4 text-sm transition-colors duration-300 ${
                              colors[isDarkMode ? "dark" : "light"]
                                .textSecondary
                            }`}
                          >
                            {category.description ||
                              "Discover amazing products"}
                          </p>

                          <button
                            className="px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
                            style={{
                              background: `linear-gradient(90deg, ${glowColor}, ${glowColor}80)`,
                              color: "white",
                              boxShadow: `0 0 20px ${glowColor}40`,
                            }}
                          >
                            EXPLORE
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section
          className={`py-20 transition-colors duration-300 ${
            isDarkMode ? "bg-gray-900" : "bg-gray-50"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`transform transition-all duration-1000 delay-400 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="text-center mb-16">
                <h2
                  className={`text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300 ${
                    colors[isDarkMode ? "dark" : "light"].text
                  }`}
                  style={{
                    textShadow: isDarkMode
                      ? "0 0 20px rgba(0, 229, 255, 0.5)"
                      : "none",
                  }}
                >
                  NEW ARRIVALS
                </h2>
                <p
                  className={`text-xl max-w-2xl mx-auto transition-colors duration-300 ${
                    colors[isDarkMode ? "dark" : "light"].textSecondary
                  }`}
                >
                  Fresh products just landed from across the multiverse.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {newArrivals.slice(0, 8).map((item, index) => (
                  <div
                    key={item.product_id || item.store_id || index}
                    className={`transform transition-all duration-500 delay-${
                      index * 100
                    } ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-10 opacity-0"
                    }`}
                  >
                    <Link to={item.store_id ? `/store/${item.store_id}` : "#"}>
                      <div
                        className={`relative p-4 rounded-xl transition-all duration-300 hover:scale-105 group cursor-pointer ${
                          isDarkMode
                            ? "bg-white/3 backdrop-blur-md"
                            : "bg-white/80 backdrop-blur-md"
                        }`}
                        style={{
                          border: `1px solid ${
                            index % 2 === 0 ? "#00E5FF" : "#FF00FF"
                          }`,
                          boxShadow: `0 0 25px ${
                            index % 2 === 0 ? "#00E5FF" : "#FF00FF"
                          }20`,
                        }}
                      >
                        {/* Item Image */}
                        <div
                          className="relative mb-4 overflow-hidden rounded-lg flex items-center justify-center p-4"
                          style={{
                            height: "200px",
                            background: `linear-gradient(135deg, ${
                              index % 2 === 0 ? "#00E5FF" : "#FF00FF"
                            }20, ${index % 2 === 0 ? "#00E5FF" : "#FF00FF"}40)`,
                          }}
                        >
                          {item.background_image || item.profile_image ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <img
                                src={
                                  item.background_image || item.profile_image
                                }
                                alt={item.name || item.title}
                                className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                onLoad={(e) => {
                                  console.log("✅ Image loaded successfully!");
                                  console.log(
                                    "URL:",
                                    item.background_image || item.profile_image
                                  );
                                  console.log("Store:", item.name);
                                }}
                                onError={(e) => {
                                  console.error("❌ Image load error!");
                                  console.error(
                                    "URL:",
                                    item.background_image || item.profile_image
                                  );
                                  console.error("Store:", item.name);
                                  e.target.style.display = "none";
                                  const fallback =
                                    document.createElement("div");
                                  fallback.className = "text-6xl";
                                  fallback.textContent = item.store_id
                                    ? "🏪"
                                    : "📦";
                                  e.target.parentElement.appendChild(fallback);
                                }}
                              />
                            </div>
                          ) : (
                            <div className="text-6xl">
                              {item.store_id ? "🏪" : "📦"}
                            </div>
                          )}
                          {item.average_rating && (
                            <div
                              className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold"
                              style={{
                                background:
                                  "linear-gradient(90deg, #FF00FF, #FF00FF80)",
                                color: "white",
                                boxShadow: "0 0 15px #FF00FF40",
                              }}
                            >
                              ⭐ {item.average_rating}
                            </div>
                          )}
                        </div>

                        {/* Item Info */}
                        <div className="text-center">
                          <h3
                            className={`text-sm font-bold mb-2 line-clamp-2 transition-colors duration-300 ${
                              colors[isDarkMode ? "dark" : "light"].text
                            }`}
                            style={{
                              textShadow: isDarkMode
                                ? `0 0 10px ${
                                    index % 2 === 0 ? "#00E5FF" : "#FF00FF"
                                  }60`
                                : "none",
                            }}
                          >
                            {item.name || item.title}
                          </h3>

                          {/* Description or Reviews */}
                          {item.description && (
                            <p
                              className={`text-xs mb-3 line-clamp-2 transition-colors duration-300 ${
                                colors[isDarkMode ? "dark" : "light"]
                                  .textSecondary
                              }`}
                            >
                              {item.description}
                            </p>
                          )}

                          {item.total_reviews && (
                            <div className="flex items-center justify-center space-x-2 mb-3">
                              <span
                                className="text-sm"
                                style={{
                                  color:
                                    index % 2 === 0 ? "#00E5FF" : "#FF00FF",
                                }}
                              >
                                {item.total_reviews} reviews
                              </span>
                            </div>
                          )}

                          {/* View Button */}
                          <button
                            className="w-full px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105"
                            style={{
                              background: `linear-gradient(90deg, ${
                                index % 2 === 0 ? "#00E5FF" : "#FF00FF"
                              }20, ${
                                index % 2 === 0 ? "#00E5FF" : "#FF00FF"
                              }40)`,
                              border: `1px solid ${
                                index % 2 === 0 ? "#00E5FF" : "#FF00FF"
                              }`,
                              color: "white",
                              boxShadow: `0 0 15px ${
                                index % 2 === 0 ? "#00E5FF" : "#FF00FF"
                              }20`,
                            }}
                          >
                            {item.store_id ? "VISIT STORE" : "VIEW PRODUCT"}
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Live Deals Section */}
      <section
        className={`py-20 transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`transform transition-all duration-1000 delay-500 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="text-center mb-16">
              <h2
                className={`text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300 ${
                  colors[isDarkMode ? "dark" : "light"].text
                }`}
                style={{
                  textShadow: isDarkMode
                    ? "0 0 20px rgba(255, 0, 255, 0.5)"
                    : "none",
                }}
              >
                {homeData?.deals_section?.title || "LIVE DEALS"}
              </h2>
              <p
                className={`text-xl max-w-2xl mx-auto transition-colors duration-300 ${
                  colors[isDarkMode ? "dark" : "light"].textSecondary
                }`}
              >
                {homeData?.deals_section?.subtitle ||
                  "Limited-time offers from across the multiverse."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Live Deal Cards */}
              {(
                homeData?.deals || [
                  {
                    name: "Torloog 16",
                    icon: "🔮",
                    glow: "#00E5FF",
                    discount: "15% OFF",
                    timer: null,
                    price: "$299",
                  },
                  {
                    name: "Ora 3.37%",
                    icon: "🚁",
                    glow: "#FF00FF",
                    discount: "3.37% OFF",
                    timer: null,
                    price: "$1,299",
                  },
                  {
                    name: "Sorants 34",
                    icon: "👟",
                    glow: "#00E5FF",
                    discount: "25% OFF",
                    timer: "00:9:42",
                    price: "$89",
                  },
                  {
                    name: "Quantum X1",
                    icon: "⚡",
                    glow: "#FF00FF",
                    discount: "02.99% OFF",
                    timer: null,
                    price: "$2,499",
                  },
                  {
                    name: "Neon Pro",
                    icon: "💻",
                    glow: "#00E5FF",
                    discount: "12% OFF",
                    timer: "01:23:15",
                    price: "$1,599",
                  },
                ]
              ).map((deal, index) => (
                <div
                  key={index}
                  className={`transform transition-all duration-500 delay-${
                    index * 150
                  } ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                >
                  <div
                    className={`relative p-6 rounded-xl transition-all duration-300 hover:scale-105 group cursor-pointer ${
                      isDarkMode
                        ? "bg-white/2 backdrop-blur-md"
                        : "bg-white/80 backdrop-blur-md"
                    }`}
                    style={{
                      border: `1px solid ${deal.glow}`,
                      boxShadow: `0 0 25px ${deal.glow}20, inset 0 0 25px ${deal.glow}05`,
                    }}
                  >
                    {/* Animated Background Pattern */}
                    <div
                      className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                      style={{
                        backgroundImage: `
                          linear-gradient(45deg, ${deal.glow} 1px, transparent 1px),
                          linear-gradient(-45deg, ${deal.glow} 1px, transparent 1px)
                        `,
                        backgroundSize: "20px 20px",
                      }}
                    />

                    <div className="text-center relative z-10">
                      {/* Product Icon */}
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:rotate-12"
                        style={{
                          background: `linear-gradient(135deg, ${deal.glow}30, ${deal.glow}60)`,
                          border: `2px solid ${deal.glow}`,
                          boxShadow: `0 0 20px ${deal.glow}40`,
                        }}
                      >
                        <span className="text-2xl">{deal.icon}</span>
                      </div>

                      {/* Product Name */}
                      <h3
                        className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                          colors[isDarkMode ? "dark" : "light"].text
                        }`}
                        style={{
                          textShadow: isDarkMode
                            ? `0 0 10px ${deal.glow}60`
                            : "none",
                        }}
                      >
                        {deal.name}
                      </h3>

                      {/* Discount Badge */}
                      <div
                        className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
                        style={{
                          background: `linear-gradient(90deg, ${deal.glow}, ${deal.glow}80)`,
                          color: "white",
                          boxShadow: `0 0 15px ${deal.glow}30`,
                        }}
                      >
                        {deal.discount}
                      </div>

                      {/* Timer */}
                      {deal.timer && (
                        <div
                          className="text-sm font-mono mb-3"
                          style={{
                            color: deal.glow,
                            textShadow: `0 0 10px ${deal.glow}50`,
                          }}
                        >
                          {deal.timer}
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <span
                          className="text-xl font-bold"
                          style={{ color: deal.glow }}
                        >
                          {deal.price}
                        </span>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        className="w-full px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105"
                        style={{
                          background: `linear-gradient(90deg, ${deal.glow}20, ${deal.glow}40)`,
                          border: `1px solid ${deal.glow}`,
                          color: "white",
                          boxShadow: `0 0 15px ${deal.glow}20`,
                        }}
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stores Section */}
      <section
        className={`py-20 transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`transform transition-all duration-1000 delay-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="text-center mb-16">
              <h2
                className={`text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300 ${
                  colors[isDarkMode ? "dark" : "light"].text
                }`}
                style={{
                  textShadow: isDarkMode
                    ? "0 0 20px rgba(0, 229, 255, 0.5)"
                    : "none",
                }}
              >
                FEATURED STORES
              </h2>
              <p
                className={`text-xl max-w-2xl mx-auto transition-colors duration-300 ${
                  colors[isDarkMode ? "dark" : "light"].textSecondary
                }`}
              >
                Discover trusted merchants from across the multiverse.
              </p>
            </div>

            {storesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className={`relative p-6 rounded-xl transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-white/2 backdrop-blur-md border border-gray-700"
                        : "bg-white/80 backdrop-blur-md border border-gray-200"
                    }`}
                    style={{
                      boxShadow: isDarkMode
                        ? "0 0 25px rgba(0, 229, 255, 10)"
                        : "0 0 25px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div className="animate-pulse">
                      <div className="w-16 h-16 bg-gray-600 rounded-xl mx-auto mb-4"></div>
                      <div className="h-6 bg-gray-600 rounded mb-3"></div>
                      <div className="h-4 bg-gray-600 rounded mb-4"></div>
                      <div className="h-4 bg-gray-600 rounded w-2/3 mx-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stores.map((store, index) => {
                  const isPhoenix =
                    store?.id === "phoenix" ||
                    store?.slug === "phoenix" ||
                    /phoenix/i.test(store?.name || "");
                  const storeHref = isPhoenix
                    ? "/store/phoenix"
                    : `/store/${store.id}`;
                  return (
                    <div
                      key={store.id}
                      className={`transform transition-all duration-500 delay-${
                        index * 200
                      } ${
                        isVisible
                          ? "translate-y-0 opacity-100"
                          : "translate-y-10 opacity-0"
                      }`}
                    >
                      <Link to={storeHref}>
                        <div
                          className={`relative p-6 rounded-xl transition-all duration-300 hover:scale-105 group cursor-pointer ${
                            isDarkMode
                              ? "bg-white/3 backdrop-blur-md"
                              : "bg-white/80 backdrop-blur-md"
                          }`}
                          style={{
                            border: `1px solid ${
                              store.isVerified ? "#00E5FF" : "#FF00FF"
                            }`,
                            boxShadow: `0 0 30px ${
                              store.isVerified ? "#00E5FF" : "#FF00FF"
                            }30, inset 0 0 30px ${
                              store.isVerified ? "#00E5FF" : "#FF00FF"
                            }05`,
                          }}
                        >
                          {/* Store Banner Background */}
                          <div
                            className="absolute inset-0 rounded-xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                            style={{
                              backgroundImage: `url(${store.banner})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />

                          {/* Verification Badge */}
                          {store.isVerified && (
                            <div
                              className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold"
                              style={{
                                background:
                                  "linear-gradient(90deg, #00E5FF, #00E5FF80)",
                                color: "white",
                                boxShadow: "0 0 15px #00E5FF30",
                              }}
                            >
                              ✓ VERIFIED
                            </div>
                          )}

                          <div className="text-center relative z-10">
                            {/* Store Logo */}
                            <div
                              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:rotate-12"
                              style={{
                                background: `linear-gradient(135deg, ${
                                  store.isVerified ? "#00E5FF" : "#FF00FF"
                                }20, ${
                                  store.isVerified ? "#00E5FF" : "#FF00FF"
                                }40)`,
                                border: `2px solid ${
                                  store.isVerified ? "#00E5FF" : "#FF00FF"
                                }`,
                                boxShadow: `0 0 25px ${
                                  store.isVerified ? "#00E5FF" : "#FF00FF"
                                }50`,
                              }}
                            >
                              <img
                                src={store.logo}
                                alt={`${store.name} logo`}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            </div>

                            {/* Store Name */}
                            <h3
                              className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                                colors[isDarkMode ? "dark" : "light"].text
                              }`}
                              style={{
                                textShadow: isDarkMode
                                  ? `0 0 15px ${
                                      store.isVerified ? "#00E5FF" : "#FF00FF"
                                    }80`
                                  : "none",
                              }}
                            >
                              {store.name}
                            </h3>

                            {/* Store Description */}
                            <p
                              className={`mb-4 text-sm line-clamp-2 transition-colors duration-300 ${
                                colors[isDarkMode ? "dark" : "light"]
                                  .textSecondary
                              }`}
                            >
                              {store.description}
                            </p>

                            {/* Store Category */}
                            <div
                              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
                              style={{
                                background: `linear-gradient(90deg, ${
                                  store.isVerified ? "#00E5FF" : "#FF00FF"
                                }20, ${
                                  store.isVerified ? "#00E5FF" : "#FF00FF"
                                }40)`,
                                border: `1px solid ${
                                  store.isVerified ? "#00E5FF" : "#FF00FF"
                                }`,
                                color: store.isVerified ? "#00E5FF" : "#FF00FF",
                              }}
                            >
                              {store.category}
                            </div>

                            {/* Rating */}
                            <div className="flex items-center justify-center space-x-2 mb-4">
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(store.rating)
                                        ? "text-yellow-400"
                                        : "text-gray-600"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span
                                className="text-sm font-semibold"
                                style={{
                                  color: store.isVerified
                                    ? "#00E5FF"
                                    : "#FF00FF",
                                }}
                              >
                                {store.rating}
                              </span>
                              <span
                                className={`text-sm transition-colors duration-300 ${
                                  colors[isDarkMode ? "dark" : "light"]
                                    .textSecondary
                                }`}
                              >
                                ({store.reviewCount})
                              </span>
                            </div>

                            {/* Visit Store Button */}
                            <Link
                              to={storeHref}
                              className="w-full px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105"
                              style={{
                                background: `linear-gradient(90deg, ${
                                  store.isVerified ? "#00E5FF" : "#FF00FF"
                                }20, ${
                                  store.isVerified ? "#00E5FF" : "#FF00FF"
                                }40)`,
                                border: `1px solid ${
                                  store.isVerified ? "#00E5FF" : "#FF00FF"
                                }`,
                                color: "white",
                                boxShadow: `0 0 15px ${
                                  store.isVerified ? "#00E5FF" : "#FF00FF"
                                }20`,
                              }}
                            >
                              VISIT STORE
                            </Link>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
      <section
        className={`py-20 transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {(
              homeData?.stats || [
                {
                  number: "1000+",
                  label: "Happy Customers",
                  icon: "👥",
                  glow: "#00E5FF",
                },
                {
                  number: "50+",
                  label: "Verified Stores",
                  icon: "🏪",
                  glow: "#FF00FF",
                },
                {
                  number: "10K+",
                  label: "Products Available",
                  icon: "📦",
                  glow: "#00E5FF",
                },
                {
                  number: "99%",
                  label: "Satisfaction Rate",
                  icon: "⭐",
                  glow: "#FF00FF",
                },
              ]
            ).map((stat, index) => (
              <div
                key={index}
                className={`transform transition-all duration-500 delay-${
                  index * 200
                } ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                <div
                  className={`relative p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
                    isDarkMode
                      ? "bg-white/3 backdrop-blur-md"
                      : "bg-white/80 backdrop-blur-md"
                  }`}
                  style={{
                    border: `1px solid ${stat.glow}`,
                    boxShadow: `0 0 25px ${stat.glow}20, inset 0 0 25px ${stat.glow}05`,
                  }}
                >
                  <div
                    className="text-4xl mb-4"
                    style={{ textShadow: `0 0 20px ${stat.glow}50` }}
                  >
                    {stat.icon}
                  </div>
                  <div
                    className="text-4xl font-bold mb-2"
                    style={{
                      color: stat.glow,
                      textShadow: `0 0 15px ${stat.glow}60`,
                    }}
                  >
                    {stat.number}
                  </div>
                  <div
                    className={`text-lg font-medium transition-colors duration-300 ${
                      colors[isDarkMode ? "dark" : "light"].textSecondary
                    }`}
                    style={{
                      textShadow: isDarkMode
                        ? "0 0 5px rgba(176, 184, 193, 0.3)"
                        : "none",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className={`py-20 transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2
                className={`text-4xl font-bold mb-6 transition-colors duration-300 ${
                  colors[isDarkMode ? "dark" : "light"].text
                }`}
                style={{
                  textShadow: isDarkMode
                    ? "0 0 20px rgba(0, 229, 255, 0.5)"
                    : "none",
                }}
              >
                Why Choose Multiverse Market?
              </h2>
              <p
                className={`text-xl mb-8 transition-colors duration-300 ${
                  colors[isDarkMode ? "dark" : "light"].textSecondary
                }`}
              >
                We connect you with trusted sellers from across infinite
                dimensions, offering you access to unique products and
                exceptional service all in one cosmic marketplace.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div
                    className="rounded-lg p-3 mr-4"
                    style={{
                      background:
                        "linear-gradient(135deg, #00E5FF20, #00E5FF40)",
                      border: "1px solid #00E5FF",
                      boxShadow: "0 0 15px #00E5FF30",
                    }}
                  >
                    <svg
                      className="w-6 h-6 text-[#00E5FF]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                        colors[isDarkMode ? "dark" : "light"].text
                      }`}
                      style={{
                        textShadow: isDarkMode
                          ? "0 0 10px rgba(0, 229, 255, 0.5)"
                          : "none",
                      }}
                    >
                      Verified Sellers
                    </h3>
                    <p
                      className={`transition-colors duration-300 ${
                        colors[isDarkMode ? "dark" : "light"].textSecondary
                      }`}
                    >
                      All our sellers are thoroughly verified across multiple
                      dimensions to ensure quality and reliability.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className="rounded-lg p-3 mr-4"
                    style={{
                      background:
                        "linear-gradient(135deg, #FF00FF20, #FF00FF40)",
                      border: "1px solid #FF00FF",
                      boxShadow: "0 0 15px #FF00FF30",
                    }}
                  >
                    <svg
                      className="w-6 h-6 text-[#FF00FF]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                        colors[isDarkMode ? "dark" : "light"].text
                      }`}
                      style={{
                        textShadow: isDarkMode
                          ? "0 0 10px rgba(255, 0, 255, 0.5)"
                          : "none",
                      }}
                    >
                      Quantum Payments
                    </h3>
                    <p
                      className={`transition-colors duration-300 ${
                        colors[isDarkMode ? "dark" : "light"].textSecondary
                      }`}
                    >
                      Your transactions are protected with quantum-level
                      security across all dimensions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div
                    className="rounded-lg p-3 mr-4"
                    style={{
                      background:
                        "linear-gradient(135deg, #00E5FF20, #00E5FF40)",
                      border: "1px solid #00E5FF",
                      boxShadow: "0 0 15px #00E5FF30",
                    }}
                  >
                    <svg
                      className="w-6 h-6 text-[#00E5FF]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                        colors[isDarkMode ? "dark" : "light"].text
                      }`}
                      style={{
                        textShadow: isDarkMode
                          ? "0 0 10px rgba(0, 229, 255, 0.5)"
                          : "none",
                      }}
                    >
                      Infinite Selection
                    </h3>
                    <p
                      className={`transition-colors duration-300 ${
                        colors[isDarkMode ? "dark" : "light"].textSecondary
                      }`}
                    >
                      Carefully curated products from the best sellers across
                      infinite universes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <img
                src="/Gemini_Generated_Image_hy9bf7hy9bf7hy9b.png"
                alt="About Multiverse Market platform"
                className="w-full h-96 object-cover rounded-xl shadow-lg"
                style={{
                  border: "2px solid #00E5FF",
                  boxShadow: "0 0 30px rgba(0, 229, 255, 0.3)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className={`py-20 transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className={`text-4xl font-bold mb-6 transition-colors duration-300 ${
              colors[isDarkMode ? "dark" : "light"].text
            }`}
            style={{
              textShadow: isDarkMode
                ? "0 0 20px rgba(255, 0, 255, 0.5)"
                : "none",
            }}
          >
            Ready to Begin Your Journey?
          </h2>
          <p
            className={`text-xl mb-12 transition-colors duration-300 ${
              colors[isDarkMode ? "dark" : "light"].textSecondary
            }`}
          >
            Join thousands of explorers who have discovered infinite
            possibilities through our cosmic marketplace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!user && (
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 transform"
                style={{
                  background: "linear-gradient(90deg, #00E5FF, #FF00FF)",
                  color: "white",
                  boxShadow:
                    "0 0 30px rgba(0, 229, 255, 0.4), 0 0 60px rgba(255, 0, 255, 0.2)",
                  textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                }}
              >
                JOIN THE MULTIVERSE
              </Link>
            )}
            <Link
              to="/categories"
              className="w-full sm:w-auto px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 transform"
              style={{
                background: "transparent",
                border: "2px solid #00E5FF",
                color: "#00E5FF",
                boxShadow: "0 0 20px rgba(0, 229, 255, 0.3)",
                textShadow: "0 0 10px rgba(0, 229, 255, 0.5)",
              }}
            >
              {user ? "Continue Exploring" : "Explore Categories"}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`py-16 transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, #00E5FF 0%, #FF00FF 100%)",
                      boxShadow: "0 0 20px rgba(0, 229, 255, 0.5)",
                    }}
                  >
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <span
                    className={`font-bold text-lg transition-colors duration-300 ${
                      colors[isDarkMode ? "dark" : "light"].text
                    }`}
                    style={{
                      textShadow: isDarkMode
                        ? "0 0 10px rgba(0, 229, 255, 0.5)"
                        : "none",
                    }}
                  >
                    MULTIVERSE MARKET
                  </span>
                </div>
              </div>
              <p
                className={`mb-6 max-w-md transition-colors duration-300 ${
                  colors[isDarkMode ? "dark" : "light"].textSecondary
                }`}
              >
                Connecting explorers with trusted sellers across infinite
                dimensions. Your gateway to cosmic commerce and exceptional
                service.
              </p>
              <div className="flex space-x-6">
                <button
                  className="text-[#00E5FF] hover:text-[#FF00FF] transition-colors duration-200"
                  style={{ textShadow: "0 0 10px rgba(0, 229, 255, 0.5)" }}
                >
                  <span className="sr-only">Facebook</span>
                  📘
                </button>
                <button
                  className="text-[#00E5FF] hover:text-[#FF00FF] transition-colors duration-200"
                  style={{ textShadow: "0 0 10px rgba(0, 229, 255, 0.5)" }}
                >
                  <span className="sr-only">Twitter</span>
                  🐦
                </button>
                <button
                  className="text-[#00E5FF] hover:text-[#FF00FF] transition-colors duration-200"
                  style={{ textShadow: "0 0 10px rgba(0, 229, 255, 0.5)" }}
                >
                  <span className="sr-only">Instagram</span>
                  📷
                </button>
                <button
                  className="text-[#00E5FF] hover:text-[#FF00FF] transition-colors duration-200"
                  style={{ textShadow: "0 0 10px rgba(0, 229, 255, 0.5)" }}
                >
                  <span className="sr-only">LinkedIn</span>
                  💼
                </button>
              </div>
            </div>

            <div>
              <h3
                className={`text-lg font-semibold mb-6 transition-colors duration-300 ${
                  colors[isDarkMode ? "dark" : "light"].text
                }`}
                style={{
                  textShadow: isDarkMode
                    ? "0 0 10px rgba(255, 0, 255, 0.5)"
                    : "none",
                }}
              >
                ABOUT US
              </h3>
              <ul className="space-y-3">
                <li>
                  <button
                    className={`hover:text-[#00E5FF] transition-colors duration-200 ${
                      colors[isDarkMode ? "dark" : "light"].textSecondary
                    }`}
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    className={`hover:text-[#00E5FF] transition-colors duration-200 ${
                      colors[isDarkMode ? "dark" : "light"].textSecondary
                    }`}
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    className={`hover:text-[#00E5FF] transition-colors duration-200 ${
                      colors[isDarkMode ? "dark" : "light"].textSecondary
                    }`}
                  >
                    Services
                  </button>
                </li>
                <li>
                  <button
                    className={`hover:text-[#00E5FF] transition-colors duration-200 ${
                      colors[isDarkMode ? "dark" : "light"].textSecondary
                    }`}
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3
                className={`text-lg font-semibold mb-6 transition-colors duration-300 ${
                  colors[isDarkMode ? "dark" : "light"].text
                }`}
                style={{
                  textShadow: isDarkMode
                    ? "0 0 10px rgba(255, 0, 255, 0.5)"
                    : "none",
                }}
              >
                CUSTOMER SERVICE
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/login"
                    className={`hover:text-[#00E5FF] transition-colors duration-200 ${
                      colors[isDarkMode ? "dark" : "light"].textSecondary
                    }`}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className={`hover:text-[#00E5FF] transition-colors duration-200 ${
                      colors[isDarkMode ? "dark" : "light"].textSecondary
                    }`}
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <button
                    className={`hover:text-[#00E5FF] transition-colors duration-200 ${
                      colors[isDarkMode ? "dark" : "light"].textSecondary
                    }`}
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    className={`hover:text-[#00E5FF] transition-colors duration-200 ${
                      colors[isDarkMode ? "dark" : "light"].textSecondary
                    }`}
                  >
                    Contact Support
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="border-t mt-12 pt-8 text-center"
            style={{ borderColor: "rgba(0, 229, 255, 0.2)" }}
          >
            <p
              className={`transition-colors duration-300 ${
                colors[isDarkMode ? "dark" : "light"].textSecondary
              }`}
              style={{
                textShadow: isDarkMode
                  ? "0 0 5px rgba(176, 184, 193, 0.3)"
                  : "none",
              }}
            >
              &copy; 2024 Multiverse Market. All rights reserved across all
              dimensions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
