import StatusBadge from './StatusBadge';
import { Calendar, Building2, Tag } from 'lucide-react';

export default function ManufacturerCard({ manufacturer, onClick }) {
  const formattedDate = new Date(manufacturer.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {manufacturer.companyName}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Tag className="w-4 h-4" />
            <span>{manufacturer.brandName}</span>
          </div>
        </div>
        <StatusBadge status={manufacturer.approvalStatus} />
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          <span>{manufacturer.contactPerson}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Registered: {formattedDate}</span>
        </div>
      </div>

      <button className="mt-4 w-full py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
        View Details
      </button>
    </div>
  );
}
