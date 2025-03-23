import React, { useState, useContext } from "react";
import {
  Search,
  Plus,
  Minus,
  ShoppingCart,
  CreditCard,
  Banknote,
  Plus as PlusIcon,
} from "lucide-react";
import Swal from "sweetalert2";
import InvoicePrint from "./InvoicePrint";
import CartSection from "./CartSection";
import { PublicContext } from "../context/publicContext";
import html2canvas from "html2canvas";
import { createRoot } from "react-dom/client";
import axios from "axios";
import Loading from "../Loading/Loading";

const Sales = () => {
  const {
    products,
    setProducts,
    categories,
    setCategories,
    loading,
    setLoading,
    refreshData
  } = useContext(PublicContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
  });
  const [customPayments, setCustomPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({ amount: "", dueDate: "" });
  const [initialPayment, setInitialPayment] = useState(0);
  const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");

  const validToken = storedToken;
  const addToCart = (product) => {
    if (product.unitType === "METER") {
      Swal.fire({
        title: "اختر طريقة البيع",
        text: "هل تريد البيع بالمتر أم بالربطة؟",
        icon: "question",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "🟢 بيع بالمتر",
        denyButtonText: "🟡 بيع بالربطة",
        cancelButtonText: "❌ إلغاء",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "🟢 أدخل عدد الأمتار المطلوبة",
            input: "number",
            inputAttributes: {
              min: "0.1",
              step: "0.1",
              max: product.quantityInMeters,
            },
            showCancelButton: true,
            confirmButtonText: "إضافة",
            cancelButtonText: " إلغاء",
          }).then((meterResult) => {
            if (meterResult.isConfirmed) {
              const meters = parseFloat(meterResult.value);

              const existingItem = cart.find(
                (item) =>
                  item.product.productId === product.productId &&
                  item.unit === "meter"
              );

              if (existingItem) {
                setCart(
                  cart.map((item) =>
                    item.product.productId === product.productId &&
                    item.unit === "meter"
                      ? { ...item, quantity: item.quantity + meters }
                      : item
                  )
                );
              } else {
                setCart([
                  ...cart,
                  { product, quantity: meters, unit: "meter" },
                ]);
              }
            }
          });
        } else if (result.isDenied) {
          Swal.fire({
            title: "🟡 أدخل عدد الربطات المطلوبة",
            input: "number",
            inputAttributes: {
              min: "1",
              step: "1",
              max: product.quantity,
            },
            showCancelButton: true,
            confirmButtonText: "إضافة",
            cancelButtonText: " إلغاء",
          }).then((rollResult) => {
            if (rollResult.isConfirmed) {
              const rolls = parseInt(rollResult.value, 10);

              const existingItem = cart.find(
                (item) =>
                  item.product.productId === product.productId &&
                  item.unit === "roll"
              );

              if (existingItem) {
                setCart(
                  cart.map((item) =>
                    item.product.productId === product.productId &&
                    item.unit === "roll"
                      ? { ...item, quantity: item.quantity + rolls }
                      : item
                  )
                );
              } else {
                setCart([...cart, { product, quantity: rolls, unit: "roll" }]);
              }
            }
          });
        }
      });
    } else {
      const existingItem = cart.find(
        (item) =>
          item.product.productId === product.productId && item.unit === "piece"
      );

      if (existingItem) {
        setCart(
          cart.map((item) =>
            item.product.productId === product.productId &&
            item.unit === "piece"
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        setCart([...cart, { product, quantity: 1, unit: "piece" }]);
      }
    }
  };

  const addCustomPayment = () => {
    if (!newPayment.amount || !newPayment.dueDate) {
      Swal.fire("خطأ", "يرجى إدخال مبلغ وتاريخ صحيح!", "error");
      return;
    }

    let totalPaid =
      customPayments.reduce((sum, p) => sum + Number(p.amount), 0) +
      Number(newPayment.amount) +
      initialPayment; // إضافة الدفعة الأولية للحساب

    let remaining = calculateTotals().total - totalPaid;

    if (remaining < 0) {
      Swal.fire(
        "خطأ",
        "إجمالي المدفوعات لا يمكن أن يتجاوز المبلغ الإجمالي!",
        "error"
      );
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
    setCart(
      cart
        .map((item) => {
          if (item.product.productId === productId) {
            const maxStock =
              item.unit === "meter"
                ? item.product.quantityInMeters
                : item.product.quantity;

            if (newQuantity > maxStock) {
              return { ...item, quantity: maxStock };
            }

            if (newQuantity < 1) {
              return null;
            }

            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const calculateTotals = (discount = 0) => {
    const subtotal = cart.reduce((sum, item) => {
      if (item.unit === "meter") {
        return sum + item.quantity * item.product.pricePerMeters;
      } else {
        return sum + item.quantity * item.product.price;
      }
    }, 0);
    localStorage.setItem("subtotal", subtotal);
    const total = subtotal - discount;
    localStorage.setItem("total", total);
    return { total, subtotal };
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Swal.fire("تنبيه!", "السلة فارغة", "warning");
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = () => {
    const total = Number(localStorage.getItem("total"));
    const subtotal = Number(localStorage.getItem("subtotal"));

    if (!customerInfo.name || !customerInfo.phone) {
      Swal.fire("خطأ", "يرجى ملء جميع المعلومات المطلوبة!", "error");
      return;
    }
    if (paymentMethod === "payments" && customPayments.length === 0) {
      Swal.fire("خطأ", "يجب إضافة دفعة واحدة على الأقل!", "error");
      return;
    }

    let paymentDetails = {
      payments: paymentMethod === "cash" ? [] : customPayments,
     
    };

    const invoiceData = {
      method:paymentMethod,
      date: new Date().toLocaleDateString("ar"),
      items: cart.map((item) => {
        const isMeterUnit = item.unit === "meter";
        return {
          productId: item.product.productId,
          name: item.product.name,
          price: isMeterUnit ? item.product.pricePerMeters : item.product.price,
          quantity: item.quantity,
          unit: item.unit,
          totalPrice: isMeterUnit
            ? item.quantity * item.product.pricePerMeters
            : item.quantity * item.product.price,
        };
      }),
      subtotal: subtotal,
      total: total,
      customer: customerInfo,
      payment: {
        initialPayment: initialPayment,
         paymentDetails,
      }
    };

    setCurrentInvoice(invoiceData);
    setShowPaymentModal(false);
    setShowInvoice(true);
    setCart([]);
    setCustomPayments([]);
  };



 
  const sendInvoiceToBackend = async () => {
    let  filteredInvoice={};
    if(paymentMethod=='cash'){
     filteredInvoice = {
      invoiceNumber: currentInvoice.invoiceNumber,
      customerName: currentInvoice.customer.name,
      customerPhone: currentInvoice.customer.phone,
      subtotal: currentInvoice.subtotal,
      total: currentInvoice.total,
      paymentMethod: currentInvoice?.method
        ? currentInvoice.method.toUpperCase()
        : "UNKNOWN",
      items: currentInvoice.items.map((item) => {
  
        const quantityInMeter = item.unit === "meter" ? item.quantity : null;

        return {
          productId: item.productId,
          quantity: item.unit === "meter" ? null : item.quantity,  
          quantityInMeter,  
        };
      }),


    };
  }
    else{
      filteredInvoice = {
        invoiceNumber: currentInvoice.invoiceNumber,
        customerName: currentInvoice.customer.name,
        customerPhone: currentInvoice.customer.phone,
        subtotal: currentInvoice.subtotal,
        total: currentInvoice.total,
        initialPayment: currentInvoice.payment?.initialPayment,
        payments: currentInvoice.payment.paymentDetails.payments.map((payment) => ({
          amount: payment.amount,
          paymentDate: payment.dueDate,
        })),
        paymentMethod: currentInvoice?.method
          ? currentInvoice.method.toUpperCase()
          : "UNKNOWN",
        items: currentInvoice.items.map((item) => {

          const quantityInMeter = item.unit === "meter" ? item.quantity : null;

          return {
            productId: item.productId,
            quantity: item.unit === "meter" ? null : item.quantity,
            quantityInMeter,
          };
        }),


      };
    
  }
    setLoading(true);
    try {
      const response = await axios.post("https://alooshbackend-production.up.railway.app/api/invoice", filteredInvoice);

      Swal.fire({
        title: "تم إرسال الفاتورة!",
        text: "تمت العملية بنجاح.",
        icon: "success",
        confirmButtonText: "حسناً",
      });

       setShowInvoice(false);
    } catch (error) {
      Swal.fire({
        title: "خطأ!",
        text: "فشل في إرسال الفاتورة. الرجاء المحاولة لاحقًا.",
        icon: "error",
        confirmButtonText: "موافق",
      });

      console.error("خطأ أثناء إرسال الفاتورة:", error.response?.data || error.message);
    }finally{
      setLoading(false);
    }
  };

  const generateJPG = async (container) => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const canvas = await html2canvas(container, {
            scale: 2, // تحسين الجودة
            useCORS: true, // دعم الصور الخارجية
            windowWidth: 754.672,
            windowHeight: container.scrollHeight,
          });

          const imgData = canvas.toDataURL("image/jpeg", 0.9); // الجودة 90%

          const byteCharacters = atob(imgData.split(",")[1]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const imgBlob = new Blob([byteArray], { type: "image/jpeg" });

          resolve({ imgBlob, fileName: `invoice-${currentInvoice.invoiceNumber}.jpg` });
        } catch (error) {
          console.error("Error generating JPG:", error);
          reject(error);
        }
      }, 500);
    });
  };

  const handleDownload = async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(<InvoicePrint invoice={currentInvoice} />);

    try {
      const { imgBlob, fileName } = await generateJPG(container);

      // إنشاء رابط لتحميل الصورة
      const link = document.createElement("a");
      const imageUrl = URL.createObjectURL(imgBlob);

      link.href = imageUrl;
      link.download = fileName; // اسم الملف الذي سيتم تحميله
      link.click(); // تنفيذ التحميل

      // تنظيف الـ DOM بعد العملية
      root.unmount();
      document.body.removeChild(container);
    } catch (error) {
      console.error("Error during download process:", error);
    }
  };



  const handlePrintAndSend = async () => {
    try {
      
      await sendInvoiceToBackend();

   
      handleDownload();

   
      refreshData();

 
      localStorage.removeItem("total");
      localStorage.removeItem("subtotal");

    } catch (error) {
      console.error("Error occurred:", error);
 
    }
  };


  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.includes(searchTerm) || product.code?.includes(searchTerm);
    const matchesCategory =
      !selectedCategory ||
      Number(product.categoryId) === Number(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  if(loading){
    return(
      <Loading/>
    )
  }
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative w-full md:w-2/3">
                <Search
                  className="absolute right-4 top-3 text-gray-400 dark:text-gray-300"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="بحث عن منتج..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <select
                className="w-full md:w-1/3 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2 bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">جميع الفئات</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div className="max-h-[600px] overflow-y-auto px-2">

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts
                .filter((product) =>
                  product.unitType === "METER"
                    ? product.quantity > 0 || product.quantityInMeters > 0
                    : product.quantity > 0
                )
                .map((product) => (
                  <div
                    key={product.productId}
                    className="border border-gray-300 dark:border-gray-700 rounded-2xl p-4 shadow-md hover:shadow-lg transition duration-300 bg-white dark:bg-gray-800"
                  >
                    {product.imageUrl && (
                      <div className="overflow-hidden rounded-xl mb-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full aspect-[4/3] object-cover transition-transform transform hover:scale-105"
                        />
                      </div>
                    )}

                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      الكمية المتاحة:{" "}
                      {product.unitType === "METER"
                        ? `${product.quantityInMeters} متر ${
                            product.quantity > 0
                              ? `(${product.quantity} ربطة)`
                              : ""
                          }`
                        : `${product.quantity} قطعة`}
                    </p>

                    <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      {product.unitType === "METER" ? (
                        <>
                          <p>💰 سعر الربطة: {product.price} شيكل</p>
                          <p>📏 سعر المتر: {product.pricePerMeters} شيكل</p>
                          <p className="text-green-600 dark:text-green-400 font-medium">
                            ✅ يباع بالمتر أو بالربطة
                          </p>
                        </>
                      ) : (
                        <>
                          <p>💰 سعر القطعة: {product.price} شيكل</p>
                          <p className="text-blue-600 dark:text-blue-400 font-medium">
                            ✅ يباع كقطعة
                          </p>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <button
                        onClick={() => addToCart(product)}
                        className="p-2 bg-blue-500 dark:bg-blue-700 text-white rounded-xl hover:bg-blue-600 dark:hover:bg-blue-800 transition flex items-center gap-1"
                      >
                        <Plus size={18} />{" "}
                        <span className="text-sm">أضف للسلة</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
</div>
          </div>
        </div>

        <CartSection
          cart={cart}
          updateQuantity={updateQuantity}
          calculateTotals={(discount) => calculateTotals(discount)}
          handleCheckout={handleCheckout}
        />
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6 space-y-6">
            <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white">تفاصيل الدفع</h3>

            {/* معلومات العميل */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-200">اسم العميل</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  value={customerInfo.name}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, name: e.target.value })
                  }
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-200">رقم الهاتف</label>
                <input
                  type="tel"
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  value={customerInfo.phone}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, phone: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* طرق الدفع */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <button
                className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors duration-300 ${paymentMethod === "cash" ? "border-blue-500 bg-blue-50 dark:bg-blue-900 dark:text-white" : "hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                onClick={() => {
                  setPaymentMethod("cash");
                  setCustomPayments([]);
                }}
              >
                <Banknote className="text-blue-600" />
                <span>نقدي</span>
              </button>
              <button
                className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors duration-300 ${paymentMethod === "installments" ? "border-blue-500 bg-blue-50 dark:bg-blue-900 dark:text-white" : "hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                onClick={() => setPaymentMethod("installments")}
              >
                <CreditCard className="text-blue-600" />
                <span>دفعات</span>
              </button>
            </div>

            {/* نظام الدفعات */}
            {paymentMethod === "installments" && (
              <div className="space-y-6">
                {/* إدخال الدفعة الأولية */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-200">الدفعة الأولية</label>
                  <input
                    type="number"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    placeholder="أدخل الدفعة الأولية"
                    value={initialPayment}
                    onChange={(e) => setInitialPayment(Number(e.target.value))}
                  />
                </div>

                {/* جدول الدفعات */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    المبلغ الإجمالي: {calculateTotals().total} شيكل
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    المتبقي:{" "}
                    {calculateTotals().total -
                      initialPayment -
                      customPayments.reduce((sum, p) => sum + Number(p.amount), 0)}{" "}
                    شيكل
                  </p>
                </div>

                {/* إدخال دفعة جديدة */}
                <div className="flex gap-4 mb-4">
                  <input
                    type="number"
                    placeholder="المبلغ"
                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  />
                  <input
                    type="date"
                    className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    value={newPayment.dueDate}
                    onChange={(e) => setNewPayment({ ...newPayment, dueDate: e.target.value })}
                  />
                  <button
                    onClick={addCustomPayment}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-800 dark:hover:bg-blue-700"
                    disabled={!initialPayment || initialPayment <= 0}
                  >
                    <PlusIcon size={16} />
                    إضافة دفعة
                  </button>
                </div>

                {/* جدول الدفعات */}
                {customPayments.length > 0 && (
                  <div className="border rounded-lg overflow-hidden dark:border-gray-600">
                    <table className="w-full table-auto">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-600 dark:text-gray-200">الدفعة</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-600 dark:text-gray-200">المبلغ</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-600 dark:text-gray-200">تاريخ الاستحقاق</th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-600 dark:text-gray-200">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-gray-600">
                        {customPayments.map((payment, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm">{`دفعة ${index + 1}`}</td>
                            <td className="px-4 py-2 text-sm">{payment.amount} شيكل</td>
                            <td className="px-4 py-2 text-sm">{payment.dueDate}</td>
                            <td className="px-4 py-2 text-sm">
                              <button
                                onClick={() => removeCustomPayment(index)}
                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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

            {/* الأزرار */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-6 py-3 border rounded-lg hover:bg-gray-50 text-sm text-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                إلغاء
              </button>
              <button
                onClick={handlePaymentSubmit}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm dark:bg-blue-800 dark:hover:bg-blue-700"
                disabled={
                  paymentMethod !== "cash" &&
                  calculateTotals().total - initialPayment - customPayments.reduce(
                    (sum, p) => sum + Number(p.amount),
                    0
                  ) > 0
                }
              >
                تأكيد
              </button>
            </div>
          </div>
        </div>
      )}



      {showInvoice && currentInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl">
            <div className="p-6 border-b bg-gray-50">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-gray-800">
                  معاينة الفاتورة
                </h3>

                <div className="flex space-x-6 gap-2">
                  <button
                    onClick={handlePrintAndSend}
                    className="bg-green-600 text-white py-2 px-8 rounded-xl shadow-md hover:bg-green-700 transition-all"
                  >
                    طباعة الفاتورة وحفظها
                  </button>

                  <button
                    onClick={() => {
                      setCurrentInvoice(null);
                      setCustomerInfo({
                        name: "",
                        phone: "",
                      });
                      setShowPaymentModal(false);
                      setShowInvoice(false);
                      setCart([]);
                      setCustomPayments([]);
                    }}
                    className="bg-red-600 text-white py-2 px-8 rounded-xl shadow-md hover:bg-red-700 transition-all ease-in-out duration-200"
                  >
                    حذف الفاتورة
                  </button>
                </div>
              </div>
            </div>

            <div
              className="p-6 overflow-auto max-h-[80vh]"
              id="invoice-content"
            >
              <InvoicePrint invoice={currentInvoice} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Sales;
