import React, { useState } from 'react';
import { Package2, ShoppingCart, Receipt, BarChart3, Menu } from 'lucide-react';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import Invoices from './components/Invoices.jsx';
import Dashboard from './components/Dashboard';
import Category from './components/Category.jsx';

function Home() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className={`bg-white shadow-lg ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
                <div className="p-4 flex items-center justify-between">
                    <h1 className={`font-bold text-xl text-blue-600 ${!isSidebarOpen && 'hidden'}`}>نظام إدارة المتجر</h1>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded">
                        <Menu size={24} />
                    </button>
                </div>
                <nav className="mt-8">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full p-4 flex items-center gap-3 ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                            }`}
                    >
                        <BarChart3 size={24} />
                        {isSidebarOpen && <span>لوحة التحكم</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`w-full p-4 flex items-center gap-3 ${activeTab === 'inventory' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                            }`}
                    >
                        <Package2 size={24} />
                        {isSidebarOpen && <span>المخزون</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('category')}
                        className={`w-full p-4 flex items-center gap-3 ${activeTab === 'category' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                            }`}
                    >
                        <Package2 size={24} />
                        {isSidebarOpen && <span>إدارة الفئات</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('sales')}
                        className={`w-full p-4 flex items-center gap-3 ${activeTab === 'sales' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                            }`}
                    >
                        <ShoppingCart size={24} />
                        {isSidebarOpen && <span>إجراء عملية بيع</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('invoices')}
                        className={`w-full p-4 flex items-center gap-3 ${activeTab === 'invoices' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                            }`}
                    >
                        <Receipt size={24} />
                        {isSidebarOpen && <span>الفواتير</span>}
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'inventory' && <Inventory />}
                {activeTab === 'category' && <Category />}
                {activeTab === 'sales' && <Sales />}
                {activeTab === 'invoices' && <Invoices />}
            </div>
        </div>
    );
}

export default Home;
