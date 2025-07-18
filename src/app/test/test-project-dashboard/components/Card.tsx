import { CardProps } from '../types';

const Card = ({ title, children, className, seeMore = false, seeMoreText = "全て表示" }: CardProps) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className || ''}`}>
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-bold text-gray-800">{title}</h3>
      {seeMore && (
        <a href="#" className="text-sm text-indigo-600 hover:underline">
          {seeMoreText}
        </a>
      )}
    </div>
    <div>{children}</div>
  </div>
);

export default Card; 