import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Upload, Clock, Trash2, Eye, Plus, Sparkles, TrendingUp, Users, Shield } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import { sampleContract } from '../utils/sampleContract';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface Document {
  id: string;
  title: string;
  originalName: string;
  size: number;
  uploadedAt: string;
  mimetype: string;
}

const Dashboard: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('/api/files');
      setDocuments(response.data);
    } catch (error) {
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const createSampleDocument = async () => {
    setUploading(true);
    try {
      // Create a sample contract file
      const blob = new Blob([sampleContract], { type: 'text/plain' });
      const file = new File([blob], 'Sample_Professional_Services_Agreement.txt', { type: 'text/plain' });
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', 'Sample Professional Services Agreement');

      await axios.post('/api/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Sample contract created successfully!');
      fetchDocuments();
    } catch (error) {
      toast.error('Failed to create sample contract');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    setUploading(true);
    
    for (const file of acceptedFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name);

        await axios.post('/api/files', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    
    setUploading(false);
    fetchDocuments();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: true
  });

  const handleDeleteDocument = async (id: string) => {
    try {
      await axios.delete(`/api/files/${id}`);
      toast.success('Document deleted successfully');
      fetchDocuments();
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimetype: string) => {
    switch (mimetype) {
      case 'application/pdf':
        return '📄';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return '📝';
      case 'text/plain':
        return '📃';
      default:
        return '📄';
    }
  };

  if (loading) {
    return (
      <LoadingSpinner size="lg" text="Loading your documents..." />
    );
  }

  return (
    <div className="px-6 py-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="text-center mb-8">
          <motion.h1 
            className="text-4xl font-bold text-neutral-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Welcome back, <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">{user?.name}</span>! 👋
          </motion.h1>
          <motion.p 
            className="text-xl text-neutral-600 dark:text-neutral-400 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Transform your legal documents with AI-powered intelligence
          </motion.p>
          
          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-white">{documents.length}</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Documents</div>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="bg-accent-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-accent-600" />
              </div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-white">AI</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Powered</div>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-white">100%</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Secure</div>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-white">Fast</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Analysis</div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Your Documents</h2>
          <p className="text-neutral-600 dark:text-neutral-400">Manage and analyze your legal documents</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowUploadModal(true)}
            className="shadow-glow"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
          <Button
            onClick={createSampleDocument}
            disabled={uploading}
            variant="outline"
          >
            <FileText className="h-4 w-4 mr-2" />
            Try Sample
          </Button>
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Legal Document"
        size="lg"
      >
        <motion.div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-primary-500 bg-primary-50 scale-105'
              : 'border-neutral-300 hover:border-primary-400 hover:bg-neutral-50'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input {...getInputProps()} />
          <motion.div
            animate={uploading ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 2, repeat: uploading ? Infinity : 0, ease: "linear" }}
          >
            <Upload className="h-16 w-16 text-primary-400 mx-auto mb-6" />
          </motion.div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-3">
            {uploading ? 'Processing your document...' : 'Drop your legal documents here'}
          </h3>
          <p className="text-neutral-600 mb-6">
            Supports PDF, DOCX, and TXT files up to 10MB
          </p>
          {!uploading && (
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Choose Files
            </Button>
          )}
        </motion.div>
      </Modal>

      {/* Documents Grid */}
      <AnimatePresence>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="p-6 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center flex-1">
                    <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-3 rounded-lg mr-4">
                      <span className="text-2xl">{getFileIcon(doc.mimetype)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-neutral-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">{formatFileSize(doc.size)}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigate(`/document/${doc.id}`)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="View document"
                    >
                      <Eye className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
            
                <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                  <Clock className="h-4 w-4 mr-2" />
                  {new Date(doc.uploadedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
            
                <Button
                  onClick={() => navigate(`/document/${doc.id}`)}
                  className="w-full group-hover:shadow-glow transition-all duration-200"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze with AI
                </Button>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {documents.length === 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="bg-gradient-to-br from-primary-100 to-accent-100 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="h-12 w-12 text-primary-600" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">Ready to get started?</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
            Upload your first legal document and experience the power of AI-driven legal analysis
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => setShowUploadModal(true)} size="lg">
              <Upload className="h-5 w-5 mr-2" />
              Upload Document
            </Button>
            <Button onClick={createSampleDocument} variant="outline" size="lg">
              <FileText className="h-5 w-5 mr-2" />
              Try Sample Contract
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;