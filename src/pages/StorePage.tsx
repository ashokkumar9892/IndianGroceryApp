import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, MapPin, Phone, Clock, Scale, ArrowLeft } from 'lucide-react';
import { STORES } from '../data/mockStores';
import { PRODUCTS } from '../data/mockProducts';
import { useInventoryStore } from '../store/inventoryStore';
import ProductSearch from '../components/products/ProductSearch';
import CategoryFilter from '../components/products/CategoryFilter';
import ProductGrid from '../components/products/ProductGrid';

const StorePage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();

  const store = STORES.find((s) => s.id === storeId);
  const getStoreProducts = useInventoryStore((s) => s.getStoreProducts);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [compareList, setCompareList] = useState<string[]>([]);

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <p className="text-2xl mb-2">🏪</p>
        <h2 className="text-xl font-bold text-gray-700">Store not found</h2>
        <Link to="/stores" className="mt-4 text-[#f57314] hover:underline font-semibold">Back to Stores</Link>
      </div>
    );
  }

  const storeProducts = getStoreProducts(store.id);

  // Filter products
  const filteredProducts = useMemo(() => {
    const storeProductIds = new Set(storeProducts.map((sp) => sp.productId));
    return PRODUCTS.filter((p) => {
      if (!storeProductIds.has(p.id)) return false;
      if (category && p.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.nameHindi?.toLowerCase().includes(q) ?? false) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [storeProducts, search, category]);

  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  const todayHours = store.hours.find((h) => h.day === todayName);

  const handleCompare = (productId: string) => {
    setCompareList((prev) => {
      if (prev.includes(productId)) return prev.filter((id) => id !== productId);
      if (prev.length >= 4) return prev; // max 4
      return [...prev, productId];
    });
  };

  const handleOpenCompare = () => {
    navigate('/compare', { state: { productIds: compareList } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div
          className="h-32 flex items-end px-4 pb-0"
          style={{ backgroundColor: store.bannerColor }}
        >
          <div className="max-w-5xl mx-auto w-full flex items-end gap-4 pb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-md flex-shrink-0"
              style={{ backgroundColor: store.logoColor }}
            >
              {store.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-extrabold text-gray-900">{store.name}</h1>
              <p className="text-sm text-gray-500">{store.tagline}</p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-4">
          {/* Back link */}
          <Link to="/stores" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#f57314] mb-3 transition">
            <ArrowLeft className="w-4 h-4" />
            All Stores
          </Link>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-400" />
              {store.address}, {store.city}, {store.state}
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-gray-400" />
              {store.phone}
            </div>
            {todayHours && !todayHours.isClosed && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-400" />
                Today: {todayHours.open} – {todayHours.close}
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-gray-800">{store.rating.toFixed(1)}</span>
              <span className="text-gray-400">({store.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Search + Filter */}
        <div className="flex flex-col gap-3 mb-6">
          <ProductSearch value={search} onChange={setSearch} />
          <CategoryFilter value={category} onChange={setCategory} />
        </div>

        {/* Product count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
          {compareList.length > 0 && (
            <p className="text-xs text-gray-400">{compareList.length}/4 selected for compare</p>
          )}
        </div>

        {/* Grid */}
        <ProductGrid
          products={filteredProducts}
          storeProducts={storeProducts}
          storeId={store.id}
          storeName={store.name}
          compareList={compareList}
          onCompare={handleCompare}
        />
      </div>

      {/* Floating compare bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={handleOpenCompare}
            className="flex items-center gap-3 bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl hover:bg-gray-800 active:scale-95 transition-all"
          >
            <Scale className="w-5 h-5 text-[#f57314]" />
            <span className="font-semibold">
              Compare ({compareList.length})
            </span>
            <span className="text-xs text-gray-400">up to 4</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default StorePage;
