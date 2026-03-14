import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Phone, Clock, ChevronRight } from 'lucide-react';
import { STORES } from '../data/mockStores';

const StoresPage: React.FC = () => {
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'short' }); // "Mon"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100 px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">All Stores</h1>
          <p className="text-sm text-gray-500 mt-1">
            {STORES.length} Indian grocery stores near you
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {STORES.map((store) => {
            const todayHours = store.hours.find((h) => h.day === todayName);
            const hoursLabel = todayHours
              ? todayHours.isClosed
                ? 'Closed today'
                : `Today: ${todayHours.open} – ${todayHours.close}`
              : 'Hours unavailable';

            const isOpenNow = (() => {
              if (!todayHours || todayHours.isClosed) return false;
              const now = new Date();
              const nowMin = now.getHours() * 60 + now.getMinutes();
              const [oh, om] = todayHours.open.split(':').map(Number);
              const [ch, cm] = todayHours.close.split(':').map(Number);
              return nowMin >= oh * 60 + om && nowMin < ch * 60 + cm;
            })();

            return (
              <Link
                key={store.id}
                to={`/store/${store.id}`}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {/* Banner */}
                <div
                  className="h-20 flex items-center px-5 gap-4"
                  style={{ backgroundColor: store.bannerColor }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-md flex-shrink-0"
                    style={{ backgroundColor: store.logoColor }}
                  >
                    {store.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-gray-900 text-lg group-hover:text-[#f57314] transition-colors truncate">
                      {store.name}
                    </h2>
                    <p className="text-sm text-gray-500 truncate">{store.tagline}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#f57314] transition-colors flex-shrink-0" />
                </div>

                {/* Body */}
                <div className="px-5 py-4 space-y-3">
                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-2">{store.description}</p>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                    <span>{store.address}, {store.city}, {store.state}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone className="w-4 h-4 flex-shrink-0 text-gray-400" />
                    <span>{store.phone}</span>
                  </div>

                  {/* Hours today */}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 flex-shrink-0 text-gray-400" />
                    <span className={isOpenNow ? 'text-green-600 font-medium' : 'text-gray-500'}>
                      {hoursLabel}
                    </span>
                    {isOpenNow && (
                      <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Open Now
                      </span>
                    )}
                    {!isOpenNow && todayHours && !todayHours.isClosed && (
                      <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        Closed
                      </span>
                    )}
                  </div>

                  {/* Rating & speciality */}
                  <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-gray-800">{store.rating.toFixed(1)}</span>
                      <span className="text-xs text-gray-400">({store.reviewCount} reviews)</span>
                    </div>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
                      style={{ backgroundColor: store.logoColor }}
                    >
                      {store.speciality}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StoresPage;
