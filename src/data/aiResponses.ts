export interface AIResponse {
  keywords: string[];
  response: string;
}

export const AI_RESPONSES: AIResponse[] = [
  {
    keywords: ['basmati', 'basmati rice'],
    response: 'Basmati rice is a premium long-grain aromatic rice from the Himalayan foothills. It\'s ideal for biryani, pulao, and special occasions. We carry India Gate and Daawat brands — both excellent choices. India Gate is aged longer for a firmer grain, while Daawat is great for everyday use. Use our Compare Prices feature to find the best deal across stores! 🍚',
  },
  {
    keywords: ['toor dal', 'toor', 'arhar', 'pigeon peas'],
    response: 'Toor dal (pigeon peas / arhar dal) is the most widely used dal in India. It\'s the base of sambar, dal fry, and dal tadka. Rich in protein and fiber. Available in all our stores — Tata Sampann brand offers pre-cleaned varieties. Cook with a pinch of turmeric and hing for best flavor! 🫘',
  },
  {
    keywords: ['ghee', 'clarified butter', 'desi ghee'],
    response: 'Ghee (clarified butter) is a staple in Indian cooking. We carry Amul Pure Ghee (made from pasteurized cream) and Patanjali Cow Ghee (bilona method). Ghee has a high smoke point making it ideal for frying. For authenticity, choose cow ghee. Store at room temperature or refrigerate. Great on hot rotis! 🫙',
  },
  {
    keywords: ['atta', 'wheat flour', 'roti', 'chapati', 'paratha'],
    response: 'For the softest rotis and parathas, look for chakki atta (stone-ground whole wheat flour). Aashirvaad is our best-selling brand — it has a high fiber content. For 10kg, Spice Garden and Punjab Palace both stock it. Tip: Rest the dough for 20-30 minutes before rolling for extra soft rotis! 🌾',
  },
  {
    keywords: ['sambar', 'sambar powder', 'south indian'],
    response: 'For authentic sambar, you need toor dal, tamarind, and good sambar powder. We recommend MTR Sambar Powder — it\'s a classic South Indian brand. Kerala Kitchen (Sunnyvale) specializes in South Indian groceries and carries a great selection including fresh curry leaves and coconut oil for tempering. 🌶️',
  },
  {
    keywords: ['biryani', 'biryani masala'],
    response: 'For the perfect biryani you need: aged basmati rice, biryani masala (Everest brand is great), whole spices (cardamom, cloves, bay leaves), and saffron for color. All these are available across our stores. Punjab Palace and Spice Garden carry the full biryani kit. Compare prices to save! Our AI tip: soak rice for 30 min before cooking for fluffier grains. 🍛',
  },
  {
    keywords: ['paneer', 'cottage cheese'],
    response: 'Paneer is fresh Indian cottage cheese — mild, soft, and versatile. Amul Paneer (400g) is available at most stores. Use it for palak paneer, paneer tikka, or shahi paneer. For best results, pat dry and shallow fry before adding to curries. It stays fresh for 3-4 days refrigerated. 🧀',
  },
  {
    keywords: ['pickup', 'pickup time', 'collect', 'when can i pick'],
    response: 'You can schedule a pickup for today or up to 3 days in advance! After placing your order, choose a 30-minute slot that suits you. Most stores confirm orders within 15-30 minutes. You\'ll see live status updates — Pending → Confirmed → Preparing → Ready for Pickup. Head to the Orders section to track your order. 📦',
  },
  {
    keywords: ['compare', 'price compare', 'cheapest', 'best price', 'lowest price'],
    response: 'Great thinking! Use our Compare Prices feature to see pricing across all 4 stores at once. Click the ⚖️ icon on any product card to add it to your comparison. Then visit the Compare page to see a side-by-side price table. Prices can vary 10-20% between stores — you could save a lot on bulk items! 💰',
  },
  {
    keywords: ['organic', 'organic products'],
    response: 'We carry certified organic options from brands like Organic India, Natureland, and others. Look for the "Organic" tag in product listings. Categories with the most organic options: Dal & Pulses, Rice & Grains, Flour, and Spices. Use the search bar and type "organic" to filter organic products. 🌿',
  },
  {
    keywords: ['gluten', 'gluten free', 'celiac'],
    response: 'Many Indian groceries are naturally gluten-free! Gluten-free options include: all rice varieties, most dals and pulses, besan (chickpea flour), rice flour, ragi flour, turmeric, cumin, and most whole spices. Avoid maida (all-purpose flour) and some papad brands. Use the Gluten-Free filter when browsing products. 🌾',
  },
  {
    keywords: ['vegan', 'plant based'],
    response: 'Most Indian grocery staples are vegan-friendly! Vegan items include: all rice, dals, spices, flours, oils, most pickles, and snacks. Non-vegan items to watch for: ghee (clarified butter), paneer, curd, and khoya. Use the Vegan filter when browsing to see only plant-based products. 🌱',
  },
  {
    keywords: ['fresh', 'fresh produce', 'vegetables'],
    response: 'Fresh produce varies by store and season. Kerala Kitchen (Sunnyvale) specializes in fresh South Indian ingredients including curry leaves, ginger, and fresh turmeric. Spice Garden (Fremont) also has a fresh section. I recommend calling ahead to confirm fresh item availability — phone numbers are on each store page. 🥬',
  },
  {
    keywords: ['puja', 'pooja', 'prayer', 'incense', 'agarbatti', 'diya'],
    response: 'For puja needs, we carry agarbatti (incense sticks) in sandalwood and jasmine from Cycle brand, pure camphor (kapoor) from Mangalam, kumkum/sindoor powder, and more. Kerala Kitchen and Spice Garden have the best puja item selection. Stock up before festivals! 🪔',
  },
  {
    keywords: ['rooh afza', 'sharbat', 'drink', 'beverage'],
    response: 'Rooh Afza by Hamdard is a beloved rose-flavored syrup that\'s been refreshing Indians for over 100 years! Mix 2 tablespoons in cold water or milk for a refreshing sharbat. Available at Spice Garden and Desi Bazaar. We also carry Taj Mahal tea, Bournvita, and chai masala. 🌹',
  },
  {
    keywords: ['haldiram', 'snacks', 'namkeen', 'bhujia'],
    response: 'Haldiram\'s is India\'s most beloved snack brand! We carry Bhujia Sev and Aloo Bhujia (400g packs). Also available: Bikaji Masala Peanuts, Lijjat Papad, Murukku (for South Indian snack lovers), and Khakra (Gujarati flatbread snacks). Perfect for tea time! Stock up at Desi Bazaar for best prices. 🍿',
  },
  {
    keywords: ['order', 'how to order', 'place order'],
    response: 'Ordering is easy! 1) Browse products and click "Add to Cart" 2) Visit your cart to review items 3) Tap Checkout and choose your pickup time slot 4) Confirm your order. You\'ll receive a status update as your order is prepared. You can track it live in the Orders section. Orders are usually ready within 30-60 minutes! 🛒',
  },
  {
    keywords: ['store', 'stores', 'locations', 'which store'],
    response: 'ApnaKirana connects you with 4 Indian grocery stores in the Bay Area: 🏪 Spice Garden (Fremont) — widest selection, 🏪 Desi Bazaar (San Jose) — best prices, 🏪 Kerala Kitchen (Sunnyvale) — South Indian specialist, 🏪 Punjab Palace (Santa Clara) — North Indian specialist. Visit the home page to browse all stores! 🗺️',
  },
  {
    keywords: ['mustard seeds', 'rai', 'tempering', 'tadka'],
    response: 'Mustard seeds (rai/sarson) are essential for tempering! Heat oil, add mustard seeds, and wait for them to pop before adding other ingredients. Black mustard seeds are used in South Indian cooking (Kerala Kitchen has the best stock). Yellow mustard is used in North Indian pickles. Also great for mustard oil — Punjab Palace carries Patanjali Mustard Oil! 🌿',
  },
  {
    keywords: ['chai', 'tea', 'masala chai'],
    response: 'The perfect masala chai recipe: boil water with ginger, add Taj Mahal CTC tea leaves, simmer with milk, sweeten with sugar, and add a pinch of Everest Chai Masala at the end. Both Spice Garden and Punjab Palace carry everything you need. Our Everest Chai Masala blend has cardamom, ginger, cloves, and pepper for authentic flavor! ☕',
  },
];

export const FALLBACK_RESPONSES = [
  'I can help you find the perfect Indian groceries! Try asking me about specific items like "basmati rice", "toor dal", "ghee", or "sambar powder". You can also ask about pickup times, price comparison, or which stores carry specific items. 🛒',
  'Welcome to ApnaKirana! I know all about Indian groceries. Ask me about any ingredient, brand, or cooking tip. You can also use filters on the product pages to narrow down your search. What are you looking for today? 🌿',
  'Interesting question! I specialize in Indian grocery knowledge. Try asking about specific products, cooking uses, brands we carry, store locations, or how to place orders. I\'m here to help! 😊',
];
