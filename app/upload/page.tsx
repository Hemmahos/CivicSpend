import React from 'react';
import UploadForm from '@/components/UploadForm';

export default function UploadPage() {
  return (
    <div className="p-4 md:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-[#E3E3E3]">Upload Evidence</h1>
        <p className="text-slate-500 dark:text-[#8E8E8E] mt-2">Submit photos or videos of public infrastructure. We automatically extract location data for validation.</p>
      </div>
      <UploadForm />
    </div>
  );
}
