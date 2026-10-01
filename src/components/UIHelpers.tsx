import React from 'react';

export const Loader: React.FC = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
    <span className="ml-3 text-slate-600 font-medium">Завантаження...</span>
  </div>
);

export const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4 flex flex-col items-center text-center">
    <p className="text-red-700 mb-3">{message}</p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm font-medium transition-colors"
      >
        Спробувати ще раз
      </button>
    )}
  </div>
);

export const EmptyState: React.FC<{ message: string; actionText?: string; onAction?: () => void }> = ({ message, actionText, onAction }) => (
  <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-12 text-center">
    <p className="text-slate-500 mb-4">{message}</p>
    {actionText && onAction && (
      <button 
        onClick={onAction}
        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 text-sm font-medium transition-colors"
      >
        {actionText}
      </button>
    )}
  </div>
);
