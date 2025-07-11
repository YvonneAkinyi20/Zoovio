import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  price: number;
  image: string;
  type: 'dog' | 'cat';
  description: string;
  gender: string;
  color: string;
  available: boolean;
}

interface PetCardProps {
  pet: Pet;
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: pet.id,
      name: pet.name,
      price: pet.price,
      image: pet.image,
      type: pet.type,
      breed: pet.breed,
      age: pet.age,
    });
  };

  return (
    <div className="card overflow-hidden group">
      <div className="relative">
        <img
          src={pet.image}
          alt={pet.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
            <Heart className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        {!pet.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-lg font-semibold">SOLD</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{pet.name}</h3>
          <span className="text-2xl font-bold text-primary-600">${pet.price}</span>
        </div>
        
        <p className="text-gray-600 mb-2">{pet.breed}</p>
        
        <div className="flex justify-between text-sm text-gray-500 mb-3">
          <span>Age: {pet.age}</span>
          <span>Gender: {pet.gender}</span>
        </div>
        
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{pet.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Color: {pet.color}</span>
          {pet.available && (
            <button
              onClick={handleAddToCart}
              className="flex items-center space-x-2 btn-primary"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetCard;