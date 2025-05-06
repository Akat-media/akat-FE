import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { toast } from "react-toastify";
import { useAuthStore } from '../store/authStore.ts';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.tsx';


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // const signIn = useAuthStore((state) => state.signIn);
  const location = useLocation();
  const toastShownRef = useRef(false) // Flag để tránh gọi 2 lần
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  }
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
  const {login} = useAuth();

  useEffect(() => {
    if (location.state?.showSuccess && !toastShownRef.current) {
      toastShownRef.current = true; // Đánh dấu đã gọi toast
      toast.success('Đăng ký thành công!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });

      // Reset state để không lặp lại toast khi refresh or back
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      email: email,
      password: password,
    }

    try {
      // await signIn(email, password);

      axios.post(`${VITE_BASE_URL}/login`, payload)
        .then(response => {
          // console.log("response:" + JSON.stringify(response.data.data.access_token));
          login(response.data.data.user.email,response.data.data.access_token);
          navigate('/', {
            state: { showSuccess: true },
          });
        })
        .catch(error => {
          if(error.response && error.response.data) {
            toast.error(error.response.data.message);
          }
        })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <img
              src="/aka platform.png"
              alt="AKA Platform Logo"
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AKA Platform
            </h1>
            <p className="text-gray-600 mt-2">Đăng nhập để tiếp tục</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={!showPassword ? 'password' : 'text'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Quên mật khẩu?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            >
              Đăng nhập
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Đăng ký
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
