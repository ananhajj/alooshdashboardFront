import React, { useContext, useEffect, useState } from "react";
import {
  Package2,
  ShoppingCart,
  Receipt,
  BarChart3,
  Menu,
  Sun,
  Moon,
  RefreshCcw,
  ReceiptText,
  LogOut,
} from "lucide-react";
import Inventory from "./components/Inventory";
import Sales from "./components/Sales";
import Invoices from "./components/Invoices.jsx";
import Dashboard from "./components/Dashboard";
import Category from "./components/Category.jsx";
 
import Payment from "./components/Payment.jsx";
import { PublicContext } from "./context/PublicContext.jsx";


 

function Home() {
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem("activeTab");
    return savedTab ? savedTab : "dashboard";
  });
 
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);
  const { refreshData } = useContext(PublicContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true";
    }
    return false;
  });
   useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
 
  return (
    <> 
      
    <div className={`min-h-screen flex ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <div
        className={`bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-lg ${
          isSidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300`}
      >
        <div className="p-4 flex items-center justify-between">
          <h1
            className={`font-bold text-xl text-blue-600 ${
              !isSidebarOpen && "hidden"
            }`}
          >
            نظام إدارة المتجر
          </h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <Menu size={24} />
          </button>
        </div>
        <nav className="mt-8">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full p-4 flex items-center gap-3 ${
              activeTab === "dashboard"
                ? "bg-blue-50 text-blue-600 dark:bg-blue-600 dark:text-white"
                : "hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <BarChart3 size={24} />
            {isSidebarOpen && <span>لوحة التحكم</span>}
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`w-full p-4 flex items-center gap-3 rounded-lg transition-all duration-300 ${
              activeTab === "inventory"
                ? "bg-blue-600 text-white shadow-md dark:bg-blue-500 dark:text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Package2
              size={24}
              className={`${
                activeTab === "inventory"
                  ? "text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
            {isSidebarOpen && (
              <span className="text-sm font-medium">المخزون</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("category")}
            className={`w-full p-4 flex items-center gap-3 rounded-lg transition-all duration-300
                            ${
                              activeTab === "category"
                                ? "bg-blue-600 text-white shadow-md dark:bg-blue-500 dark:text-white"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
          >
            <Package2
              size={24}
              className={`${
                activeTab === "category"
                  ? "text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
            {isSidebarOpen && (
              <span className="text-sm font-medium">إدارة الفئات</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("sales")}
            className={`w-full p-4 flex items-center gap-3 rounded-lg transition-all duration-300 ${
              activeTab === "sales"
                ? "bg-blue-600 text-white shadow-md dark:bg-blue-500 dark:text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <ShoppingCart
              size={24}
              className={`${
                activeTab === "sales"
                  ? "text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
            {isSidebarOpen && (
              <span className="text-sm font-medium">إجراء عملية بيع</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("payment")}
            className={`w-full p-4 flex items-center gap-3 rounded-lg transition-all duration-300 ${
              activeTab === "payment"
                ? "bg-blue-600 text-white shadow-md dark:bg-blue-500 dark:text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Receipt
              size={24}
              className={`${
                activeTab === "payment"
                  ? "text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
            {isSidebarOpen && (
              <span className="text-sm font-medium">الدفعات</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("invoices")}
            className={`w-full p-4 flex items-center gap-3 rounded-lg transition-all duration-300 ${
              activeTab === "invoices"
                ? "bg-blue-600 text-white shadow-md dark:bg-blue-500 dark:text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <ReceiptText
              size={24}
              className={`${
                activeTab === "invoices"
                  ? "text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
            {isSidebarOpen && <span>الفواتير</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-100 dark:bg-gray-900 transition-all duration-300 ">
          <div className="flex justify-end gap-4 mb-2">
            {/* زر الوضع الداكن */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full transition-colors duration-300 
      bg-gray-200 dark:bg-blue-600 hover:bg-gray-300 
      dark:hover:bg-blue-700"
            >
              {darkMode ? (
                <Sun size={24} className="text-yellow-300 dark:text-white" />
              ) : (
                <Moon size={24} className="text-gray-800 dark:text-gray-200" />
              )}
            </button>

            {/* زر التحديث */}
            <button
              onClick={refreshData}
              className="p-2 text-blue-400 dark:text-gray-400 rounded-md transition duration-200"
            >
              <RefreshCcw size={24} />
            </button>

            
          </div>

        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "inventory" && <Inventory />}
        {activeTab === "category" && <Category />}
        {activeTab === "sales" && <Sales />}
        {activeTab === "invoices" && <Invoices />}
        {activeTab === "payment" && <Payment />}
      </div>
    </div>
     </>
  );
}

export default Home;
