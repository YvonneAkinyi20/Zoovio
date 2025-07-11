import React, { useState } from 'react';
import { Heart, Send, MapPin, Phone, Mail } from 'lucide-react';

const Adopt: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    petType: '',
    experience: '',
    livingSpace: '',
    otherPets: '',
    workSchedule: '',
    reason: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Adoption form submitted:', formData);
    alert('Thank you for your adoption application! We will contact you soon.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-accent-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Adopt a Pet</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Give a loving home to a pet in need. Fill out our adoption application to start the process.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Adoption Process */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Adoption Process</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Submit Application</h3>
                  <p className="text-gray-600">Fill out our detailed adoption application form to help us understand your needs and preferences.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Review & Interview</h3>
                  <p className="text-gray-600">Our team will review your application and conduct a phone or video interview to ensure a good match.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Meet & Greet</h3>
                  <p className="text-gray-600">Arrange a meeting with your potential new pet to ensure compatibility and comfort.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Finalize Adoption</h3>
                  <p className="text-gray-600">Complete the adoption paperwork and welcome your new family member home!</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Contact Information</h3>
              <div className="space-y-2 text-blue-800">
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>adopt@zoovio.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>123 Pet Street, City, State 12345</span>
                </div>
              </div>
            </div>
          </div>

          {/* Adoption Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Adoption Application</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pet Type Preference
                  </label>
                  <select
                    name="petType"
                    value={formData.petType}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select preference</option>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="either">Either</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pet Experience
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select experience level</option>
                  <option value="first-time">First-time pet owner</option>
                  <option value="some">Some experience</option>
                  <option value="experienced">Very experienced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Living Space
                </label>
                <select
                  name="livingSpace"
                  value={formData.livingSpace}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select living space</option>
                  <option value="apartment">Apartment</option>
                  <option value="house-small">House with small yard</option>
                  <option value="house-large">House with large yard</option>
                  <option value="farm">Farm/Rural property</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Other Pets
                </label>
                <input
                  type="text"
                  name="otherPets"
                  value={formData.otherPets}
                  onChange={handleChange}
                  placeholder="Describe any other pets you have"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Schedule
                </label>
                <select
                  name="workSchedule"
                  value={formData.workSchedule}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select work schedule</option>
                  <option value="home">Work from home</option>
                  <option value="part-time">Part-time away</option>
                  <option value="full-time">Full-time away</option>
                  <option value="retired">Retired</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Why do you want to adopt a pet?
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={4}
                  className="input-field"
                  placeholder="Tell us about your motivation for pet adoption..."
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center btn-accent text-lg py-3"
              >
                <Send className="h-5 w-5 mr-2" />
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adopt;