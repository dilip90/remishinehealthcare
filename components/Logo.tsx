import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeMap = {
    sm: 'h-9 w-auto',
    md: 'h-12 w-auto sm:h-14',
    lg: 'h-16 w-auto sm:h-20',
  };

  return (
    <Image
      src="/logo.png"
      alt="Remishine Healthcare"
      className={`${sizeMap[size]} ${className}`}
      width={1460}
      height={395}
      priority
    />
  );
}
