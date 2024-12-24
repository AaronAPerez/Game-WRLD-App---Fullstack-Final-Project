import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2, User, EyeOff, Eye, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

interface LoginFormData {
  userName: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  userName?: string;
  password?: string;
  general?: string;
}

const LoginPage = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<LoginFormData>({
    userName: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // useEffect to autofill the username if it was saved in localStorage
  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      setFormData((prev) => ({
        ...prev,
        userName: rememberedUser,
      }));
    }
  }, []); // This effect runs once when the component is mounted

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.userName) {
      newErrors.userName = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await login(formData.userName, formData.password);
      toast.success('Login successful!');
      
      if (formData.rememberMe) {
        localStorage.setItem('rememberedUser', formData.userName);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid username or password';
      setErrors({
        general: errorMessage
      });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-stone-900 rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">
              Log in to continue your gaming journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-500/10 text-red-500 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.general}</span>
              </div>
            )}

            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-400 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 bg-stone-800 text-white rounded-lg",
                    "focus:ring-2 focus:ring-blue-500 transition-all",
                    errors.userName && "ring-2 ring-red-500"
                  )}
                  placeholder="Enter your username"
                />
              </div>
              {errors.userName && (
                <p className="mt-1 text-sm text-red-500">{errors.userName}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={cn(
                    "w-full pl-10 pr-12 py-2.5 bg-stone-800 text-white rounded-lg",
                    "focus:ring-2 focus:ring-blue-500 transition-all",
                    errors.password && "ring-2 ring-red-500"
                  )}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-600 bg-stone-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-stone-900"
                />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full relative px-4 py-2 font-medium text-white rounded-full",
                "transition-all duration-300",
                "bg-blue-900 hover:bg-indigo-500",
                "before:absolute before:inset-0 before:rounded-full before:opacity-0",
                "before:bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.3)_0%,transparent_70%)]",
                "hover:before:opacity-100",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "shadow-lg shadow-indigo-500/20"
              )}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-blue-500 hover:text-blue-400 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
