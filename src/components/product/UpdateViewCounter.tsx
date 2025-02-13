'use client';

import { useEffect, useState } from 'react';

interface UpdateViewCounterProps {
  productId: string;
  initialViews: number;
}

const UpdateViewCounter = ({
  productId,
  initialViews,
}: UpdateViewCounterProps) => {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    fetch(`/api/products/${productId}/update-view`, {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.views === 'number') {
          setViews(data.views);
        }
      })
      .catch((error) => console.error('Error updating view count:', error));
  }, [productId]);

  return <>{views}</>;
};

export default UpdateViewCounter;
