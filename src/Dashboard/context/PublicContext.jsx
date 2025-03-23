import axios from "axios";
import { createContext, useEffect, useMemo, useState } from "react";
 
export const PublicContext = createContext();

const PublicContextProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [upcomingPayments, setUpcomingPayments] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [infoStats, setInfoStats] = useState({});
    const [detail, setDetails] = useState({});
    const [topSalesProducts, setTopSalesProducts] = useState([]);
    const [categorySales, setCategorySales] = useState([]);


    const fetchCategory = async () => {
     
        setLoading(true);
        try {
            const response = await axios.get("https://alooshbackend-production.up.railway.app/api/categories");
           
            const data = response.data.categories;
            setCategories(data);
        } catch (error) {
            console.error("Error Fetching Category:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProduct = async () => {
    
        setLoading(true);
        try {
            const response = await axios.get("https://alooshbackend-production.up.railway.app/api/products");
             const data = response.data.products;
            setProducts(data);
        } catch (error) {
            console.error("Error Fetching Product:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPayment = async () => {
    
        setLoading(true);
        try {
            const response = await axios.get(
                "https://alooshbackend-production.up.railway.app/api/payment/installment");
            const data = response.data;
            setUpcomingPayments(data);
        } catch (error) {
            console.error("Error Fetching Payment:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInvoice = async () => {
 
        setLoading(true);
        try {
            const response = await axios.get("https://alooshbackend-production.up.railway.app/api/invoice");
            const data = response.data;
            setInvoices(data);
        } catch (error) {
            console.error("Error Fetching Invoices:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInfoDashBoard = async () => {
     
        setLoading(true);
        try {
            const response = await axios.get("https://alooshbackend-production.up.railway.app/api/dashboard");
            const data = response.data;
            console.log("da",data);
            setInfoStats({
                totalSales: data.totalSales,
                unPaidPayment: data.unPaidPayment,
                totalTodayPayment: data.totalTodayPayment,
            });
            setDetails({
                totalProduct: data.totalProduct,
                totalCategory: data.totalCategory,
                countInvoice: data.countInvoice,
            });
            setTopSalesProducts(data.topSalesProducts);

            setCategorySales(data.categorySales);
        } catch (error) {
            console.error("Error Fetching Dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategory();
        fetchProduct();
        fetchPayment();
        fetchInvoice();
        fetchInfoDashBoard();
    }, []);

    const refreshData = async () => {
        setLoading(true);
        try {
            await fetchCategory();
            await fetchProduct();
            await fetchPayment();
            await fetchInvoice();
            await fetchInfoDashBoard();
        } catch (error) {
            console.error("Error refreshing data:", error);
        } finally {
            setLoading(false);
        }
    };

    const contextValue = useMemo(
        () => ({
            loading,
            setLoading,
            categories,
            setCategories,
            products,
            setProducts,
            upcomingPayments,
            setUpcomingPayments,
            invoices,
            setInvoices,
            infoStats,
            setInfoStats,
            detail,
            setDetails,
            topSalesProducts,
            setTopSalesProducts,
            categorySales,
            setCategorySales,
            refreshData,
        }),
        [
            loading,
            categories,
            products,
            upcomingPayments,
            invoices,
            infoStats,
            detail,
            topSalesProducts,
            categorySales,
            refreshData,
        ]
    );

    return (
        <PublicContext.Provider value={contextValue}>
            {children}
        </PublicContext.Provider>
    );
};

export default PublicContextProvider;
