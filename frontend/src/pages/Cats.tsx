import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import PetCard from '../components/PetCard';

const Cats: React.FC = () => {
  const [cats, setCats] = useState([]);
  const [filteredCats, setFilteredCats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [priceRange, setPriceRange] = useState('');

  useEffect(() => {
    // Mock data for cats
    const mockCats = [
      {
        id: '101',
        name: 'Luna',
        breed: 'Persian Cat',
        age: '1 year',
        price: 800,
        image: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=400',
        type: 'cat' as const,
        description: 'Beautiful Persian cat with long fluffy fur and gentle personality.',
        gender: 'Female',
        color: 'White',
        available: true,
      },
      {
        id: '102',
        name: 'Shadow',
        breed: 'Maine Coon',
        age: '2 years',
        price: 1200,
        image: 'https://images.pexels.com/photos/1571076/pexels-photo-1571076.jpeg?auto=compress&cs=tinysrgb&w=400',
        type: 'cat' as const,
        description: 'Majestic Maine Coon with impressive size and friendly demeanor.',
        gender: 'Male',
        color: 'Brown Tabby',
        available: true,
      },
      {
        id: '103',
        name: 'Whiskers',
        breed: 'Siamese',
        age: '6 months',
        price: 600,
        image: 'https://images.pexels.com/photos/1276553/pexels-photo-1276553.jpeg?auto=compress&cs=tinysrgb&w=400',
        type: 'cat' as const,
        description: 'Playful Siamese kitten with striking blue eyes and vocal personality.',
        gender: 'Male',
        color: 'Seal Point',
        available: true,
      },
      {
        id: '104',
        name: 'Mittens',
        breed: 'British Shorthair',
        age: '3 years',
        price: 900,
        image: 'https://images.pexels.com/photos/1314550/pexels-photo-1314550.jpeg?auto=compress&cs=tinysrgb&w=400',
        type: 'cat' as const,
        description: 'Calm British Shorthair with round face and plush coat.',
        gender: 'Female',
        color: 'Blue',
        available: true,
      },
      {
        id: '105',
        name: 'Ginger',
        breed: 'Orange Tabby',
        age: '1 year',
        price: 500,
        image: 'https://images.pexels.com/photos/1123999/pexels-photo-1123999.jpeg?auto=compress&cs=tinysrgb&w=400',
        type: 'cat' as const,
        description: 'Friendly orange tabby with a loving and social personality.',
        gender: 'Male',
        color: 'Orange',
        available: true,
      },
      {
        id: '106',
        name: 'Princess',
        breed: 'Ragdoll',
        age: '2 years',
        price: 1100,
        image: 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=400',
        type: 'cat' as const,
        description: 'Gentle Ragdoll with beautiful blue eyes and docile temperament.',
        gender: 'Female',
        color: 'Colorpoint',
        available: true,
      },
    ];
    setCats(mockCats);
    setFilteredCats(mockCats);
  }, []);

  useEffect(() => {
    let filtered = cats;

    if (searchTerm) {
      filtered = filtered.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.breed.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedBreed) {
      filtered = filtered.filter(cat => cat.breed === selectedBreed);
    }

    if (selectedAge) {
      filtered = filtered.filter(cat => cat.age === selectedAge);
    }

    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(cat => cat.price >= min && cat.price <= max);
    }

    setFilteredCats(filtered);
  }, [searchTerm, selectedBreed, selectedAge, priceRange, cats]);

  const breeds = [...new Set(cats.map(cat => cat.breed))];
  const ages = [...new Set(cats.map(cat => cat.age))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-secondary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cats & Kittens</h1>
          <p className="text-xl">Find your perfect feline friend</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search cats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field"
              />
            </div>

            {/* Breed Filter */}
            <select
              value={selectedBreed}
              onChange={(e) => setSelectedBreed(e.target.value)}
              className="input-field"
            >
              <option value="">All Breeds</option>
              {breeds.map(breed => (
                <option key={breed} value={breed}>{breed}</option>
              ))}
            </select>

            {/* Age Filter */}
            <select
              value={selectedAge}
              onChange={(e) => setSelectedAge(e.target.value)}
              className="input-field"
            >
              <option value="">All Ages</option>
              {ages.map(age => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>

            {/* Price Range */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="input-field"
            >
              <option value="">All Prices</option>
              <option value="0-500">$0 - $500</option>
              <option value="500-1000">$500 - $1000</option>
              <option value="1000-1500">$1000 - $1500</option>
              <option value="1500-2000">$1500+</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedBreed('');
                setSelectedAge('');
                setPriceRange('');
              }}
              className="flex items-center justify-center btn-secondary"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredCats.length} of {cats.length} cats
          </p>
        </div>

        {/* Cats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCats.map((cat) => (
            <PetCard key={cat.id} pet={cat} />
          ))}
        </div>

        {filteredCats.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No cats found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedBreed('');
                setSelectedAge('');
                setPriceRange('');
              }}
              className="btn-primary mt-4"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cats;