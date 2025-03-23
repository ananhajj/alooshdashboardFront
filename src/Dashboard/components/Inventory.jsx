import React, { useState, useEffect, useContext } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  MinusCircle,
  PlusCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import { PublicContext } from "../context/publicContext";
import Loading from "../Loading/Loading";
import axios from "axios";

const Inventory = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const { products, setProducts, categories, loading, setLoading } =
    useContext(PublicContext);
  const [newProduct, setNewProduct] = useState({
    name: "",
    categoryId: "",
    price: "",
    quantity: "",
    unitType: "",
    image: null,
    rollSize: "",
    quantityInMeters: "",
    pricePerMeters: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  if (loading) {
    return <Loading />;
  }

  const filteredProducts = products.filter((product) => {
    return (
      (selectedCategory === "" ||
        Number(product.categoryId) === Number(selectedCategory)) &&
      (searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (
      !newProduct.name ||
      !newProduct.categoryId ||
      !newProduct.price ||
      !newProduct.quantity
    ) {
      Swal.fire({
        title: "خطأ!",
        text: "يرجى ملء جميع الحقول!",
        icon: "error",
        confirmButtonText: "موافق",
      });
      return;
    }
    
    const formData = new FormData();
    formData.append("productName", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("quantity", newProduct.quantity);
    formData.append("unitType", newProduct.unitType);
    formData.append("categoryId", newProduct.categoryId);
    formData.append("image", newProduct.image);
    if (newProduct.rollSize !== undefined && newProduct.rollSize !== null) {
      formData.append("rollSize", newProduct.rollSize);
    }
    if (
      newProduct.quantityInMeters !== undefined &&
      newProduct.quantityInMeters !== null
    ) {
      formData.append("quantityInMeters", newProduct.quantityInMeters);
    }
    if (
      newProduct.pricePerMeters !== undefined &&
      newProduct.pricePerMeters !== null
    ) {
      formData.append("pricePerMeters", newProduct.pricePerMeters);
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://alooshbackend-production.up.railway.app/api/product",
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data" ,
          },
        }
      );
      const addedProduct = response.data.product;
      setProducts([...products, addedProduct]);
      setNewProduct({
        name: "",
        categoryId: "",
        price: "",
        quantity: "",
        unitType: "",
        image: null,
        rollSize: "",
        quantityInMeters: "",
        pricePerMeters: "",
      });
      Swal.fire({
        icon: "success",
        title: "تمت الإضافة!",
        text: "تمت إضافة المنتج بنجاح!",
      });
      setShowAddModal(false);
    } catch (error) {
      console.error("خطأ في إضافة المنتج:", error);

      let errorMessage = "حدث خطأ أثناء إضافة المنتج. يرجى المحاولة مرة أخرى.";

      if (error.response && error.response.data.message) {
        const serverMessage = error.response.data.message;

        if (serverMessage === "Category Not Found") {
          errorMessage = "الفئة غير موجودة!";
        } else if (serverMessage === "Product Name Already Exists") {
          errorMessage = "اسم المنتج موجود بالفعل!";
        } else if (serverMessage === "Unit Type Not Found") {
          errorMessage = "نوع الكمية غير صحيح!";
        } else if (serverMessage === "Required part 'image' is not present.") {
          errorMessage = "الرجاء اختيار صورة للمنتج!";
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

  const handleEditProduct = (productId) => {
    const productToEdit = products.find(
      (product) => product.productId === productId
    );
    setEditedProduct({ ...productToEdit });
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("productId", editedProduct.productId);
    formData.append("name", editedProduct.name);
    formData.append("price", editedProduct.price);
    formData.append("quantity", editedProduct.quantity);
    formData.append("unitType", editedProduct.unitType);
    formData.append("categoryId", editedProduct.categoryId);
    formData.append("rollSize", editedProduct.rollSize);
    formData.append("quantityInMeters", editedProduct.quantityInMeters);
    formData.append("pricePerMeters", editedProduct.pricePerMeters);

    if (editedProduct.imageUrl) {
      formData.append("image", editedProduct.imageUrl);
    }
    try {
      const response = await axios.put(
        `https://alooshbackend-production.up.railway.app/api/product/${editedProduct.productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productId === response.data.productId
            ? response.data
            : product
        )
      );

      Swal.fire({
        icon: "success",
        title: "تم التحديث!",
        text: "تم تعديل المنتج بنجاح.",
      });

      setShowEditModal(false);
    } catch (error) {
      console.error("خطأ في تحديث المنتج:", error);
      let errorMessage = "حدث خطأ أثناء تحديث المنتج.";
      if (error.response && error.response.data.message) {
        errorMessage = error.response.data.message;
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
  const handleDeleteProduct = (id) => {
    Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع عن هذا!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم، احذف المنتج!",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://alooshbackend-production.up.railway.app/api/product/${id}`
          )
          .then((response) => {
            const updateProduct = products.filter(
              (pro) => pro.productId !== id
            );
            setProducts(updateProduct);

            Swal.fire({
              title: "تم الحذف!",
              text: "تم حذف المنتج    بنجاح.",
              icon: "success",
              confirmButtonText: "موافق",
            });
          })
          .catch((error) => {
            console.error("خطأ في حذف المنتج:", error);
            Swal.fire({
              title: "خطأ!",
              text: "حدث خطأ أثناء حذف المنتج. يرجى المحاولة مرة أخرى.",
              icon: "error",
              confirmButtonText: "موافق",
            });
          });
      }
    });
  };

  const toggleDetails = (productId) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
  };
  return (
    <div className="bg-gray-50 dark:bg-gray-900 mt-2">
      <div className="flex dark:bg-gray-800 justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          المخزون
        </h2>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 dark:bg-blue-800 text-white px-5 py-2.5 rounded-lg flex items-center gap-4 shadow-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <Plus size={22} />
          <span className="font-semibold">إضافة منتج</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <div className="relative w-full md:flex-1">
            <Search
              className="absolute right-3 top-3 text-gray-400 dark:text-gray-300"
              size={20}
            />
            <input
              type="text"
              placeholder="بحث عن منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:ring-blue-700"
            />
          </div>

          <div className="w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-48 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:ring-blue-700"
            >
              <option value="">جميع الفئات</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-2">
        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">

          <table className="w-full border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-blue-50 dark:bg-blue-800 text-gray-700 dark:text-gray-100">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-semibold border-b dark:border-gray-600">
                  المنتج
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold border-b dark:border-gray-600">
                  الفئة
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold border-b dark:border-gray-600">
                  السعر
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold border-b dark:border-gray-600">
                  الكمية
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold border-b dark:border-gray-600">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <React.Fragment key={product.productId}>
                    <tr
                      className={`hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 
            ${
              product.quantity === 0
                ? "bg-gray-300 dark:bg-gray-700 opacity-60"
                : "bg-white dark:bg-gray-800"
            }`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {categories.find(
                          (cat) => cat.categoryId === product.categoryId
                        )?.categoryName || "غير محدد"}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {product.price}{" "}
                        <span className="text-red-500 text-sm font-bold">
                          {product.unitType === "METER"
                            ? "شيكل الربطة  "
                            : "شيكل القطعة"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {product.quantity}
                        {product.quantity === 0 && (
                          <span className="text-red-500 font-bold ml-2">
                            منتهي من المخزون
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <button
                          onClick={() => handleEditProduct(product.productId)}
                          className="p-2 bg-blue-600 dark:bg-blue-800 hover:bg-blue-700 dark:hover:bg-blue-700 text-white rounded-lg transition"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.productId)}
                          className="p-2 bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                        {product.unitType === "METER" && (
                          <button
                            onClick={() => toggleDetails(product.productId)}
                            className="p-2 bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition"
                          >
                            {expandedProductId === product.productId ? (
                              <MinusCircle size={18} />
                            ) : (
                              <PlusCircle size={18} />
                            )}
                          </button>
                        )}
                      </td>
                    </tr>

                    {/* تفاصيل المنتج التي تظهر عند الضغط */}
                    {expandedProductId === product.productId &&
                      product.unitType === "METER" && (
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <td colSpan="5" className="px-6 py-4 text-right">
                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-200">
                              <p>
                                <strong>عدد الربطات:</strong> {product.quantity}
                              </p>
                              <p>
                                <strong>حجم الربطة:</strong> {product.rollSize}{" "}
                                متر
                              </p>
                              <p>
                                <strong>الكمية الإجمالية بالمتر:</strong>{" "}
                                {product.quantityInMeters} متر
                              </p>
                              <p>
                                <strong>السعر لكل متر:</strong>{" "}
                                {product.pricePerMeters} شيكل
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    لا توجد منتجات متاحة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-8 space-y-6">
            <h3 className="text-2xl font-semibold text-center text-gray-700 dark:text-gray-100">
              إضافة منتج جديد
            </h3>
            <form onSubmit={handleAddProduct} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  اسم المنتج
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  صورة المنتج
                </label>
                <input
                  type="file"
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  accept="image/*"
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.files[0] })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  الفئة
                </label>
                <select
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  value={newProduct.categoryId}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, categoryId: e.target.value })
                  }
                  required
                >
                  <option value="">اختر فئة</option>
                  {categories.map((category) => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  نوع الكمية
                </label>
                <select
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  value={newProduct.unitType}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, unitType: e.target.value })
                  }
                  required
                >
                  <option value="">اختر نوع الكمية</option>
                  <option value="PIECE">بالعدد</option>
                  <option value="METER">بالمتر</option>
                </select>
              </div>

              {newProduct.unitType === "METER" ? (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* عدد الربطات */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        عدد الربطات
                      </label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                        value={newProduct.quantity}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            quantity: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    {/* حجم الربطة */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        حجم الربطة (بالمتر)
                      </label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                        value={newProduct.rollSize}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            rollSize: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* سعر الربطة */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      سعر الربطة
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {/* الكمية الإجمالية بالمتر */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        الكمية الإجمالية بالمتر
                      </label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                        value={newProduct.quantityInMeters}
                        placeholder={`${
                          newProduct.quantity * newProduct.rollSize
                        } حسب ما قمت بإدخاله`}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            quantityInMeters: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    {/* السعر لكل متر */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        السعر لكل متر
                      </label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                        value={newProduct.pricePerMeters}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            pricePerMeters: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      السعر
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      الكمية
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                      value={newProduct.quantity}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          quantity: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition dark:bg-blue-800 dark:hover:bg-blue-700"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg animate-fade-in">
            <h3 className="text-xl font-bold dark:text-gray-200 mb-4">
              تعديل المنتج
            </h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm dark:text-gray-300 font-medium mb-1">
                  اسم المنتج
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  value={editedProduct.name}
                  onChange={(e) =>
                    setEditedProduct({ ...editedProduct, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm dark:text-gray-300 font-medium mb-1">
                  صورة الفئة
                </label>
                <input
                  type="file"
                  className="w-full dark:bg-gray-800 border rounded-lg px-3 py-2"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setEditedProduct({ ...editedProduct, imageUrl: file });
                  }}
                />
              </div>

              {editedProduct.imageUrl ? (
                <div>
                  <label className="block text-sm dark:text-gray-300 font-medium mb-1">
                    الصورة المختارة
                  </label>
                  <img
                    src={editedProduct.imageUrl}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              ) : editedProduct.imageUrl &&
                editedProduct.imageUrl instanceof File ? (
                <div>
                  <label className="block text-sm dark:text-gray-300 font-medium mb-1">
                    الصورة المختارة
                  </label>
                  <img
                    src={URL.createObjectURL(editedProduct.imageUrl)}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                    onLoad={() => URL.revokeObjectURL(editedProduct.imageUrl)}
                  />
                </div>
              ) : null}

              <div>
                <label className="block text-sm dark:text-gray-300 font-medium text-gray-600 mb-2">
                  الفئة
                </label>
                <select
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  value={editedProduct.categoryId}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      categoryId: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">اختر فئة</option>
                  {categories.map((category) => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm dark:text-gray-300 font-medium text-gray-600 mb-2">
                  نوع الكمية
                </label>
                <select
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  value={editedProduct.unitType}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      unitType: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">اختر نوع الكمية</option>
                  <option value="PIECE">بالعدد</option>
                  <option value="METER">بالمتر</option>
                </select>
              </div>
              {editedProduct.unitType === "METER" ? (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* عدد الربطات */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        عدد الربطات
                      </label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                        value={editedProduct.quantity}
                        onChange={(e) =>
                          setEditedProduct({
                            ...editedProduct,
                            quantity: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    {/* حجم الربطة */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        حجم الربطة (بالمتر)
                      </label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                        value={editedProduct.rollSize}
                        onChange={(e) =>
                          setEditedProduct({
                            ...editedProduct,
                            rollSize: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* سعر الربطة */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      سعر الربطة
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                      value={editedProduct.price}
                      onChange={(e) =>
                        setEditedProduct({
                          ...editedProduct,
                          price: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {/* الكمية الإجمالية بالمتر */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        الكمية الإجمالية بالمتر
                      </label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                        onChange={(e) =>
                          setEditedProduct({
                            ...editedProduct,
                            quantityInMeters: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    {/* السعر لكل متر */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        السعر لكل متر
                      </label>
                      <input
                        type="number"
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                        value={editedProduct.pricePerMeters}
                        onChange={(e) =>
                          setEditedProduct({
                            ...editedProduct,
                            pricePerMeters: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      السعر
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                      value={editedProduct.price}
                      onChange={(e) =>
                        setEditedProduct({
                          ...editedProduct,
                          price: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      الكمية
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                      value={editedProduct.quantity}
                      onChange={(e) =>
                        setEditedProduct({
                          ...editedProduct,
                          quantity: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  disabled={loading}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "جارٍ الحفظ..." : "حفظ التعديلات"}
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





