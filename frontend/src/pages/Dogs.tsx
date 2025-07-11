import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import PetCard from '../components/PetCard';

const Dogs: React.FC = () => {
  const [dogs, setDogs] = useState([]);
  const [filteredDogs, setFilteredDogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [priceRange, setPriceRange] = useState('');

  useEffect(() => {
    // Mock data for dogs
    const mockDogs = [
      {
        id: '1',
        name: 'Max',
        breed: 'Golden Retriever',
        age: '2 years',
        price: 1200,
        image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
        type: 'dog' as const,
        description: 'Friendly and energetic golden retriever, perfect for families with children.',
        gender: 'Male',
        color: 'Golden',
        available: true,
      },
      {
        id: '2',
        name: 'Buddy',
        breed: 'Labrador Mix',
        age: '3 years',
        price: 950,
        image: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=400',
        type: 'dog' as const,
        description: 'Loyal and trained labrador mix, great with children and other pets.',
        gender: 'Male',
        color: 'Brown',
        available: true,
      },
      {
        id: '3',
        name: 'Bella',
        breed: 'German Shepherd',
        age: '1 year',
        price: 1500,
        image: 'https://images.pexels.com/photos/1346086/pexels-photo-1346086.jpeg?auto=compress&cs=tinysrgb&w=400',
        type: 'dog' as const,
        description: 'Intelligent German Shepherd puppy, excellent for training and protection.',
        gender: 'Female',
        color: 'Black & Tan',
        available: true,
      },
      {
        id: '4',
        name: 'Rocky',
        breed: 'Bulldog',
        age: '4 years',
        price: 1800,
        image: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=400',
        type: 'dog' as const,
        description: 'Calm and gentle bulldog, perfect for apartment living.',
        gender: 'Male',
        color: 'Brindle',
        available: true,
      },
      {
        id: '5',
        name: 'Luna',
        breed: 'Siberian Husky',
        age: '2 years',
        price: 1350,
        image: 'https://images.pexels.com/photos/1269118/pexels-photo-1269118.jpeg?auto=compress&cs=tinysrgb&w=400',
        type: 'dog' as const,
        description: 'Beautiful Siberian Husky with striking blue eyes and energetic personality.',
        gender: 'Female',
        color: 'Black & White',
        available: true,
      },
      {
        id: '6',
        name: 'Charlie',
        breed: 'Beagle',
        age: '6 months',
        price: 800,
        image: 'https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg?auto=compress&cs=tinysrgb&w=400',
        type: 'dog' as const,
        description: 'Adorable beagle puppy, friendly and great with families.',
        gender: 'Male',
        color: 'Tri-color',
        available: true,
      },
    ];
    setDogs(mockDogs);
    setFilteredDogs(mockDogs);
  }, []);

  useEffect(() => {
    let filtered = dogs;

    if (searchTerm) {
      filtered = filtered.filter(dog =>
        dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dog.breed.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedBreed) {
      filtered = filtered.filter(dog => dog.breed === selectedBreed);
    }

    if (selectedAge) {
      filtered = filtered.filter(dog => dog.age === selectedAge);
    }

    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(dog => dog.price >= min && dog.price <= max);
    }

    setFilteredDogs(filtered);
  }, [searchTerm, selectedBreed, selectedAge, priceRange, dogs]);

  const breeds = [...new Set(dogs.map(dog => dog.breed))];
  const ages = [...new Set(dogs.map(dog => dog.age))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Dogs & Puppies</h1>
          <p className="text-xl">Find your perfect canine companion</p>
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
                placeholder="Search dogs..."
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
              <option value="1500-2000">$1500 - $2000</option>
              <option value="2000-5000">$2000+</option>
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
            Showing {filteredDogs.length} of {dogs.length} dogs
          </p>
        </div>

        {/* Dogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDogs.map((dog) => (
            <PetCard key={dog.id} pet={dog} />
          ))}
        </div>

        {filteredDogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No dogs found matching your criteria.</p>
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

export default Dogs;