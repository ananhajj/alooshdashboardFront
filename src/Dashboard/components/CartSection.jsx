import React, { useState } from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";

const CartSection = ({ cart, updateQuantity, calculateTotals, handleCheckout }) => {
    const [discount, setDiscount] = useState(0);
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            {/* العنوان */}
            <div className="flex items-center gap-3 mb-6">
                <ShoppingCart size={28} className="text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">سلة المشتريات</h2>
            </div>

            {/* عرض السلة */}
            {cart.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-lg">
                    السلة فارغة 🛒
                </div>
            ) : (
                <div className="space-y-4 mb-6">
                    {cart.map((item) => {
                        const isMeterUnit = item.unit === "meter";
                        const price = isMeterUnit ? item.product.pricePerMeters : item.product.price;

                        return (
                            <div
                                key={item.product.productId}
                                className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 hover:shadow-md transition-all duration-200 p-2 rounded-lg"
                            >
                                {/* صورة المنتج */}
                                <img
                                    src={item.product.imageUrl}
                                    alt={item.product.name}
                                    className="w-20 h-20 rounded-xl object-cover border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform"
                                />

                                {/* تفاصيل المنتج */}
                                <div className="flex-1">
                                    <h4 className="font-medium text-lg text-gray-900 dark:text-gray-100">
                                        {item.product.name}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {price} شيكل {isMeterUnit && "/ متر"}
                                    </p>
                                </div>

                                {/* أزرار التحكم بالكمية */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.product.productId,
                                                isMeterUnit ? Math.max(item.quantity - 0.1, 0.1) : Math.max(item.quantity - 1, 0)
                                            )
                                        }
                                        className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition active:scale-95"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-8 text-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {isMeterUnit ? item.quantity.toFixed(2) : item.quantity}
                                    </span>
                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.product.productId,
                                                isMeterUnit ? item.quantity + 0.1 : item.quantity + 1,
                                                item.unit
                                            )
                                        }
                                        disabled={
                                            (isMeterUnit && item.quantity >= item.product.quantityInMeters) ||
                                            (!isMeterUnit && item.quantity >= item.product.quantity)
                                        }
                                        className={`p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition active:scale-95 
        ${(isMeterUnit && item.quantity >= item.product.quantityInMeters) ||
                                                (!isMeterUnit && item.quantity >= item.product.quantity)
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                            }`}
                                    >
                                        <Plus size={18} />
                                    </button>

                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* المجموع وإتمام الشراء */}
            {cart.length > 0 && (
                <>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                        <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-gray-100">
                            <span>الإجمالي</span>
                            <span>{calculateTotals().total.toFixed(2)} شيكل</span>
                        </div>
                        <div className="mt-2">
                            {/* هنا تضيف حقل لتحديد قيمة الخصم */}
                            <label htmlFor="discount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                أدخل قيمة الخصم
                            </label>
                            <input
                                type="number"
                                id="discount"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                className="w-full p-2 mt-1 border rounded-lg text-gray-900 dark:text-gray-100 dark:bg-gray-800"
                                placeholder="أدخل المبلغ الذي تريد خصمه"
                            />
                        </div>
                        <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-gray-100 mt-3">
                            <span>الإجمالي بعد الخصم</span>
                            <span>{calculateTotals(discount).total.toFixed(2)} شيكل</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-800 transition-all text-lg font-semibold active:scale-95"
                        >
                            إتمام الشراء
                        </button>
                    </div>
                </>
            )}

        </div>
    );
};

export default CartSection;
