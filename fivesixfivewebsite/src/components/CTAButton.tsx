import Link from 'next/link';
import React from 'react';

interface CTAButtonProps {
  href: string;
  label: string;
  variant?: 'primary' | 'secondary';
  children?: React.ReactNode; // For icons or other content inside the button
  className?: string; // Allow overriding or adding classes
}

export default function CTAButton({
  href,
  label,
  variant = 'primary',
  children,
  className = ''
}: CTAButtonProps) {
  const baseClasses = "rounded-full border border-solid transition-colors flex items-center justify-center gap-2 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto";
  
  let variantClasses = '';
  if (variant === 'primary') {
    variantClasses = "bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] border-transparent";
  } else if (variant === 'secondary') {
    variantClasses = "border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent";
  }

  return (
    <Link href={href} className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
      {label}
    </Link>
  );
} 