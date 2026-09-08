import React, { useState, useEffect } from 'react';
import { X, MapPin, AtSign, Loader2, AlertCircle } from 'lucide-react';

const ProfileModal = ({ 
  isOpen, 
  onClose, 
  isFirstTime = false, 
  initialData = { username: '', address: '' },
  onSubmit 
}) => {
  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Reset state when modal opens with new data
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // We await the parent's submit function.
      // If the parent throws an error (e.g., "Username already exists"), we catch it here.
      await onSubmit(formData);
      
      // Only close if the submission was successful AND it's not restricted
      if (!isFirstTime) {
        onClose();
      }
    } catch (err) {
      // Keep the modal open and display the error
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    // Only close on backdrop click if it's NOT their first time
    if (e.target === e.currentTarget && !isFirstTime && !isSubmitting) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-[#12141C] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0B0D14]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {isFirstTime ? 'Complete Your Profile' : 'Edit Profile'}
          </h2>
          {!isFirstTime && (
            <button 
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Informational Text for First Timers */}
          {isFirstTime && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Welcome to Executr! Please choose a unique username and provide your location to finalize your account setup.
            </p>
          )}

          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900/50">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Username Field */}
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Username <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AtSign size={16} className="text-gray-400" />
              </div>
              <input
                id="username"
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                disabled={isSubmitting}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#0B0D14] border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white transition-shadow disabled:opacity-60"
                placeholder="vishal_codes"
              />
            </div>
          </div>

          {/* Address/Location Field */}
          <div className="space-y-1.5">
            <label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Location / Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin size={16} className="text-gray-400" />
              </div>
              <input
                id="address"
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={isSubmitting}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#0B0D14] border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white transition-shadow disabled:opacity-60"
                placeholder="e.g., Bhopal, Madhya Pradesh"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !formData.username || !formData.address}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                isFirstTime ? 'Complete Setup' : 'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;