import { QuickLinkCardProps } from '../types';

const QuickLinkCard = ({ icon, title, subtitle }: QuickLinkCardProps) => (
  <div className="bg-white rounded-lg shadow-md p-5 flex items-center">
    <div className="p-3 bg-indigo-100 rounded-lg mr-4">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-gray-800">{title}</h4>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  </div>
);

export default QuickLinkCard; 