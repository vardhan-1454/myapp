import React, { useState } from 'react';
import { 
  Car, Search, MapPin, Tag, Heart, GitCompare, ChevronDown, 
  CheckCircle, PlusCircle, User, Fuel, Gauge, SlidersHorizontal,
  X, Phone, MessageSquare, ShieldCheck, Star, Calendar, Sparkles, AlertCircle
} from 'lucide-react';

const INITIAL_VEHICLES = [
  {
    id: 1,
    title: '2022 Hyundai Creta SX (O) 1.5 Petrol',
    brand: 'Hyundai',
    category: 'SUVs',
    price: 1350000,
    priceFormatted: '₹13.50 Lakh',
    emi: '₹22,400/mo',
    year: 2022,
    km: '22,000 km',
    fuel: 'Petrol',
    transmission: 'Automatic',
    location: 'Mumbai',
    owner: '1st Owner',
    rating: 4.9,
    verified: true,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    seller: { name: 'Rahul Sharma', phone: '+91 98765 43210', verified: true }
  },
  {
    id: 2,
    title: '2021 Mahindra Thar LX 4x4 Hard Top',
    brand: 'Mahindra',
    category: 'SUVs',
    price: 1480000,
    priceFormatted: '₹14.80 Lakh',
    emi: '₹24,200/mo',
    year: 2021,
    km: '18,500 km',
    fuel: 'Diesel',
    transmission: 'Manual',
    location: 'Delhi',
    owner: '1st Owner',
    rating: 4.8,
    verified: true,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    seller: { name: 'Vikram Singh', phone: '+91 98123 45678', verified: true }
  },
  {
    id: 3,
    title: '2023 Tata Nexon EV Max XZ+ Lux',
    brand: 'Tata',
    category: 'Electric',
    price: 1520000,
    priceFormatted: '₹15.20 Lakh',
    emi: '₹25,000/mo',
    year: 2023,
    km: '11,000 km',
    fuel: 'Electric',
    transmission: 'Automatic',
    location: 'Bengaluru',
    owner: '1st Owner',
    rating: 5.0,
    verified: true,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    seller: { name: 'Priya Nair', phone: '+91 97444 12345', verified: true }
  },
  {
    id: 4,
    title: '2020 BMW 3 Series 320d Luxury Line',
    brand: 'BMW',
    category: 'Luxury',
    price: 3650000,
    priceFormatted: '₹36.50 Lakh',
    emi: '₹58,900/mo',
    year: 2020,
    km: '34,000 km',
    fuel: 'Diesel',
    transmission: 'Automatic',
    location: 'Mumbai',
    owner: '2nd Owner',
    rating: 4.9,
    verified: true,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    seller: { name: 'Apex Luxury Cars', phone: '+91 99999 88888', verified: true }
  },
  {
    id: 5,
    title: '2022 Toyota Fortuner Legender 4x4 AT',
    brand: 'Toyota',
    category: 'SUVs',
    price: 4200000,
    priceFormatted: '₹42.00 Lakh',
    emi: '₹68,500/mo',
    year: 2022,
    km: '28,000 km',
    fuel: 'Diesel',
    transmission: 'Automatic',
    location: 'Hyderabad',
    owner: '1st Owner',
    rating: 4.9,
    verified: true,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
    seller: { name: 'Anand Reddy', phone: '+91 98850 11223', verified: true }
  },
  {
    id: 6,
    title: '2023 Royal Enfield Himalayan 450 Kamet',
    brand: 'Royal Enfield',
    category: 'Bikes',
    price: 285000,
    priceFormatted: '₹2.85 Lakh',
    emi: '₹5,800/mo',
    year: 2023,
    km: '6,200 km',
    fuel: 'Petrol',
    transmission: 'Manual',
    location: 'Pune',
    owner: '1st Owner',
    rating: 4.8,
    verified: true,
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    seller: { name: 'Aditya Joshi', phone: '+91 97654 32109', verified: true }
  }
];

export default function App() {
  const [vehicles, setVehicles] = useState(INITIAL_VEHICLES);
  const [favorites, setFavorites] = useState([1, 3]);
  const [compareList, setCompareList] = useState([1, 2]);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedPrice, setSelectedPrice] = useState('Any Price');
  const [activeCategory, setActiveCategory] = useState('All');

  // Modals
  const [showSellModal, setShowSellModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [selectedVehicleDetails, setSelectedVehicleDetails] = useState(null);
  
  // Sell Form
  const [newVehicle, setNewVehicle] = useState({
    title: '', brand: 'Hyundai', price: '', year: 2023, km: '', fuel: 'Petrol', location: 'Mumbai', category: 'Cars'
  });

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleCompare = (id) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(item => item !== id);
      if (prev.length >= 3) {
        alert('You can compare up to 3 vehicles at a time.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleSellSubmit = (e) => {
    e.preventDefault();
    if (!newVehicle.title || !newVehicle.price) return;

    const numPrice = parseFloat(newVehicle.price);
    const formattedPrice = numPrice >= 100000 
      ? `₹${(numPrice / 100000).toFixed(2)} Lakh`
      : `₹${numPrice.toLocaleString()}`;

    const created = {
      id: Date.now(),
      title: newVehicle.title,
      brand: newVehicle.brand,
      category: newVehicle.category,
      price: numPrice,
      priceFormatted: formattedPrice,
      emi: `₹${Math.round(numPrice * 0.016).toLocaleString()}/mo`,
      year: parseInt(newVehicle.year, 10),
      km: `${newVehicle.km || '10,000'} km`,
      fuel: newVehicle.fuel,
      transmission: 'Manual',
      location: newVehicle.location,
      owner: '1st Owner',
      rating: 5.0,
      verified: true,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      seller: { name: 'Alex Johnson', phone: '+91 90000 11111', verified: true }
    };

    setVehicles([created, ...vehicles]);
    setShowSellModal(false);
    setNewVehicle({ title: '', brand: 'Hyundai', price: '', year: 2023, km: '', fuel: 'Petrol', location: 'Mumbai', category: 'Cars' });
    alert('Vehicle listing published successfully on AutoDrive!');
  };

  // Filtered List
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === 'All Brands' || v.brand === selectedBrand;
    const matchesCity = selectedCity === 'All Cities' || v.location === selectedCity;
    const matchesCategory = activeCategory === 'All' || v.category === activeCategory;
    
    let matchesPrice = true;
    if (selectedPrice === 'Under 5L') matchesPrice = v.price <= 500000;
    if (selectedPrice === 'Under 15L') matchesPrice = v.price <= 1500000;
    if (selectedPrice === 'Under 30L') matchesPrice = v.price <= 3000000;
    if (selectedPrice === '30L+') matchesPrice = v.price > 3000000;

    return matchesSearch && matchesBrand && matchesCity && matchesCategory && matchesPrice;
  });

  return (
    <div className="app-container">
      {/* Header matching user screenshot */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo-container" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="logo-icon">
              <Car size={26} strokeWidth={2.5} />
            </div>
            <div className="logo-text">
              <span className="logo-title">AutoDrive</span>
              <span className="logo-subtitle">VERIFIED MARKETPLACE</span>
            </div>
          </div>

          <ul className="nav-links">
            <li>
              <a className="nav-item active" href="#home">Home</a>
            </li>
            <li>
              <a className="nav-item" href="#buy">Buy Vehicle</a>
            </li>
            <li>
              <button onClick={() => setShowSellModal(true)} className="nav-item" style={{ background: 'none', border: 'none' }}>
                <PlusCircle size={16} style={{ color: '#f59e0b' }} /> Sell Vehicle
              </button>
            </li>
            <li>
              <button onClick={() => setShowCompareModal(true)} className="nav-item" style={{ background: 'none', border: 'none' }}>
                <GitCompare size={16} /> Compare 
                {compareList.length > 0 && <span className="nav-badge">{compareList.length}</span>}
              </button>
            </li>
            <li>
              <span className="nav-item">
                <Heart size={16} /> Favorites 
                {favorites.length > 0 && <span className="nav-badge">{favorites.length}</span>}
              </span>
            </li>
          </ul>

          <div className="profile-button">
            <div className="avatar">A</div>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Alex Johnson</span>
            <ChevronDown size={14} color="#94a3b8" />
          </div>
        </div>
      </nav>

      {/* Hero Section matching user screenshot */}
      <section className="hero-section" id="home">
        <div className="hero-pill">
          <Sparkles size={14} /> INDIA'S PREMIER SECOND-HAND VEHICLE PLATFORM
        </div>

        <h1 className="hero-title">
          Find Your Dream Vehicle
          <span>At The Perfect Price</span>
        </h1>

        <p className="hero-subtitle">
          Explore over 1,000+ verified pre-owned cars, SUVs, sedans, and bikes. Compare specs, calculate prices, and connect directly with sellers.
        </p>

        <div className="hero-features">
          <div className="hero-feature-item">
            <span className="feature-check"><CheckCircle size={14} /></span> 100% Inspected Listings
          </div>
          <div className="hero-feature-item">
            <span className="feature-check"><CheckCircle size={14} /></span> Direct Seller Contact
          </div>
          <div className="hero-feature-item">
            <span className="feature-check"><CheckCircle size={14} /></span> Zero Brokerage
          </div>
        </div>
      </section>

      {/* Floating Search Bar matching user screenshot */}
      <div className="search-container" id="buy">
        <div className="search-box">
          {/* Search Vehicle */}
          <div className="filter-group">
            <label className="filter-label">SEARCH VEHICLE</label>
            <div className="filter-input-wrapper">
              <Search size={18} className="filter-input-icon" />
              <input 
                type="text"
                placeholder="e.g. Innova, Creta, Thar..."
                className="filter-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Brand */}
          <div className="filter-group">
            <label className="filter-label">BRAND</label>
            <div className="filter-input-wrapper">
              <Car size={18} className="filter-input-icon" />
              <select className="filter-select" value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
                <option value="All Brands">All Brands</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Mahindra">Mahindra</option>
                <option value="Tata">Tata</option>
                <option value="Toyota">Toyota</option>
                <option value="BMW">BMW</option>
                <option value="Royal Enfield">Royal Enfield</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="filter-group">
            <label className="filter-label">LOCATION</label>
            <div className="filter-input-wrapper">
              <MapPin size={18} className="filter-input-icon" />
              <select className="filter-select" value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
                <option value="All Cities">All Cities</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
              </select>
            </div>
          </div>

          {/* Max Price */}
          <div className="filter-group">
            <label className="filter-label">MAX PRICE (₹)</label>
            <div className="filter-input-wrapper">
              <Tag size={18} className="filter-input-icon" />
              <select className="filter-select" value={selectedPrice} onChange={e => setSelectedPrice(e.target.value)}>
                <option value="Any Price">Any Price</option>
                <option value="Under 5L">Under ₹5 Lakh</option>
                <option value="Under 15L">Under ₹15 Lakh</option>
                <option value="Under 30L">Under ₹30 Lakh</option>
                <option value="30L+">₹30 Lakh & Above</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <button className="btn-search">
            <Search size={18} /> Find Vehicles
          </button>
        </div>
      </div>

      {/* Main Vehicle Listings Grid */}
      <main className="listings-container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Verified Vehicles Available</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Showing {filteredVehicles.length} of {vehicles.length} inspected pre-owned vehicles
            </p>
          </div>

          {/* Category Tabs */}
          <div className="category-pills">
            {['All', 'Cars', 'SUVs', 'Luxury', 'Bikes', 'Electric'].map(cat => (
              <button 
                key={cat}
                className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredVehicles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'rgba(17, 24, 39, 0.5)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <AlertCircle size={48} color="#f59e0b" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>No Vehicles Found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className="cards-grid">
            {filteredVehicles.map(v => {
              const isFav = favorites.includes(v.id);
              const isComp = compareList.includes(v.id);

              return (
                <div key={v.id} className="vehicle-card">
                  <div className="card-image-wrapper">
                    <img src={v.image} alt={v.title} className="card-image" />
                    {v.verified && (
                      <div className="verified-badge">
                        <ShieldCheck size={14} /> VERIFIED
                      </div>
                    )}
                    <button 
                      onClick={() => toggleFavorite(v.id)}
                      className={`fav-btn ${isFav ? 'active' : ''}`}
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart size={18} fill={isFav ? '#fff' : 'none'} />
                    </button>
                  </div>

                  <div className="card-body">
                    <h3 className="vehicle-title">{v.title}</h3>
                    
                    <div className="price-row">
                      <div className="vehicle-price">{v.priceFormatted}</div>
                      <div className="vehicle-emi">EMI from {v.emi}</div>
                    </div>

                    <div className="specs-grid">
                      <div className="spec-item">
                        <Gauge size={14} color="#94a3b8" /> {v.km}
                      </div>
                      <div className="spec-item">
                        <Fuel size={14} color="#94a3b8" /> {v.fuel}
                      </div>
                      <div className="spec-item">
                        <SlidersHorizontal size={14} color="#94a3b8" /> {v.transmission}
                      </div>
                      <div className="spec-item">
                        <MapPin size={14} color="#94a3b8" /> {v.location}
                      </div>
                    </div>

                    <div className="card-footer">
                      <button onClick={() => setSelectedVehicleDetails(v)} className="btn-details">
                        View Details & Seller
                      </button>
                      <button 
                        onClick={() => toggleCompare(v.id)} 
                        className={`btn-compare ${isComp ? 'active' : ''}`}
                        title={isComp ? 'Remove from compare' : 'Compare specs'}
                      >
                        <GitCompare size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Compare Floating Bar */}
      {compareList.length > 0 && (
        <div className="compare-drawer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <GitCompare size={20} color="#f59e0b" />
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>
                Comparing {compareList.length} Vehicles
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Side-by-side specification match
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setShowCompareModal(true)} className="btn-search" style={{ height: '36px', padding: '0 1rem', fontSize: '0.85rem' }}>
              View Comparison
            </button>
            <button onClick={() => setCompareList([])} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Modal: Sell Vehicle */}
      {showSellModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">List Your Vehicle on AutoDrive</h2>
              <button onClick={() => setShowSellModal(false)} className="close-btn"><X size={18} /></button>
            </div>

            <form onSubmit={handleSellSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="filter-label" style={{ marginBottom: '0.4rem', display: 'block' }}>VEHICLE TITLE *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 2022 Honda City ZX Petrol"
                    className="filter-input" 
                    style={{ paddingLeft: '1rem' }}
                    value={newVehicle.title}
                    onChange={e => setNewVehicle({ ...newVehicle, title: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="filter-label" style={{ marginBottom: '0.4rem', display: 'block' }}>BRAND</label>
                    <select 
                      className="filter-select" 
                      style={{ paddingLeft: '1rem' }}
                      value={newVehicle.brand}
                      onChange={e => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                    >
                      <option value="Hyundai">Hyundai</option>
                      <option value="Mahindra">Mahindra</option>
                      <option value="Tata">Tata</option>
                      <option value="Toyota">Toyota</option>
                      <option value="BMW">BMW</option>
                      <option value="Royal Enfield">Royal Enfield</option>
                      <option value="Honda">Honda</option>
                    </select>
                  </div>

                  <div>
                    <label className="filter-label" style={{ marginBottom: '0.4rem', display: 'block' }}>EXPECTED PRICE (₹) *</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 850000"
                      className="filter-input" 
                      style={{ paddingLeft: '1rem' }}
                      value={newVehicle.price}
                      onChange={e => setNewVehicle({ ...newVehicle, price: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="filter-label" style={{ marginBottom: '0.4rem', display: 'block' }}>MODEL YEAR</label>
                    <input 
                      type="number" 
                      className="filter-input" 
                      style={{ paddingLeft: '1rem' }}
                      value={newVehicle.year}
                      onChange={e => setNewVehicle({ ...newVehicle, year: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="filter-label" style={{ marginBottom: '0.4rem', display: 'block' }}>KM DRIVEN</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 25000"
                      className="filter-input" 
                      style={{ paddingLeft: '1rem' }}
                      value={newVehicle.km}
                      onChange={e => setNewVehicle({ ...newVehicle, km: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="filter-label" style={{ marginBottom: '0.4rem', display: 'block' }}>LOCATION CITY</label>
                    <select 
                      className="filter-select" 
                      style={{ paddingLeft: '1rem' }}
                      value={newVehicle.location}
                      onChange={e => setNewVehicle({ ...newVehicle, location: e.target.value })}
                    >
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Pune">Pune</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button type="button" onClick={() => setShowSellModal(false)} className="category-pill">
                    Cancel
                  </button>
                  <button type="submit" className="btn-search" style={{ height: '44px' }}>
                    Publish Listing
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Vehicle Details & Contact */}
      {selectedVehicleDetails && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px' }}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedVehicleDetails.title}</h2>
              <button onClick={() => setSelectedVehicleDetails(null)} className="close-btn"><X size={18} /></button>
            </div>

            <img 
              src={selectedVehicleDetails.image} 
              alt={selectedVehicleDetails.title}
              style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '14px', marginBottom: '1.5rem' }} 
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-yellow-light)', marginBottom: '0.25rem' }}>
                  {selectedVehicleDetails.priceFormatted}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Estimated EMI: {selectedVehicleDetails.emi}</div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck size={28} color="#10b981" />
                <div>
                  <div style={{ fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>AutoDrive Certified</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>140-point quality check score: 4.9 / 5.0</div>
                </div>
              </div>
            </div>

            {/* Verified Seller Box */}
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={18} color="#f59e0b" /> Verified Seller Information
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#e2e8f0' }}>{selectedVehicleDetails.seller.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedVehicleDetails.location} • Verified Seller</div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <a href={`tel:${selectedVehicleDetails.seller.phone}`} className="btn-search" style={{ height: '40px', padding: '0 1rem', textDecoration: 'none', fontSize: '0.85rem' }}>
                    <Phone size={14} /> Call Seller
                  </a>
                  <a href={`https://wa.me/?text=Hi, I am interested in ${selectedVehicleDetails.title}`} target="_blank" rel="noreferrer" className="category-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
                    <MessageSquare size={14} /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Compare Vehicles */}
      {showCompareModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '900px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Vehicle Comparison Matrix</h2>
              <button onClick={() => setShowCompareModal(false)} className="close-btn"><X size={18} /></button>
            </div>

            {compareList.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No vehicles selected for comparison.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-muted)' }}>Specification</th>
                      {compareList.map(id => {
                        const item = vehicles.find(v => v.id === id);
                        return (
                          <th key={id} style={{ padding: '1rem', textAlign: 'center', minWidth: '200px' }}>
                            <img src={item.image} alt={item.title} style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }} />
                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.title}</div>
                            <div style={{ color: 'var(--accent-yellow-light)', fontWeight: 800 }}>{item.priceFormatted}</div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Year</td>
                      {compareList.map(id => <td key={id} style={{ padding: '0.75rem', textAlign: 'center' }}>{vehicles.find(v => v.id === id).year}</td>)}
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>KM Driven</td>
                      {compareList.map(id => <td key={id} style={{ padding: '0.75rem', textAlign: 'center' }}>{vehicles.find(v => v.id === id).km}</td>)}
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Fuel Type</td>
                      {compareList.map(id => <td key={id} style={{ padding: '0.75rem', textAlign: 'center' }}>{vehicles.find(v => v.id === id).fuel}</td>)}
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Transmission</td>
                      {compareList.map(id => <td key={id} style={{ padding: '0.75rem', textAlign: 'center' }}>{vehicles.find(v => v.id === id).transmission}</td>)}
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Location</td>
                      {compareList.map(id => <td key={id} style={{ padding: '0.75rem', textAlign: 'center' }}>{vehicles.find(v => v.id === id).location}</td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 AutoDrive Verified Marketplace. All rights reserved. India's Premier Second-Hand Vehicle Platform.</p>
      </footer>
    </div>
  );
}
