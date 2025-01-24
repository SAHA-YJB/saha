'use client';

import { useState } from 'react';
import { CreateProductModal } from './CreateProductModal';
import { Plus } from 'lucide-react';

export const CreateProductButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className='hover:bg-primary-focus fixed bottom-20 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg'
      >
        <Plus className='h-6 w-6' />
      </button>

      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
