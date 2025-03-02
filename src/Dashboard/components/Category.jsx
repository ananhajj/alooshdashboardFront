import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function Category() {
    const [categories, setCategories] = useState([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({ name: '', image: null });
    const [showProducts, setShowProducts] = useState(null);

   
    useEffect(() => {
        const savedCategories = JSON.parse(localStorage.getItem('categories')) || [];
        setCategories(savedCategories);
    }, []);


    useEffect(() => {
        if (categories.length > 0) {
            localStorage.setItem('categories', JSON.stringify(categories));
        }
    }, [categories]);

    const handleAddCategory = () => {
        if (newCategory.name) {
            if (editingCategory) {
                const updatedCategories = categories.map(cat =>
                    cat.id === editingCategory.id
                        ? { ...cat, name: newCategory.name, image: newCategory.image }
                        : cat
                );
                setCategories(updatedCategories);
            } else {
                const newId = Date.now(); 
                setCategories([...categories, { id: newId, ...newCategory }]);
            }
            setNewCategory({ name: '', image: null });
            setEditingCategory(null);
            setShowCategoryModal(false);
        }
    };


    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setNewCategory({ name: category.name, image: category.image });
        setShowCategoryModal(true);
    };

    const handleDeleteCategory = (categoryId) => {
        const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
        const relatedProducts = storedProducts.filter(product => Number(product.categoryId) === categoryId);

        let warningMessage = "لن تتمكن من التراجع عن هذا!";
        if (relatedProducts.length > 0) {
            warningMessage = `سيتم حذف جميع المنتجات (${relatedProducts.length}) المرتبطة بهذه الفئة أيضًا!`;
        }

        Swal.fire({
            title: "هل أنت متأكد؟",
            text: warningMessage,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "نعم، احذف الفئة!",
            cancelButtonText: "إلغاء"
        }).then((result) => {
            if (result.isConfirmed) {
            
                const updatedCategories = categories.filter(cat => cat.id !== categoryId);
                setCategories(updatedCategories);
                localStorage.setItem("categories", JSON.stringify(updatedCategories));

               
                const updatedProducts = storedProducts.filter(product => Number(product.categoryId) !== categoryId);
                localStorage.setItem("products", JSON.stringify(updatedProducts));

                Swal.fire({
                    title: "تم الحذف!",
                    text: "تم حذف الفئة وجميع المنتجات المرتبطة بها بنجاح.",
                    icon: "success",
                    confirmButtonText: "موافق"
                });
            }
        });
    };



    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">إدارة الفئات</h3>
                    <button
                        onClick={() => {
                            setEditingCategory(null);
                            setNewCategory({ name: '', image: null });
                            setShowCategoryModal(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Plus size={20} />
                        إضافة فئة جديدة
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categories.map(category => (
                        <div
                            key={category.id}
                            className="border rounded-lg p-4 cursor-pointer bg-gray-50 transition-all hover:bg-gray-100 hover:shadow-lg hover:scale-105"
                            onClick={() => {
                                const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
                                const relatedProducts = storedProducts.filter(product => Number(product.categoryId) === category.id);
                                setShowProducts({ ...category, products: relatedProducts });

                            }
}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    {category.image && <img src={category.image} alt={category.name} className="w-12 h-12 rounded-full" />}
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
                                        onClick={(e) => {
                                            e.stopPropagation(); // منع انتشار الحدث
                                            handleDeleteCategory(category.id);
                                        }}
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
            {showProducts && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">{showProducts.name} - المنتجات</h3>
                            <button onClick={() => setShowProducts(null)} className="text-gray-500 hover:text-gray-800">
                                <X size={24} />
                            </button>
                        </div>

                        <ul className="space-y-3">
                            {showProducts.products.length > 0 ? (
                                showProducts.products.map((product) => (
                                    <li key={product.id} className="bg-gray-100 p-3 rounded-lg flex justify-between items-center">
                                        {product.name}
                                        <span className="text-sm bg-gray-300 px-2 py-1 rounded-full">منتج</span>
                                    </li>
                                ))
                            ) : (
                                <p>لا يوجد منتجات مرتبطة بالفئة</p>
                            )}

                        </ul>

                        <button
                            onClick={() => setShowProducts(null)}
                            className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            إغلاق
                        </button>
                    </div>
                </div>
            )}

            {showCategoryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
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
                                <label className="block text-sm font-medium mb-1">صورة الفئة</label>
                                <input
                                    type="file"
                                    className="w-full border rounded-lg px-3 py-2"
                                    accept="image/*"
                                    onChange={(e) => setNewCategory({ ...newCategory, image: URL.createObjectURL(e.target.files[0]) })}
                                />
                            </div>
                            {newCategory.image && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">الصورة المختارة</label>
                                    <img src={newCategory.image} alt="Category" className="w-full max-w-xs mx-auto" />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowCategoryModal(false);
                                    setEditingCategory(null);
                                    setNewCategory({ name: '', image: null });
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
        </>
    );
}

export default Category;
