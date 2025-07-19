import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Scale, User, FileText, Brain } from 'lucide-react';
import ThemeToggle from './ui/ThemeToggle';
import Button from './ui/Button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 shadow-soft"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.02 }}
              >
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-2 rounded-xl mr-4">
                  <Scale className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    LegalAssist AI
                  </h1>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    AI-Powered Legal Intelligence
                  </p>
                </div>
              </motion.div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-6">
                <div className="flex items-center space-x-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
                  <FileText className="h-4 w-4 text-primary-600" />
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Documents</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-accent-50 to-accent-100 rounded-lg">
                  <Brain className="h-4 w-4 text-accent-600" />
                  <span className="text-sm font-medium text-accent-700">AI Analysis</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 px-4 py-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
                  <User className="h-5 w-5 text-primary-600" />
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{user?.name}</span>
                </div>
                
                <ThemeToggle />
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-neutral-600 dark:text-neutral-400 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;