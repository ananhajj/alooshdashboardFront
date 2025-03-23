import React from "react";
import { Building2 } from "lucide-react";
import Swal from "sweetalert2";

const InvoicePrint = ({ invoice }) => {
     return (
        <div className="bg-white p-8">
            
            {/* 🔹 Header Section */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <Building2 size={32} />
                        <h1 className="text-2xl font-bold">معرض علوش</h1>
                    </div>
                    <p className="text-gray-600">شارع جنين_نابلس قرب كازية سيلة الظهر</p>
                    <p className="text-gray-600">هاتف:0568740337</p>
                </div>
                <div className="text-left">
                    <h2 className="text-xl font-bold mb-2">فاتورة مبيعات</h2>
                    <p className="text-gray-600">رقم الفاتورة: {invoice.invoiceNumber}</p>
                    <p className="text-gray-600">التاريخ: {new Date().toLocaleDateString("en-GB")}</p>

                </div>
            </div>

            {/* 🔹 Customer Info */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold mb-2">معلومات العميل</h3>
                <p>الاسم: {invoice.customer?.name || "عميل نقدي"}</p>
                {invoice.customer?.phone && <p>الهاتف: {invoice.customer?.phone}</p>}
           
            </div>

            {/* 🔹 Items Table */}
            <table className="w-full mb-8 border-collapse border border-gray-200">
                <thead className="bg-gray-50">
                    <tr className="border border-gray-200">
                        <th className="py-3 px-4 text-right border">المنتج</th>
                        <th className="py-3 px-4 text-right border">الكمية</th>
                        <th className="py-3 px-4 text-right border">السعر</th>
                        <th className="py-3 px-4 text-right border">المجموع</th>
                    </tr>
                </thead>
                <tbody className="divide-y border">
                    {invoice.items.map((item, index) => (
                        <tr key={index} className="border">
                            <td className="py-3 px-4 border">{item.name}</td>
                            <td className="py-3 px-4 border">
                                {item.quantity} {item.unit === "meter" ? "متر" : "قطعة"}
                            </td>
                            <td className="py-3 px-4 border">{item.price} شيكل</td>
                            <td className="py-3 px-4 border">{item.price * item.quantity} شيكل</td>
                        </tr>
                    ))}
                </tbody>
            </table>
    
            {/* 🔹 Payment Details */}
         
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold mb-4">تفاصيل الدفع</h3>
                <p>
                    طريقة الدفع:{" "}
                    {invoice?.method?.toLowerCase() === "cash"
                        ? "نقدي"
                        : invoice?.method.toLowerCase() === "installments"
                            ? "تقسيط"
                            : "غير معروف"}
                </p>


                 
                {
                    invoice.method !== 'cash' && invoice.payment?.initialPayment > 0 && (
                    <div className="mt-2">
                        <p className="font-medium text-blue-600">✅ الدفعة الأولية: {invoice.payment.initialPayment} شيكل</p>
                    </div>
                )}
           
                {/* ✅ عرض باقي الدفعات */}
                {(invoice.payment?.paymentDetails?.payments?.length > 0 || invoice.payment?.payments?.length > 0) && (
                    <div className="mt-4">
                        <p className="font-medium mb-2">جدول الدفعات:</p>
                        <table className="w-full border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr className="border">
                                    <th className="py-2 px-4 border">رقم الدفعة</th>
                                    <th className="py-2 px-4 border">المبلغ</th>
                                    <th className="py-2 px-4 border">تاريخ الاستحقاق</th>
                                    <th className="py-2 px-4 border">الحالة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(invoice.payment?.paymentDetails?.payments || invoice.payment?.payments)?.map((payment, index) => (
                                    <tr key={index} className="border">
                                        <td className="py-2 px-4 border text-center">{index + 1}</td>
                                        <td className="py-2 px-4 border text-center">{payment.amount} شيكل</td>
                                        <td className="py-2 px-4 border text-center">
                                            {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString("ar") : "غير محدد"}
                                        </td>

                                        <td className="py-2 px-4 border text-center">
                                            <span className={`px-2 py-1 rounded-lg ${payment.status === "paid" ? "bg-green-500 text-white" : "bg-yellow-500 text-black"}`}>
                                                {payment.status.toLowerCase() === "paid" ? "مدفوع" : "قيد الانتظار"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>





            {/* 🔹 Invoice Totals */}
            <div className="space-y-2 text-left border-t pt-4">
                <div className="flex justify-between">
                    <span className="font-medium">المجموع</span>
                    <span>{invoice.subtotal} شيكل</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>الإجمالي</span>
                    <span>{invoice.total} شيكل</span>
                </div>

    
            </div>

            {/* 🔹 Footer Message */}
            <div className="mt-12 text-center text-gray-500 text-sm">
                <p>شكراً لتعاملكم معنا</p>
                <p>يرجى الاحتفاظ بالفاتورة للمراجعة</p>
            </div>
        </div>
    );
};

export default InvoicePrint;
