import React from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";

const CartSection = ({ cart, updateQuantity, calculateTotals, handleCheckout }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            {/* 🛒 Header */}
            <div className="flex items-center gap-3 mb-6">
                <ShoppingCart size={24} className="text-blue-600" />
                <h2 className="text-xl font-bold">سلة المشتريات</h2>
            </div>

            {/* 🛒 إذا كانت السلة فارغة */}
            {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">السلة فارغة</div>
            ) : (
                <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                        <div key={item.product.id} className="flex items-center gap-3 border-b pb-4">
                            {/* صورة المنتج */}
                            <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-16 h-16 rounded-lg object-cover"
                            />
                            {/* معلومات المنتج */}
                            <div className="flex-1">
                                <h4 className="font-medium">{item.product.name}</h4>
                                <p className="text-sm text-gray-500">{item.product.price}شيكل</p>
                            </div>
                            {/* أزرار التحكم في الكمية */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                    className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                    className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 🛒 إذا كان هناك منتجات في السلة */}
            {cart.length > 0 && (
                <>
                    <div className="space-y-3 border-t pt-4">
               
                   
                        <div className="flex justify-between font-bold text-lg">
                            <span>الإجمالي</span>
                            <span>{calculateTotals().total}شيكل</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
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
