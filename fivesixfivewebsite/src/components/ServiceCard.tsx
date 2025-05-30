import React from 'react';
import Link from 'next/link';

interface ServiceCardProps {
  title: string;
  excerpt: string;
  slug: string; // To link to the full service page, e.g., /services/personal-dev
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, excerpt, slug }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed h-20 overflow-hidden">
          {excerpt}
        </p>
        <Link href={`/services/${slug}`} className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors duration-300">
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard; 