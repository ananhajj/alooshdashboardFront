import React from "react";
import { Building2 } from "lucide-react";

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
                {invoice.customer?.phone && <p>الهاتف: {invoice.customer.phone}</p>}
                {invoice.customer?.id && <p>رقم الهوية: {invoice.customer.id}</p>}
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
                            <td className="py-3 px-4 border">{item.quantity}</td>
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
                    {invoice.payment?.method === "cash"
                        ? "نقدي"
                        : invoice.payment?.method === "partial"
                            ? "دفعات"
                            : "تقسيط"}
                </p>

                {/* Installment Payments */}
                {invoice.payment?.method === "installments" && invoice.payment?.installments?.length > 0 && (
                    <div className="mt-4">
                        <p className="font-medium mb-2">جدول الأقساط:</p>
                        {invoice.payment.installments.map((installment, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <span>القسط {index + 1}</span>
                                <span>{installment.amount} شيكل</span>
                                <span>{formatDate(installment.dueDate)}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Partial Payments */}
                {invoice.payment?.method === "partial" && invoice.payment?.payments?.length > 0 && (
                    <div className="mt-4">
                        <p className="font-medium mb-2">الدفعات المستلمة:</p>
                        {invoice.payment.payments.map((payment, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <span>دفعة {index + 1}</span>
                                <span>{payment.amount} شيكل</span>
                                <span>{formatDate(payment.date)}</span>
                            </div>
                        ))}
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

                {invoice.payment?.method !== "cash" && (
                    <>
                     
                        <div className="flex justify-between text-red-600">
                            <span>المتبقي</span>
                            <span>{invoice.payment.remaining} شيكل</span>
                        </div>
                    </>
                )}
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
