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
  const baseClasses = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  let variantClasses = '';
  if (variant === 'primary') {
    variantClasses = "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl";
  } else if (variant === 'secondary') {
    variantClasses = "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500 shadow hover:shadow-md";
  }

  return (
    <Link 
      href={href} 
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {children}
      {label}
    </Link>
  );
} 