import React, { useState } from 'react';
import { TrendingUp, Package, DollarSign, FileText, AlertCircle, Plus, Edit2, Trash2, ArrowUp, ArrowDown, ShoppingBag, Users, Calendar, BarChart } from 'lucide-react';

const Dashboard = () => {
    // حالة الفئات
    const [categories, setCategories] = useState([
        { id: 1, name: 'حنفيات', icon: '🚰' },
        { id: 2, name: 'مغاسل', icon: '🚾' },
        { id: 3, name: 'مراحيض', icon: '🚽' },
        { id: 4, name: 'إكسسوارات', icon: '🔧' }
    ]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({ name: '', icon: '' });

    // بيانات تجريبية للأقساط والدفعات المستحقة
    const upcomingPayments = [
        {
            invoiceNumber: 'INV-001',
            customerName: 'أحمد محمد',
            amount: 500,
            dueDate: '2024-04-15',
            type: 'installment',
            status: 'pending'
        },
        {
            invoiceNumber: 'INV-002',
            customerName: 'خالد عبدالله',
            amount: 750,
            dueDate: '2024-04-20',
            type: 'partial',
            status: 'pending'
        },
        {
            invoiceNumber: 'INV-003',
            customerName: 'محمد علي',
            amount: 1000,
            dueDate: '2024-04-25',
            type: 'installment',
            status: 'overdue'
        }
    ];

    // بيانات المنتجات الأكثر مبيعاً
    const topSellingProducts = [
        {
            id: 1,
            name: 'حنفية حمام كروم',
            category: 'حنفيات',
            price: 350,
            sales: 42,
            image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            trend: 'up',
            percentage: 15
        },
        {
            id: 2,
            name: 'خلاط مغسلة فاخر',
            category: 'حنفيات',
            price: 450,
            sales: 38,
            image: 'https://images.unsplash.com/photo-1563456020159-b74d00b7a711?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            trend: 'up',
            percentage: 8
        },
        {
            id: 3,
            name: 'مغسلة رخام أبيض',
            category: 'مغاسل',
            price: 850,
            sales: 27,
            image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            trend: 'down',
            percentage: 3
        },
        {
            id: 4,
            name: 'مرحاض معلق',
            category: 'مراحيض',
            price: 1200,
            sales: 24,
            image: 'https://images.unsplash.com/photo-1564540574859-0dfb63985953?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            trend: 'up',
            percentage: 12
        },
        {
            id: 5,
            name: 'طقم إكسسوارات حمام',
            category: 'إكسسوارات',
            price: 280,
            sales: 22,
            image: 'https://images.unsplash.com/photo-1507474384641-ddeaec85807b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            trend: 'up',
            percentage: 5
        }
    ];

    // بيانات العملاء الأكثر شراءً
    const topCustomers = [
        { name: 'محمد أحمد', purchases: 12500, orders: 8 },
        { name: 'خالد العبدالله', purchases: 8750, orders: 5 },
        { name: 'سعيد الغامدي', purchases: 7200, orders: 4 },
        { name: 'فهد القحطاني', purchases: 6500, orders: 3 }
    ];

    // بيانات المبيعات الشهرية
    const monthlySales = [
        { month: 'يناير', amount: 8500 },
        { month: 'فبراير', amount: 9200 },
        { month: 'مارس', amount: 10500 },
        { month: 'أبريل', amount: 12500 },
        { month: 'مايو', amount: 11800 },
        { month: 'يونيو', amount: 13200 }
    ];

    // حساب أعلى قيمة للمبيعات الشهرية
    const maxSales = Math.max(...monthlySales.map(item => item.amount));

    const getDaysUntilDue = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleAddCategory = () => {
        if (newCategory.name) {
            if (editingCategory) {
                setCategories(categories.map(cat =>
                    cat.id === editingCategory.id
                        ? { ...cat, name: newCategory.name, icon: newCategory.icon }
                        : cat
                ));
            } else {
                setCategories([...categories, {
                    id: categories.length + 1,
                    ...newCategory
                }]);
            }
            setNewCategory({ name: '', icon: '' });
            setEditingCategory(null);
            setShowCategoryModal(false);
        }
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setNewCategory({ name: category.name, icon: category.icon });
        setShowCategoryModal(true);
    };

    const handleDeleteCategory = (categoryId) => {
        if (confirm('هل أنت متأكد من حذف هذه الفئة؟')) {
            setCategories(categories.filter(cat => cat.id !== categoryId));
        }
    };

    // تحديد الفترة الزمنية للإحصائيات
    const [timeRange, setTimeRange] = useState('week');

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">لوحة التحكم</h2>
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm border">
                    <div className="text-lg font-semibold text-gray-800">
                        {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                        {new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 mb-1">إجمالي المبيعات</p>
                            <h3 className="text-2xl font-bold">12,500 شيكل</h3>
                            <p className="text-sm text-green-600 flex items-center mt-1">
                                <ArrowUp size={14} className="mr-1" /> 
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <TrendingUp className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 mb-1">المنتجات</p>
                            <h3 className="text-2xl font-bold">245</h3>
                            <p className="text-sm text-green-600 flex items-center mt-1">
                                <ArrowUp size={14} className="mr-1" />  
                            </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Package className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 mb-1">المبيعات اليومية</p>
                            <h3 className="text-2xl font-bold">1,850 شيكل</h3>
                            <p className="text-sm text-red-600 flex items-center mt-1">
                                <ArrowUp size={14} className="mr-1" /> 
                            </p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <DollarSign className="text-yellow-600" size={24} />
                        </div>
                    </div>
                </div>

       
            </div>

            {/* قسم المنتجات الأكثر مبيعاً */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold">المنتجات الأكثر مبيعاً</h3>
                        <button className="text-blue-600 text-sm hover:underline">عرض الكل</button>
                    </div>

                    <div className="space-y-4">
                        {topSellingProducts.map(product => (
                            <div key={product.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h4 className="font-medium">{product.name}</h4>
                                    <p className="text-sm text-gray-500">{product.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">{product.price}شيكل</p>
                                    <p className="text-sm text-gray-500">{product.sales} مبيعات</p>
                                </div>
                                <div className={`flex items-center ${product.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {product.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                                    <span className="text-sm">{product.percentage}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

               
            </div>

            {/* قسم المبيعات الشهرية */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold">المبيعات الشهرية</h3>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg">مبيعات</button>
                            <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg">أرباح</button>
                        </div>
                    </div>

                    <div className="h-64 flex items-end gap-2">
                        {monthlySales.map((item, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-all cursor-pointer"
                                    style={{
                                        height: `${(item.amount / maxSales) * 200}px`,
                                        minHeight: '20px'
                                    }}
                                ></div>
                                <p className="text-xs mt-2">{item.month}</p>
                                <p className="text-xs font-bold">{item.amount} شيكل</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-6">توزيع المبيعات حسب الفئة</h3>
                    <div className="space-y-4">
                        {categories.map((category, index) => {
                            const percentage = [45, 25, 20, 10][index]; 
                            return (
                                <div key={category.id} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{category.icon}</span>
                                            <span>{category.name}</span>
                                        </div>
                                        <span className="text-sm font-bold">{percentage}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* قسم إدارة الفئات */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">إدارة الفئات</h3>
                   
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categories.map(category => (
                        <div key={category.id} className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{category.icon}</span>
                                    <h4 className="font-medium">{category.name}</h4>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditCategory(category)}
                                        className="p-1 hover:bg-gray-100 rounded"
                                    >
                                        <Edit2 size={18} className="text-blue-600" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCategory(category.id)}
                                        className="p-1 hover:bg-gray-100 rounded"
                                    >
                                        <Trash2 size={18} className="text-red-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* قسم الدفعات المستحقة */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">الدفعات المستحقة</h3>
                    <div className="flex gap-2">
                        <select className="border rounded-lg px-3 py-1.5 text-sm">
                            <option value="all">جميع الدفعات</option>
                            <option value="installments">شهر 3</option>
                            <option value="partial">   شهر 4</option>
                        </select>
                        <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700">
                            تحديث الحالة
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">رقم الفاتورة</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">العميل</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">المبلغ</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">تاريخ الاستحقاق</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">النوع</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">الحالة</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {upcomingPayments.map((payment, index) => {
                                const daysUntilDue = getDaysUntilDue(payment.dueDate);
                                const isOverdue = daysUntilDue < 0;

                                return (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">{payment.invoiceNumber}</td>
                                        <td className="px-4 py-3">{payment.customerName}</td>
                                        <td className="px-4 py-3">{payment.amount}  شيكل
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {payment.dueDate}
                                                {isOverdue && (
                                                    <span className="inline-flex items-center gap-1 text-red-600 text-sm">
                                                        <AlertCircle size={16} />
                                                        متأخر {Math.abs(daysUntilDue)} يوم
                                                    </span>
                                                )}
                                                {!isOverdue && daysUntilDue <= 7 && (
                                                    <span className="text-yellow-600 text-sm">
                                                        متبقي {daysUntilDue} يوم
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-sm ${payment.type === 'installment'
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : 'bg-purple-100 text-purple-600'
                                                }`}>
                                                {payment.type === 'installment' ? 'قسط' : 'دفعة جزئية'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-sm ${payment.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-600'
                                                    : payment.status === 'overdue'
                                                        ? 'bg-red-100 text-red-600'
                                                        : 'bg-green-100 text-green-600'
                                                }`}>
                                                {payment.status === 'pending' ? 'معلق' :
                                                    payment.status === 'overdue' ? 'متأخر' : 'مدفوع'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                                                    onClick={() => {
                                                        // تحديث حالة الدفعة إلى مدفوع
                                                    }}
                                                >
                                                    تأكيد الدفع
                                                </button>
                                                <button
                                                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                                                    onClick={() => {
                                                        // عرض تفاصيل الفاتورة
                                                    }}
                                                >
                                                    التفاصيل
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* نافذة إضافة/تعديل فئة */}
            {showCategoryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-md p-6">
                        <h3 className="text-xl font-bold mb-4">
                            {editingCategory ? 'تعديل فئة' : 'إضافة فئة جديدة'}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">اسم الفئة</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">الأيقونة</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={newCategory.icon}
                                    onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                                    placeholder="مثال: 🚰"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowCategoryModal(false);
                                    setEditingCategory(null);
                                    setNewCategory({ name: '', icon: '' });
                                }}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleAddCategory}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                {editingCategory ? 'حفظ التعديلات' : 'إضافة'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;