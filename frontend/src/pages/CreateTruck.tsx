import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, Truck, DollarSign, Tag } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { apiService } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AutoLocationPicker from '../components/AutoLocationPicker';

interface TruckFormData {
  name: string;
  description: string;
  cuisine: string;
  image: string;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  priceRange: 'budget' | 'mid' | 'premium';
  tags: string[];
}

const CreateTruck: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState<TruckFormData>({
    name: '',
    description: '',
    cuisine: '',
    image: '',
    location: {
      address: '',
      coordinates: {
        latitude: 0,
        longitude: 0
      }
    },
    priceRange: 'mid',
    tags: []
  });

  // Redirect if not owner
  React.useEffect(() => {
    if (!user || user.role !== 'owner') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (parent === 'location' && child === 'address') {
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            address: value
          }
        }));
      } else if (parent === 'coordinates') {
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            coordinates: {
              ...prev.location.coordinates,
              [child]: parseFloat(value) || 0
            }
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleLocationSelect = (location: any) => {
    setFormData(prev => ({
      ...prev,
      location
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.cuisine) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!formData.location.address || formData.location.coordinates.latitude === 0) {
      toast({
        title: "Error",
        description: "Please select a location for your food truck",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await apiService.post('/owner/trucks', formData);

      if (response.success) {
        toast({
          title: "Success",
          description: "Food truck created successfully!",
        });
        navigate('/owner/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create food truck",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'owner') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/owner/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Food Truck</h1>
          <p className="text-gray-600">Add your food truck to start serving customers</p>
        </div>

        {/* Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Food Truck Details
            </CardTitle>
            <CardDescription>
              Fill in the information about your food truck
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Truck Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Spice Route Express"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your food truck and what makes it special..."
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cuisine">Cuisine Type *</Label>
                  <Input
                    id="cuisine"
                    value={formData.cuisine}
                    onChange={(e) => handleInputChange('cuisine', e.target.value)}
                    placeholder="e.g., Indian, Chinese, American"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="image">Image URL (optional)</Label>
                  <Input
                    id="image"
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="https://example.com/truck-image.jpg"
                  />
                </div>
              </div>

              {/* Location */}
              <AutoLocationPicker
                onLocationSelect={handleLocationSelect}
                initialLocation={formData.location.address ? formData.location : undefined}
              />

              {/* Price Range */}
              <div>
                <div className="flex items-center mb-2">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <Label className="text-base font-medium">Price Range</Label>
                </div>
                <Select value={formData.priceRange} onValueChange={(value: any) => handleInputChange('priceRange', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget">Budget (₹50-₹150)</SelectItem>
                    <SelectItem value="mid">Mid-range (₹150-₹300)</SelectItem>
                    <SelectItem value="premium">Premium (₹300+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div>
                <div className="flex items-center mb-2">
                  <Tag className="h-4 w-4 mr-2" />
                  <Label className="text-base font-medium">Tags</Label>
                </div>

                <div className="flex gap-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag (e.g., spicy, vegetarian)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add
                  </Button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-foodtruck-teal text-white px-2 py-1 rounded-full text-sm cursor-pointer hover:bg-foodtruck-teal/80"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/owner/dashboard')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Creating...' : 'Create Food Truck'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default CreateTruck;
