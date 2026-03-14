import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ChevronRight, Scale } from 'lucide-react';
import { STORES } from '../data/mockStores';

const FEATURE_CARDS = [
  {
    icon: '🔍',
    title: 'Smart Search',
    description: 'Find any Indian grocery item instantly across all stores with intelligent search.',
    color: 'bg-orange-50 border-orange-100',
    iconBg: 'bg-orange-100',
  },
  {
    icon: '⚖️',
    title: 'Price Comparison',
    description: 'Compare prices side-by-side across stores and always get the best deal.',
    color: 'bg-green-50 border-green-100',
    iconBg: 'bg-green-100',
  },
  {
    icon: '📦',
    title: 'Easy Pickup',
    description: 'Schedule your pickup slot, place the order, and collect at your convenience.',
    color: 'bg-blue-50 border-blue-100',
    iconBg: 'bg-blue-100',
  },
];

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-orange-200 text-orange-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#f57314] animate-pulse" />
            Now serving Bay Area stores
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            India's Freshest<br />
            <span className="text-[#f57314]">Grocery Connection</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            ApnaKirana bridges you with the best Indian grocery stores nearby — compare prices, discover
            authentic products, and schedule convenient pickups.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/stores"
              className="inline-flex items-center justify-center gap-2 bg-[#f57314] hover:bg-orange-600 text-white font-semibold px-7 py-3 rounded-xl transition active:scale-95 shadow-md"
            >
              Browse Stores
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to="/compare"
              className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-semibold px-7 py-3 rounded-xl hover:border-[#f57314] hover:text-[#f57314] transition"
            >
              <Scale className="w-4 h-4" />
              Compare Prices
            </Link>
          </div>
        </div>
      </section>

      {/* Stores */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Stores</h2>
            <p className="text-sm text-gray-500 mt-1">Discover top-rated Indian grocery stores near you</p>
          </div>
          <Link
            to="/stores"
            className="text-sm font-semibold text-[#f57314] hover:underline flex items-center gap-1"
          >
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STORES.map((store) => (
            <Link
              key={store.id}
              to={`/store/${store.id}`}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Banner */}
              <div
                className="h-16 flex items-center justify-center"
                style={{ backgroundColor: store.bannerColor }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow"
                  style={{ backgroundColor: store.logoColor }}
                >
                  {store.name.slice(0, 2).toUpperCase()}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 group-hover:text-[#f57314] transition-colors">
                  {store.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{store.tagline}</p>

                <div className="flex items-center gap-1 mt-2">
                  <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-400">{store.city}, {store.state}</span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold text-gray-800">{store.rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-400">({store.reviewCount})</span>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: store.logoColor }}
                  >
                    {store.speciality.split(' ').slice(0, 2).join(' ')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature highlights */}
      <section className="bg-white border-t border-gray-100 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Why ApnaKirana?</h2>
            <p className="text-sm text-gray-500 mt-2">Everything you need for a seamless grocery experience</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURE_CARDS.map((f) => (
              <div key={f.title} className={`rounded-2xl border p-6 ${f.color}`}>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl text-2xl mb-4 ${f.iconBg}`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-10 px-4 text-center">
        <p className="text-gray-400 text-sm">
          Fresh Indian groceries, just a click away •{' '}
          <Link to="/stores" className="text-[#f57314] font-semibold hover:underline">
            Start Shopping
          </Link>
        </p>
      </section>
    </div>
  );
};

export default HomePage;
