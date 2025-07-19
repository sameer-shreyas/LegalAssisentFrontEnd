import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Scale, FileText, Brain, Sparkles, Shield, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      toast.success(isLogin ? 'Login successful!' : 'Registration successful!');
      navigate('/');
    } catch (error) {
      toast.error(isLogin ? 'Login failed' : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div 
              className="bg-gradient-to-br from-primary-600 to-primary-700 p-4 rounded-2xl shadow-glow"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Scale className="h-10 w-10 text-white" />
            </motion.div>
          </div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-3"
          >
            LegalAssist AI
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-neutral-600 mb-2"
          >
            AI-Powered Legal Intelligence Platform
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-neutral-500"
          >
            Trusted by legal professionals worldwide
          </motion.p>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 mb-6">
            <div className="flex items-center mb-4">
              <Sparkles className="h-5 w-5 text-accent-600 mr-2" />
              <h3 className="text-lg font-semibold text-neutral-900">Premium Features</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <motion.div 
                className="flex items-center p-3 bg-primary-50 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <FileText className="h-5 w-5 text-primary-600 mr-3" />
                <span className="text-sm font-medium text-primary-800">Smart Document Analysis</span>
              </motion.div>
              <motion.div 
                className="flex items-center p-3 bg-accent-50 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <Brain className="h-5 w-5 text-accent-600 mr-3" />
                <span className="text-sm font-medium text-accent-800">AI-Powered Clause Extraction</span>
              </motion.div>
              <motion.div 
                className="flex items-center p-3 bg-green-50 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <Shield className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm font-medium text-green-800">Risk Assessment & Suggestions</span>
              </motion.div>
              <motion.div 
                className="flex items-center p-3 bg-purple-50 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <Zap className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-sm font-medium text-purple-800">Plain English Explanations</span>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-8">
            <div className="flex mb-6 bg-neutral-100 rounded-lg p-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 text-center rounded-md font-medium transition-all duration-200 ${
                  isLogin
                    ? 'bg-white text-primary-700 shadow-soft'
                    : 'text-neutral-600 hover:text-neutral-800'
                }`}
              >
                Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 text-center rounded-md font-medium transition-all duration-200 ${
                  !isLogin
                    ? 'bg-white text-primary-700 shadow-soft'
                    : 'text-neutral-600 hover:text-neutral-800'
                }`}
              >
                Sign Up
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                    required
                  />
                </motion.div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full py-3 text-base font-medium"
                size="lg"
              >
                {isLogin ? 'Sign In to LegalAssist AI' : 'Create Your Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;