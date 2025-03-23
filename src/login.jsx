import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./context/AuthContext";
 

export default function Login() {
    const { setToken, setIsLoggedIn, handleLogout } = useContext(AuthContext);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        onSubmit: (values) => LoginUser(values),
    });

    async function LoginUser(values) {
        const loginPayload = {
            username: values.username,
            password: values.password,
        };

        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/user/login",
                loginPayload,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                const { accessToken } = response.data;
                localStorage.setItem("token", accessToken);
                setToken(accessToken);
                setIsLoggedIn(true);

                const decoded = jwtDecode(accessToken);

                Swal.fire({
                    title: "تم تسجيل الدخول بنجاح!",
                    icon: "success",
                    text: "مرحبًا بك في لوحة التحكم.",
                    showConfirmButton: false,
                    timer: 2000,
                }).then(() => {
                    navigate("/");
                });
            }
        } catch (error) {
            const errorMessage = "فشل تسجيل الدخول. تحقق من اسم المستخدم وكلمة المرور";
            Swal.fire({
                title: "فشل تسجيل الدخول",
                icon: "error",
                text: errorMessage,
                confirmButtonText: "حاول مرة أخرى",
            });
        } finally {
            setIsLoggedIn(false);
        }
    }




    return (
        <div dir="rtl" className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt="Your Company"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                    className="mx-auto h-12 w-auto mb-6"
                />
                <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">تسجيل الدخول إلى لوحة التحكم</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm bg-white p-8 shadow-lg rounded-lg">
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* اسم المستخدم */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-900 text-right">اسم المستخدم</label>
                        <div className="mt-2">
                            <input
                                id="username"
                                name="username"
                                placeholder="اسم المستخدم"
                                type="text"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                required
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-2 px-3 text-right text-gray-900 sm:text-sm"
                            />
                        </div>
                    </div>

                    {/* كلمة المرور */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-900 text-right">كلمة المرور</label>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                placeholder="كلمة المرور"
                                type="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                required
                                autoComplete="current-password"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-2 px-3 text-right text-gray-900 sm:text-sm"
                            />
                        </div>
                    </div>

                    {/* زر تسجيل الدخول */}
                    <div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
                        >
                            تسجيل الدخول
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

}
