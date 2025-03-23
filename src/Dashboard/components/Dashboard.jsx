import React, { useContext, useEffect, useState } from "react";
import {
  TrendingUp,
  Package,
  DollarSign,
  FileText,

  ArrowUp,
  Boxes,
} from "lucide-react";
import { motion } from "framer-motion";
import { PublicContext } from "../context/PublicContext";

const Dashboard = () => {
  const {
    infoStats,
    setInfoStats,
    detail,
    setDetails,
    topSalesProducts,
    setTopSalesProducts,
    categorySales,
    setCategorySales,
  } = useContext(PublicContext);
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem("activeTab");
    return savedTab || "dashboard";
  });

  const handleShowAll = () => {
    setActiveTab("inventory");
    localStorage.setItem("activeTab", "inventory");
  };

  const [categories, setCategories] = useState([
    { id: 1, name: "حنفيات", icon: "🚰" },
    { id: 2, name: "مغاسل", icon: "🚾" },
    { id: 3, name: "مراحيض", icon: "🚽" },
    { id: 4, name: "إكسسوارات", icon: "🔧" },
  ]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  
  const stats = [
    {
      title: "إجمالي المبيعات",
      value: infoStats.totalSales,
      icon: TrendingUp,
      color: "green",
    },
    {
      title: "إجمالي الأقساط غير المدفوعة",
      value: infoStats.unPaidPayment,
      icon: DollarSign,
      color: "red",
    },
    {
      title: "إجمالي المبيعات اليومية",
      value: infoStats.totalTodayPayment,
      icon: DollarSign,
      color: "yellow",
    },
  ];

  const details = [
    {
      title: "عدد المنتجات",
      value: detail.totalProduct,
      icon: Package,
      color: "blue",
    },
    {
      title: "عدد الفئات",
      value: detail.totalCategory,
      icon: Boxes,
      color: "purple",
    },
    {
      title: "عدد الفواتير الصادرة الكاملة",
      value: detail.countInvoice,
      icon: FileText,
      color: "orange",
    },
  ];
  const Card = ({ title, value, Icon, color }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg dark:hover:shadow-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-300 mb-1 font-medium">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {value}
          </h3>
          <p
            className={`text-sm text-${color}-600 dark:text-${color}-400 flex items-center mt-1 font-semibold`}
          >
            <ArrowUp size={16} className="mr-1" /> نسبة التغيير
          </p>
        </div>
        <div
          className={`bg-${color}-100 dark:bg-${color}-700 p-4 rounded-full shadow-inner`}
        >
          <Icon
            className={`text-${color}-600 dark:text-${color}-300`}
            size={28}
          />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          إحصائيات سريعة
        </h2>
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border dark:border-gray-600">
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {currentTime.toLocaleDateString("ar-EG", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
            {currentTime.toLocaleTimeString("ar-EG", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 p-4">
        {stats.map((item, index) => (
          <Card
            key={index}
            title={item.title}
            value={item.value}
            Icon={item.icon}
            color={item.color}
          />
        ))}
        {details.map((item, index) => (
          <Card
            key={index}
            title={item.title}
            value={item.value}
            Icon={item.icon}
            color={item.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              المنتجات الأكثر مبيعاً
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              (عرض أول {topSalesProducts.length} منتجات من حيث المبيعات)
            </p>
          </div>

          <div className="space-y-6">
            {topSalesProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-300 transform hover:scale-105"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg shadow-md"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {product.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800 dark:text-gray-100">
                    {product.price} شيكل
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {product.sales} مبيعات
                  </p>
                </div>
                <div
                  className={`flex items-center
                                         text-green-600 dark:text-green-400
                                        
                                        }`}
                >
                  <ArrowUp size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>

    
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:shadow-md transition-all duration-300 hover:shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            توزيع المبيعات حسب الفئة
          </h3>
          <div className="space-y-4">
            {categorySales.map((category, index) => {
              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-gray-800 dark:text-gray-200">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
                      {category.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        category.percentage >= 30
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
