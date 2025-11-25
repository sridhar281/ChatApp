import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Mail, Lock, Eye, EyeOff, MessageSquare, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimationDisplay from '../components/AnimationDisplay';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { login, isLoggingIn } = useAuthStore();

  const validateForm = () => {
    return formData.email && formData.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await login(formData.email, formData.password);
    } else {
      console.error('Form validation failed');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Login Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo & Heading */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Log in to your account</p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="flex items-center border rounded input input-bordered px-3 gap-2 w-full">
                <Mail className="size-5 text-gray-500" />
                <input
                  type="text"
                  className="w-full outline-none bg-transparent pl-5"
                  placeholder="virat@gmail.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="flex items-center border rounded input input-bordered px-3 gap-2 w-full relative">
                <Lock className="size-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full outline-none bg-transparent pl-5"
                  placeholder="********"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5 animate-spin" /> Logging in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Link to Sign Up */}
          <div className="text-center">
            <p className="text-base-content/60">
              Don't have an account?{' '}
              <Link to="/signup" className="link link-primary">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right: Animation */}
      <div className="flex w-full h-screen items-center justify-center p-12">
        <AnimationDisplay />
      </div>
    </div>
  );
};

export default LoginPage;