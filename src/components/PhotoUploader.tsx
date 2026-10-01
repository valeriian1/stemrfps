import React, { useRef, useState } from 'react';
import { photoSchema } from '../schemas';

type UploadState = 'idle' | 'fileSelected' | 'validating' | 'invalid' | 'ready' | 'analyzing' | 'result' | 'error';

interface PhotoUploaderProps {
  onAnalyze: (file: File) => Promise<void>;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onAnalyze }) => {
  const [state, setState] = useState<UploadState>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setState('validating');
    
    try {
      photoSchema.parse({ file: selectedFile });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setFile(selectedFile);
        setState('ready');
      };
      reader.readAsDataURL(selectedFile);
      
    } catch (err: any) {
      if (err.errors && err.errors.length > 0) {
        setErrorMsg(err.errors[0].message);
      } else {
        setErrorMsg('Невалідний файл');
      }
      setState('invalid');
      setFile(null);
      setPreviewUrl(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setState('analyzing');
    try {
      await onAnalyze(file);
      setState('result');
    } catch (err: any) {
      setErrorMsg(err.message || 'Помилка аналізу');
      setState('error');
    }
  };

  const reset = () => {
    setState('idle');
    setFile(null);
    setPreviewUrl(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      {state === 'idle' || state === 'invalid' || state === 'error' ? (
        <div className="text-center border-2 border-dashed border-slate-300 rounded-lg p-8">
          <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="mt-4 flex justify-center text-sm text-slate-600">
            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
              <span>Завантажити фото</span>
              <input 
                id="file-upload" 
                name="file-upload" 
                type="file" 
                accept="image/*" 
                capture="environment" 
                className="sr-only" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </label>
            <p className="pl-1">або зробіть знімок</p>
          </div>
          <p className="text-xs text-slate-500 mt-2">PNG, JPG, WEBP до 5MB</p>
          {(state === 'invalid' || state === 'error') && (
            <p className="mt-4 text-sm text-red-600 font-medium">{errorMsg}</p>
          )}
        </div>
      ) : null}

      {(state === 'ready' || state === 'analyzing' || state === 'result') && previewUrl && (
        <div className="space-y-4">
          <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover rounded-md" />
          {state === 'ready' && (
            <div className="flex space-x-3">
              <button 
                onClick={reset}
                className="flex-1 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 font-medium text-sm"
              >
                Інше фото
              </button>
              <button 
                onClick={handleAnalyze}
                className="flex-1 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium text-sm"
              >
                Аналізувати
              </button>
            </div>
          )}
          {state === 'analyzing' && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              <span className="ml-3 text-slate-600 font-medium text-sm">Йде аналіз зображення...</span>
            </div>
          )}
          {state === 'result' && (
            <button 
              onClick={reset}
              className="w-full py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 font-medium text-sm"
            >
              Новий аналіз
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PhotoUploader;
