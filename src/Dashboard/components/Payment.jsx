import { AlertCircle } from "lucide-react";
import { useContext, useState } from "react";

import Swal from "sweetalert2";
import axios from "axios";
import { PublicContext } from "../context/PublicContext";

function Payment() {
  const { upcomingPayments, setUpcomingPayments, loading, setLoading } =
    useContext(PublicContext);
  const [selectedMonth, setSelectedMonth] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all"); // حالة الفلترة
 
   const uniqueMonths = [
    ...new Set(
      upcomingPayments.map((payment) => {
        const date = new Date(payment.dueDate);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      })
    ),
  ];

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

    const filteredPayments = upcomingPayments
        .filter((payment) => {
            const paymentMonth = `${new Date(payment.dueDate).getFullYear()}-${String(
                new Date(payment.dueDate).getMonth() + 1
            ).padStart(2, "0")}`;
            return selectedMonth === "all" || paymentMonth === selectedMonth;
        })
        .filter((payment) => {
            if (selectedStatus === "paid") return payment.status === "paid"; 
            if (selectedStatus === "pending") return payment.status !== "paid";  
            return true;  
        });

  const handleConfirmPayment = async (paymentId) => {
      
    setLoading(true);

    try {
      const response = await axios.put(
        `https://alooshbackend-production.up.railway.app/api/payment/paid/${paymentId}`,
        {},
        {
          headers: { "Content-Type": "application/json"  },
        }
      );
      
      if (response.status === 200) {
        const updatedPayment = response.data;

        Swal.close();
        Swal.fire({
          icon: "success",
          title: "تم دفع الفاتورة!",
          text: `تم الدفع بنجاح للفاتورة رقم: ${updatedPayment.invoiceNumber}`,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });

        setUpcomingPayments((prevPayments) =>
          prevPayments.map((payment) =>
            payment.paymentId === updatedPayment.paymentId
              ? { ...payment, status: updatedPayment.status }
              : payment
          )
        );
      }
    } catch (error) {
      let errorMessage = "حدث خطأ أثناء الدفع.";
      if (error.response && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "خطأ!",
        text: errorMessage,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentClick = async (paymentId) => {
      const payment = upcomingPayments.find(p => p.paymentId === paymentId);
      if (payment.status === "paid") {

          Swal.fire({
              icon: "info",
              title: "الفاتورة مدفوعة بالفعل",
              text: "لا حاجة لإعادة تأكيد الدفع.",
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
          });
          return;
      }
    Swal.fire({
      title: "هل أنت متأكد من الدفع؟",
      text: "بمجرد تأكيد الدفع، سيتم تنفيذ العملية.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، تأكيد الدفع",
      cancelButtonText: "لا، إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        handleConfirmPayment(paymentId);
        Swal.close();
        Swal.fire("تم التأكيد!", "تمت العملية بنجاح.", "success");
      } else {
        Swal.close();
        Swal.fire("تم الإلغاء", "لم يتم تأكيد الدفع.", "info");
      }
    });
  };



  return (
      <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white"
          >  الدفعات المستحقة
          </h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex gap-4 mb-6 justify-end">
                  <div className="flex item-end  relative">
                      <select
                          className="appearance-none border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 pr-10 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(e.target.value)}
                      >
                          <option value="all">📅 جميع الدفعات</option>
                          {uniqueMonths.map((month) => (
                              <option key={month} value={month}>
                                  {new Date(`${month}-01`).toLocaleDateString("ar-EG", {
                                      year: "numeric",
                                      month: "long",
                                  })}
                              </option>
                          ))}
                      </select>
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                          ▼
                      </span>
                  </div>

                
                  <div className="relative">
                      <select
                          className="appearance-none border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 pr-10 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                          <option value="all">🔍 كل الحالات</option>
                          <option value="pending">🟡 غير مدفوعة</option>
                          <option value="paid">🟢 مدفوعة</option>
                      </select>
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                          ▼
                      </span>
                  </div>
              </div>

   
        <div className="overflow-x-auto ax-h-[50vh]">
        <table className="w-full table-auto">
        <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {[
                "رقم الفاتورة",
                "العميل",
                "المبلغ",
                "تاريخ الاستحقاق",
                "النوع",
                "الحالة",
                "الإجراءات",
              ].map((header, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
            {filteredPayments.map((payment, index) => {
              const daysUntilDue = getDaysUntilDue(payment.dueDate);
              const isOverdue = daysUntilDue < 0;

              return (
                <tr
                  key={index}
                  className="hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                    {payment.invoiceNumber}
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                    {payment.customerName}
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                    {payment.amount} شيكل
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                    <div className="flex items-center gap-2">
                      {payment.dueDate}

                      {payment.status !== "paid" && isOverdue && (
                        <span className="inline-flex items-center gap-1 text-red-500 text-sm">
                          <AlertCircle size={16} />
                          متأخر {Math.abs(daysUntilDue)} يوم
                        </span>
                      )}

                      {payment.status !== "paid" && !isOverdue && daysUntilDue <= 7 && (
                        <span className="text-yellow-500 text-sm">
                          متبقي {daysUntilDue} يوم
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        payment.type === "installment"
                          ? "bg-blue-500 text-white"
                          : "bg-purple-500 text-white"
                      }`}
                    >
                      قسط
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {(() => {
           
                      const status = payment.status === "paid"
                        ? "paid"
                        : getDaysUntilDue(payment.dueDate) < 0
                          ? "overdue"
                          : payment.status;

                      return (
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium
                    ${status === "pending"
                              ? "text-gray-900 dark:text-gray-100"
                              : status === "overdue"
                                ? "text-red-600 dark:text-red-400"
                                : status === "paid"
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-gray-900 dark:text-gray-1000"}`}
                        >
                          {status === "pending"
                            ? "قيد الإنتظار"
                            : status === "overdue"
                              ? "متأخر"
                              : status === "paid"
                                ? "مدفوع"
                                : "غير معروف"}
                        </span>
                      );
                    })()}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                              <button
                                  onClick={() => handlePaymentClick(payment.paymentId)}
                                  className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400"
                              
                              >
                                  {payment.status === "paid" ? "تم الدفع" : "تأكيد الدفع"}
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
     </div>
  );
}

export default Payment;
