import React, { useState, useEffect } from 'react';

interface Testimonial {
  id: string;
  name: string;
  title: string;
  quote: string;
  avatarUrl?: string; // Optional avatar
}

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

const TestimonialSlider: React.FC<TestimonialSliderProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) {
    return <p>No testimonials available.</p>; // Or some other placeholder
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? testimonials.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === testimonials.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative w-full max-w-2xl mx-auto my-8 p-6 bg-gray-100 rounded-lg shadow-xl">
      <div className="text-center">
        {currentTestimonial.avatarUrl && (
          <img 
            src={currentTestimonial.avatarUrl} 
            alt={currentTestimonial.name} 
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
            onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if image fails to load
          />
        )}
        <p className="text-lg italic text-gray-700 mb-4 leading-relaxed">\"{currentTestimonial.quote}\"</p>
        <p className="font-semibold text-gray-900">{currentTestimonial.name}</p>
        <p className="text-sm text-gray-500">{currentTestimonial.title}</p>
      </div>

      {/* Navigation Arrows */} 
      <button 
        onClick={goToPrevious} 
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 text-gray-800 p-3 rounded-full shadow-md transition-opacity duration-300 focus:outline-none ml-[-20px]"
        aria-label="Previous testimonial"
      >
        &#x2190; {/* Left arrow */} 
      </button>
      <button 
        onClick={goToNext} 
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 text-gray-800 p-3 rounded-full shadow-md transition-opacity duration-300 focus:outline-none mr-[-20px]"
        aria-label="Next testimonial"
      >
        &#x2192; {/* Right arrow */} 
      </button>
    </div>
  );
};

export default TestimonialSlider; 