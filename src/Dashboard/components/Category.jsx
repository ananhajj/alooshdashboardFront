import { Plus, Edit2, Trash2, X } from "lucide-react";
import { useContext } from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Loading from "../Loading/Loading";
import { PublicContext } from "../context/PublicContext";

function Category() {
  const { categories, setCategories, loading, setLoading } =
    useContext(PublicContext);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "", image: null });
  const [showProducts, setShowProducts] = useState(null);

  if (loading) {
    return <Loading />;
  }

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.image) {
      Swal.fire({
        icon: "warning",
        title: "تنبيه!",
        text: "الرجاء إدخال اسم الفئة واختيار صورة!",
        toast: true,
        position: 'top-center',
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", newCategory.name);
    formData.append("image", newCategory.image);
    setLoading(true);
    try {
      const response = await axios.post(
        "https://alooshbackend-production.up.railway.app/api/category",
        formData,
        {
          headers: {
             "Content-Type": "multipart/form-data" ,
            },
        }
      );
 

      const addedCategory = response.data.category;
      setCategories([...categories, addedCategory]);

      setNewCategory({ name: "", image: null });
      setEditingCategory(null);
      setShowCategoryModal(false);

      Swal.fire({
        icon: "success",
        title: "تمت الإضافة!",
        text: "تمت إضافة الفئة بنجاح!",
      });
    } catch (error) {
      console.error("خطأ في إضافة الفئة:", error);

      let errorMessage = "حدث خطأ أثناء إضافة الفئة. يرجى المحاولة مرة أخرى.";

      if (error.response && error.response.data.message) {
        const serverMessage = error.response.data.message;

        if (serverMessage === "Category already exists") {
          errorMessage = "الفئة موجودة بالفعل!";
        } else if (serverMessage === "Required part 'image' is not present.") {
          errorMessage = "الرجاء اختيار صورة للفئة!";
        }
      }

      Swal.fire({
        icon: "error",
        title: "خطأ!",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async () => {
    if (!newCategory.name || !newCategory.image) {
      Swal.fire({
        icon: "warning",
        title: "تنبيه!",
        text: "الرجاء إدخال اسم الفئة واختيار صورة!",
      });
      return;
    }
   
    const formData = new FormData();
    formData.append("categoryName", newCategory.name);
    formData.append("image", newCategory.image);
    setLoading(true);
    try {
      const response = await axios.put(
        `https://alooshbackend-production.up.railway.app/api/category/${editingCategory.categoryId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedCategory = response.data.category;
      setCategories(
        categories.map((cat) =>
          cat.categoryId === updatedCategory.categoryId ? updatedCategory : cat
        )
      );

      setNewCategory({ name: "", image: null });
      setEditingCategory(null);
      setShowCategoryModal(false);

      Swal.fire({
        icon: "success",
        title: "تم التعديل!",
        text: "تم تعديل الفئة بنجاح!",
      });
    } catch (error) {
      console.error("خطأ في تعديل الفئة:", error);
      Swal.fire({
        icon: "error",
        title: "خطأ!",
        text: "حدث خطأ أثناء تعديل الفئة. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategoryClick = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.categoryName,
      image: category.categoryImg,
    });
    setShowCategoryModal(true);
  };

  const handleAddCategoryClick = () => {
    setEditingCategory(null);
    setNewCategory({ name: "", image: null });
    setShowCategoryModal(true);
  };

const handleDeleteCategory = (categoryId) => {
  const category = categories.find((cat) => cat.categoryId === categoryId);
  const relatedProducts = category.products?.length;

  let warningMessage = "لن تتمكن من التراجع عن هذا!";
  if (relatedProducts > 0) {
    warningMessage = `سيتم حذف جميع المنتجات (${relatedProducts}) المرتبطة بهذه الفئة أيضًا!`;
  }

  Swal.fire({
    title: "هل أنت متأكد؟",
    text: warningMessage,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "نعم، احذف الفئة!",
    cancelButtonText: "إلغاء",
  }).then((result) => {
    if (result.isConfirmed) {
      axios
        .delete(`https://alooshbackend-production.up.railway.app/api/category/${categoryId}`)
        .then((response) => {
          const updatedCategories = categories.filter(
            (cat) => cat.categoryId !== categoryId
          );
          setCategories(updatedCategories);

          Swal.fire({
            title: "تم الحذف!",
            text: "تم حذف الفئة وجميع المنتجات المرتبطة بها بنجاح.",
            icon: "success",
            confirmButtonText: "موافق",
          });
        })
        .catch((error) => {
          console.error("خطأ في حذف الفئة:", error.response?.data || error.message);
          
          if (error.response && error.response.data && error.response.data.message.includes("foreign key constraint")) {
            Swal.fire({
              title: "خطأ!",
              text: "لا يمكن حذف المنتج لأنه مرتبط بفواتير في النظام.",
              icon: "error",
              confirmButtonText: "موافق",
            });
          } else {
            Swal.fire({
              title: "خطأ!",
              text: "حدث خطأ أثناء حذف الفئة. يرجى المحاولة مرة أخرى.",
              icon: "error",
              confirmButtonText: "موافق",
            });
          }
        });
    }
  });
};

  return (
    <>
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm mb-8 mt-2">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            إدارة الفئات
          </h3>
          <button
            onClick={handleAddCategoryClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 dark:bg-blue-800 dark:hover:bg-blue-700"
          >
            <Plus size={20} />
            إضافة فئة جديدة
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category.categoryId}
              className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm hover:shadow-md transition duration-300 bg-white dark:bg-gray-800"
            >
              <img
                src={category.categoryImg}
                alt={category.categoryName}
                className="w-full aspect-[4/3] object-cover rounded-xl mb-3 transition-transform transform hover:scale-105"
              />

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-lg text-gray-900 dark:text-gray-100">
                    {category.categoryName}
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCategoryClick(category)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Edit2
                        size={18}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.categoryId)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Trash2
                        size={18}
                        className="text-red-600 dark:text-red-400"
                      />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center text-sm">
                    <button
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-md transition duration-300"
                      onClick={() => {
                        const relatedProducts = category.products || [];
                        setShowProducts({
                          ...category,
                          products: relatedProducts,
                        });
                      }}
                    >
                      المنتجات
                      <span className="text-red-400 font-medium ml-2">
                        ({category.products?.length || 0})
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showProducts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                المنتجات{" "}
                <span className="text-red-500">
                  {showProducts.products.length}
                </span>
              </h3>
              <button
                onClick={() => setShowProducts(null)}
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            <ul className="space-y-3">
              {showProducts.products.length > 0 ? (
                showProducts.products.map((product) => (
                  <li
                    key={product.productId}
                    className="bg-gray-100 dark:bg-gray-500 p-3 rounded-lg flex justify-between items-center"
                  >
                    {product.productName}
                    <span className="text-sm bg-gray-300 dark:bg-gray-600 px-2 py-1 rounded-full">
                      منتج
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  لا يوجد منتجات مرتبطة بالفئة
                </p>
              )}
            </ul>

            <button
              onClick={() => setShowProducts(null)}
              className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {editingCategory ? "تعديل فئة" : "إضافة فئة جديدة"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  اسم الفئة
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  صورة الفئة
                </label>
                <input
                  type="file"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-gray-100"
                  accept="image/*"
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, image: e.target.files[0] })
                  }
                />
              </div>
              {newCategory.image ? (
                newCategory.image instanceof File ? (
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      الصورة المختارة
                    </label>
                    <img
                      src={URL.createObjectURL(newCategory.image)}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      الصورة المختارة
                    </label>
                    <img
                      src={newCategory.image}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                  </div>
                )
              ) : null}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setEditingCategory(null);
                  setNewCategory({ name: "", image: null });
                }}
                className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                إلغاء
              </button>
              <button
                onClick={
                  editingCategory ? handleEditCategory : handleAddCategory
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                {editingCategory ? "حفظ التعديلات" : "إضافة"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Category;
