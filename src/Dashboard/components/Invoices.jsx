import React, { useContext, useState } from 'react';
import { Printer, Download, Eye, Search } from 'lucide-react';
import InvoicePrint from './InvoicePrint';

import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import { PublicContext } from '../context/PublicContext';

const Invoices = () => {
    const [showInvoice, setShowInvoice] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const {invoices,setInvoices,loading,setLoading}=useContext(PublicContext);
   
   

    const handleOpenInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setShowInvoice(true);
    };
    const generateImageForPrint = async (container) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    const canvas = await html2canvas(container, {
                        scale: 2,
                        useCORS: true,
                        windowWidth: 754.672,
                        windowHeight: container.scrollHeight,
                    });

                    const imgData = canvas.toDataURL("image/jpeg", 0.9);

                    const byteCharacters = atob(imgData.split(",")[1]);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const imgBlob = new Blob([byteArray], { type: "image/jpeg" });

                    resolve({ imgBlob, imgData });
                } catch (error) {
                    console.error("Error generating image:", error);
                    reject(error);
                }
            }, 500);
        });
    };

    const handlePrint = async (invoice) => {
        const container = document.createElement("div");
        document.body.appendChild(container);

        const root = createRoot(container);
        root.render(<InvoicePrint invoice={invoice} />);

        try {
            const { imgData } = await generateImageForPrint(container);

            const printWindow = window.open("", "_blank");
            printWindow.document.write(`
            <html>
                <head><title>طباعة الفاتورة</title></head>
                <body style="text-align: center;">
                    <img src="${imgData}" />
                    <script type="text/javascript">
                        window.onload = function() {
                            window.print();
                            window.onafterprint = function () {
                                window.close();
                            }
                        }
                    </script>
                </body>
            </html>
        `);

           
            setTimeout(() => {
                root.unmount();
                document.body.removeChild(container);
            }, 1000);
        } catch (error) {
            console.error("Error during print process:", error);
        }
    };

    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch =
            invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !filterStatus || invoice.method === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const generateJPG = async (container) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    const canvas = await html2canvas(container, {
                        scale: 2, 
                        useCORS: true, 
                        windowWidth: 754.672,
                        windowHeight: container.scrollHeight,
                    });

                    const imgData = canvas.toDataURL("image/jpeg", 0.9); 

                    const byteCharacters = atob(imgData.split(",")[1]);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const imgBlob = new Blob([byteArray], { type: "image/jpeg" });

                    resolve({ imgBlob, fileName: `invoice-${new Date()}.jpg` });
                } catch (error) {
                    console.error("Error generating JPG:", error);
                    reject(error);
                }
            }, 500);
        });
    };
    const handleDownload = async (invoice) => {
        if (!invoice) {
            console.error("Invoice is null or undefined");
            return;
        }
        const container = document.createElement("div");
        document.body.appendChild(container);
    
        const root = createRoot(container);
        root.render(<InvoicePrint invoice={invoice} />);
    
        try {
          const { imgBlob, fileName } = await generateJPG(container);
    
     
          const link = document.createElement("a");
          const imageUrl = URL.createObjectURL(imgBlob);
    
          link.href = imageUrl;
          link.download = fileName;
          link.click(); 
    
        
          root.unmount();
          document.body.removeChild(container);
        } catch (error) {
          console.error("Error during download process:", error);
        }
      };

    return (
        <div className=''>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">الفواتير</h2>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute right-3 top-2.5 text-gray-400 dark:text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="بحث عن فاتورة..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <select
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">جميع الفواتير</option>
                        <option value="CASH">فواتير الكاش</option>
                        <option value="INSTALLMENTS">فواتير الأقساط</option>
                    </select>
                </div>

                <div className="overflow-x-auto  max-h-[50vh]">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700 ">
                            <tr>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 dark:text-gray-200">رقم الفاتورة</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 dark:text-gray-200">التاريخ</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 dark:text-gray-200">العميل</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 dark:text-gray-200">المبلغ</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 dark:text-gray-200">المدفوع</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 dark:text-gray-200">المتبقي</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 dark:text-gray-200">الحالة</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600 dark:text-gray-200">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                            {filteredInvoices.map((invoice) => (
                                <tr key={invoice.invoiceNumber} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{invoice.invoiceNumber}</td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-white">{invoice.date}</td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-white">{invoice.customer.name}</td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-white">{invoice.total} شيكل</td>

                                    {invoice.method === 'INSTALLMENTS' ? (
                                        <>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white">
                                                {invoice.payment?.initialPayment || 0} شيكل
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white">
                                                {
                                                    invoice.total - (invoice.payment?.initialPayment || 0) - invoice.payment?.payments?.reduce((acc, payment) => {
                                                        return payment.status === 'PAID' ? acc + payment.amount : acc;
                                                    }, 0)
                                                } شيكل
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-6 py-4">-</td>
                                            <td className="px-6 py-4">-</td>
                                        </>
                                    )}

                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${invoice.method === 'CASH' || invoice.payment.payments.every(payment => payment.status === 'PAID')
                                                ? 'bg-green-100 text-green-600 dark:bg-green-700 dark:text-green-100'
                                                : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-700 dark:text-yellow-100'
                                                }`}
                                        >
                                            {invoice.method === 'CASH' || invoice.payment.payments.every(payment => payment.status === 'PAID')
                                                ? 'مدفوعة'
                                                : 'معلقة'
                                            }
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                                                title="عرض"
                                                onClick={() => handleOpenInvoice(invoice)}
                                            >
                                                <Eye size={18} className="text-gray-600 dark:text-gray-300" />
                                            </button>
                                            <button
                                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                                                title="طباعة"
                                                onClick={() => handlePrint(invoice)}
                                            >
                                                <Printer size={18} className="text-blue-600 dark:text-blue-400" />
                                            </button>
                                            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded" title="تحميل" onClick={() => handleDownload(invoice)} >
                                                <Download size={18} className="text-green-600 dark:text-green-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


            </div>


            {showInvoice && selectedInvoice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl">
                        <div className="p-4 border-b">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold">معاينة الفاتورة</h3>
                                <div className="space-x-2">
                           
                                    <button
                                        onClick={() => setShowInvoice(false)}
                                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                    >
                                        إغلاق
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div
                            className="p-6 overflow-auto max-h-[80vh]"
                            id="invoice-content"
                        >
                            <InvoicePrint invoice={selectedInvoice} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Invoices;