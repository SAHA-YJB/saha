import { SAHA_DONGS } from '@/constants/location';
import { UseFormRegisterReturn } from 'react-hook-form';

interface LocationSelectProps {
  className?: string;
  variant?: 'ghost' | 'bordered';
  size?: 'sm' | 'md';
  registration?: UseFormRegisterReturn;
  defaultValue?: string;
}

export const LocationSelect = ({
  className = '',
  variant = 'ghost',
  size = 'sm',
  registration,
  defaultValue = SAHA_DONGS[0],
}: LocationSelectProps) => {
  const baseClass = 'select text-white';
  const variantClass =
    variant === 'ghost' ? 'select-ghost' : 'select-bordered select-primary';
  const sizeClass = size === 'sm' ? 'select-sm' : 'w-full';

  return (
    <select
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
      defaultValue={defaultValue}
      {...registration}
    >
      {registration && (
        <option disabled value=''>
          거래 희망 장소
        </option>
      )}
      {SAHA_DONGS.map((dong) => (
        <option
          key={dong}
          value={dong}
          className={variant === 'ghost' ? 'bg-black' : ''}
        >
          {dong}
        </option>
      ))}
    </select>
  );
};
