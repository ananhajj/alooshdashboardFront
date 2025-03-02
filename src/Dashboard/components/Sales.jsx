import React, { useState, useEffect } from "react";
import { Search, Plus, Minus, ShoppingCart, CreditCard, Banknote, Plus as PlusIcon } from "lucide-react";
import Swal from "sweetalert2";
import InvoicePrint from "./InvoicePrint";
import CartSection from "./CartSection";

const Sales = () => {
    // Load categories and products from localStorage
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);

    // Load from localStorage on mount
    useEffect(() => {
        const storedCategories = JSON.parse(localStorage.getItem("categories")) || [];
        const storedProducts = JSON.parse(localStorage.getItem("products")) || [];

        setCategories(storedCategories);
        setProducts(storedProducts);
    }, []);

    // Search and filtering states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    // Cart and invoice states
    const [cart, setCart] = useState([]);
    const [showInvoice, setShowInvoice] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [currentInvoice, setCurrentInvoice] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", id: "" });
    const [customPayments, setCustomPayments] = useState([]);
    const [newPayment, setNewPayment] = useState({ amount: "", dueDate: "" });

    // Add to cart
    const addToCart = (product) => {
        const existingItem = cart.find((item) => item.product.id === product.id);
        if (existingItem) {
            setCart(cart.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)));
        } else {
            setCart([...cart, { product, quantity: 1 }]);
        }
    };
    const addCustomPayment = () => {
        if (!newPayment.amount || !newPayment.dueDate) {
            Swal.fire("خطأ", "يرجى إدخال مبلغ وتاريخ صحيح!", "error");
            return;
        }

        let totalPaid = customPayments.reduce((sum, p) => sum + Number(p.amount), 0) + Number(newPayment.amount);
        let remaining = calculateTotals().total - totalPaid;

        if (remaining < 0) {
            Swal.fire("خطأ", "إجمالي المدفوعات لا يمكن أن يتجاوز المبلغ الإجمالي!", "error");
            return;
        }

        setCustomPayments([...customPayments, { ...newPayment, status: "pending" }]);
        setNewPayment({ amount: "", dueDate: "" });
    };


    const removeCustomPayment = (index) => {
        let updatedPayments = customPayments.filter((_, i) => i !== index);
        setCustomPayments(updatedPayments);
    };


    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            setCart(cart.filter((item) => item.product.id !== productId));
            return;
        }
        setCart(cart.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item)));
    };

    const calculateTotals = () => {
        const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        const total = subtotal ;
        return { subtotal, total };
    };


    const handleCheckout = () => {
        if (cart.length === 0) {
            Swal.fire("تنبيه!", "السلة فارغة", "warning");
            return;
        }
        setShowPaymentModal(true);
    };

    const handlePaymentSubmit = () => {
        const { subtotal, total } = calculateTotals();

        // حساب إجمالي المدفوع من الدفعات
        let totalPaid = paymentMethod === "cash" ? total : customPayments.reduce((sum, p) => sum + Number(p.amount), 0);
        let remainingAmount = total - totalPaid;

        if (paymentMethod === "payments" && customPayments.length === 0) {
            Swal.fire("خطأ", "يجب إضافة دفعة واحدة على الأقل!", "error");
            return;
        }

        let paymentDetails = {
            method: paymentMethod,
            total,
            paid: totalPaid,
            remaining: remainingAmount,
            status: remainingAmount === 0 ? "completed" : "pending",
            payments: paymentMethod === "cash" ? [] : customPayments,
            nextPayment: customPayments.length > 0 ? customPayments[0].dueDate : null,
        };

        const invoiceData = {
            invoiceNumber: `INV-${Date.now()}`,
            date: new Date().toLocaleDateString("ar-SA"),
            items: cart.map((item) => ({
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity
            })),
            subtotal,
            total,
            customer: customerInfo,
            payment: paymentDetails,
        };

        setCurrentInvoice(invoiceData);
        setShowPaymentModal(false);
        setShowInvoice(true);
        setCart([]);
        setCustomPayments([]);
    };


    // Filtered products based on search and category
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.includes(searchTerm) || product.code?.includes(searchTerm);
        const matchesCategory = !selectedCategory || Number(product.categoryId) === Number(selectedCategory);
        return matchesSearch && matchesCategory;
    });

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex gap-4 mb-6">
                            <div className="flex-1 relative">
                                <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="بحث عن منتج..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <select className="border rounded-lg px-4 py-2" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                                <option value="">جميع الفئات</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="border rounded-lg p-4 hover:border-blue-500">
                                    {product.image && <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-3" />}
                                    <h3 className="font-medium">{product.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2">الكمية الموجودة: {product.quantity}</p>
                                    <div className="flex items-center justify-between">
                                        <p className="font-bold text-blue-600">{product.price}شيكل</p>
                                        <button onClick={() => addToCart(product)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cart Section */}
                <CartSection
                    cart={cart}
                    updateQuantity={updateQuantity}
                    calculateTotals={calculateTotals}
                    handleCheckout={handleCheckout}
                />
            </div>
            {/* نافذة الدفع */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
                        <h3 className="text-xl font-bold mb-4">تفاصيل الدفع</h3>

                        {/* معلومات العميل */}
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium mb-1">اسم العميل</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={customerInfo.name}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
                                <input
                                    type="tel"
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={customerInfo.phone}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                />
                            </div>
                            {paymentMethod !== 'cash' && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">رقم الهوية</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-lg px-3 py-2"
                                        value={customerInfo.id}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, id: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>

                        {/* طرق الدفع */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button
                                className={`p-4 border rounded-lg flex flex-col items-center gap-2 ${paymentMethod === 'cash' ? 'border-blue-500 bg-blue-50' : ''
                                    }`}
                                onClick={() => {
                                    setPaymentMethod('cash');
                                    setCustomPayments([]);
                                }}
                            >
                                <Banknote className="text-blue-600" />
                                <span>نقدي</span>
                            </button>
                            <button
                                className={`p-4 border rounded-lg flex flex-col items-center gap-2 ${paymentMethod === 'payments' ? 'border-blue-500 bg-blue-50' : ''
                                    }`}
                                onClick={() => setPaymentMethod('payments')}
                            >
                                <CreditCard className="text-blue-600" />
                                <span>دفعات</span>
                            </button>
                        </div>

                        {/* نظام الدفعات */}
                        {paymentMethod === 'payments' && (
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium">جدول الدفعات</h4>
                                    <div className="flex gap-4 items-center">
                                        <p className="text-sm text-gray-500">
                                            المبلغ الإجمالي: {calculateTotals().total} شيكل
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            المتبقي: {calculateTotals().total - customPayments.reduce((sum, p) => sum + Number(p.amount), 0)} شيكل
                                        </p>
                                    </div>
                                </div>

                                {/* إضافة دفعة جديدة */}
                                <div className="flex gap-3 mb-4">
                                    <input
                                        type="number"
                                        placeholder="المبلغ"
                                        className="flex-1 border rounded-lg px-3 py-2"
                                        value={newPayment.amount}
                                        onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                                    />
                                    <input
                                        type="date"
                                        className="flex-1 border rounded-lg px-3 py-2"
                                        value={newPayment.dueDate}
                                        onChange={(e) => setNewPayment({ ...newPayment, dueDate: e.target.value })}
                                    />
                                    <button
                                        onClick={addCustomPayment}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                    >
                                        <PlusIcon size={16} />
                                        إضافة دفعة
                                    </button>
                                </div>

                                {/* جدول الدفعات */}
                                {customPayments.length > 0 && (
                                    <div className="border rounded-lg overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-right">الدفعة</th>
                                                    <th className="px-4 py-2 text-right">المبلغ</th>
                                                    <th className="px-4 py-2 text-right">تاريخ الاستحقاق</th>
                                                    <th className="px-4 py-2 text-right">الإجراءات</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {customPayments.map((payment, index) => (
                                                    <tr key={index}>
                                                        <td className="px-4 py-2">دفعة {index + 1}</td>
                                                        <td className="px-4 py-2">{payment.amount} شيكل</td>
                                                        <td className="px-4 py-2">{payment.dueDate}</td>
                                                        <td className="px-4 py-2">
                                                            <button
                                                                onClick={() => removeCustomPayment(index)}
                                                                className="text-red-600 hover:text-red-700"
                                                            >
                                                                حذف
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handlePaymentSubmit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                disabled={paymentMethod !== 'cash' && customPayments.length === 0}
                            >
                                تأكيد وطباعة الفاتورة
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* نافذة الفاتورة */}
            {showInvoice && currentInvoice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl">
                        <div className="p-4 border-b">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold">معاينة الفاتورة</h3>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => {
                                            const printWindow = window.open('', '_blank');
                                            printWindow.document.write('<html dir="rtl"><head><title>فاتورة</title>');
                                            printWindow.document.write('<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">');
                                            printWindow.document.write('</head><body>');
                                            printWindow.document.write(document.getElementById('invoice-content').innerHTML);
                                            printWindow.document.write('</body></html>');
                                            printWindow.document.close();
                                            printWindow.print();
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        طباعة
                                    </button>
                                    <button
                                        onClick={() => setShowInvoice(false)}
                                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                    >
                                        إغلاق
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-6" id="invoice-content">
                            <InvoicePrint invoice={currentInvoice} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
export default Sales;
