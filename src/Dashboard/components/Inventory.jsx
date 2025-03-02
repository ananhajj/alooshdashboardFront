import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

const Inventory = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: "", category: "", price: "", quantity: "" });
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");  
    const [selectedCategory, setSelectedCategory] = useState("");  
    useEffect(() => {
        const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
        setProducts(savedProducts);

        const savedCategories = JSON.parse(localStorage.getItem("categories")) || [];
        setCategories(savedCategories);
    }, []);

    useEffect(() => {
        if (products.length > 0) {
        localStorage.setItem("products", JSON.stringify(products));
        }
    }, [products]);


    const filteredProducts = products.filter(product => {
        return (
            (selectedCategory === "" || Number(product.categoryId) === Number(selectedCategory)) &&
            (searchQuery === "" || product.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    });

    const handleAddProduct = (e) => {
        e.preventDefault();

        if (!newProduct.name || !newProduct.categoryId || !newProduct.price || !newProduct.quantity) {
            Swal.fire({
                title: "خطأ!",
                text: "يرجى ملء جميع الحقول!",
                icon: "error",
                confirmButtonText: "موافق"
            });
            return;
        }

        const newId = Date.now();
        setProducts([...products, {
            id: newId,
            ...newProduct,
            categoryId: Number(newProduct.categoryId) 
        }]);

        setNewProduct({ name: "", categoryId: "", price: "", quantity: "" });
        setShowAddModal(false);

    
        Swal.fire({
            title: "تمت الإضافة!",
            text: "تمت إضافة المنتج بنجاح.",
            icon: "success",
            confirmButtonText: "موافق"
        });
    };


 

    useEffect(() => {
        const savedCategories = JSON.parse(localStorage.getItem("categories")) || [];
        setCategories(savedCategories);
    }, []);
    const handleDeleteProduct = (id) => {
        Swal.fire({
            title: "هل أنت متأكد؟",
            text: "لن تتمكن من التراجع عن هذا!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "نعم، احذف المنتج!",
            cancelButtonText: "إلغاء"
        }).then((result) => {
            if (result.isConfirmed) {
                setProducts(products.filter(product => product.id !== id));

                Swal.fire({
                    title: "تم الحذف!",
                    text: "تم حذف المنتج بنجاح.",
                    icon: "success",
                    confirmButtonText: "موافق"
                });
            }
        });
    };


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">المخزون</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={20} />
                    إضافة منتج
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="بحث عن منتج..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                    >
                        <option value="">جميع الفئات</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-right text-sm font-semibold border-b">المنتج</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold border-b">الفئة</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold border-b">السعر</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold border-b">الكمية</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold border-b">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-100 transition duration-200">
                                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                        {product.image && (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                        )}
                                        <span>{product.name}</span>
                                    </td>


                                    <td className="px-6 py-4 text-gray-700">
                                        {categories.find(cat => cat.id === product.categoryId)?.name || "غير محدد"}
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        {product.price} <span className="text-red-500 text-sm font-bold">شيكل</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">{product.quantity}</td>
                                    <td className="px-6 py-4 flex items-center space-x-2 gap-2">
                                        <button className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition">
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">إضافة منتج جديد</h3>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">اسم المنتج</label>
                                <input type="text" className="w-full border rounded-lg px-3 py-2"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">صورة المنتج</label>
                                <input
                                    type="file"
                                    className="w-full border rounded-lg px-3 py-2"
                                    accept="image/*"
                                    onChange={(e) => setNewProduct({ ...newProduct, image: URL.createObjectURL(e.target.files[0]) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">الفئة</label>
                                <select
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={newProduct.categoryId}
                                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                                    required
                                >
                                    <option value="">اختر فئة</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">السعر</label>
                                <input type="number" className="w-full border rounded-lg px-3 py-2"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                    required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">الكمية</label>
                                <input type="number" className="w-full border rounded-lg px-3 py-2"
                                    value={newProduct.quantity}
                                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                                    required />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                                    إلغاء
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    حفظ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;