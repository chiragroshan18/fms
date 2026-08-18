import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

export const RatingStars = ({
  rating = 0,
  onChange,
  readOnly = false,
  size = 'md',
  showLabel = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-9 h-9',
  };

  const currentDisplay = hoverRating || rating;

  const getLabel = (val) => {
    switch (val) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Select Rating';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 select-none">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = starIndex <= currentDisplay;

          return (
            <motion.button
              key={starIndex}
              type="button"
              disabled={readOnly}
              whileHover={readOnly ? {} : { scale: 1.25, rotate: 5 }}
              whileTap={readOnly ? {} : { scale: 0.9 }}
              onMouseEnter={() => !readOnly && setHoverRating(starIndex)}
              onMouseLeave={() => !readOnly && setHoverRating(0)}
              onClick={() => !readOnly && onChange && onChange(starIndex)}
              className={`focus:outline-none transition-colors duration-150 ${
                readOnly ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <Star
                className={`${starSizes[size]} transition-all duration-200 ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : 'text-slate-600 fill-slate-800/40 hover:text-slate-500'
                }`}
              />
            </motion.button>
          );
        })}
      </div>

      {showLabel && (
        <span className="text-xs font-semibold text-amber-300/90 tracking-wide h-4">
          {getLabel(currentDisplay)}
        </span>
      )}
    </div>
  );
};
