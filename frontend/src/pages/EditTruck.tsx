import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import TruckImageCarousel from '../components/TruckImageCarousel';
import TruckImageManager from '../components/TruckImageManager';
import {
  ArrowLeft,
  Truck,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Save,
  Calendar,
  Images
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { apiService } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface MenuItem {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  allergens: string[];
  isVegetarian: boolean;
  isVegan: boolean;
}

interface TruckImage {
  id: string;
  url: string;
  caption?: string;
  isAdvertisement?: boolean;
  order: number;
}

interface TruckData {
  _id: string;
  name: string;
  description: string;
  cuisine: string;
  image: string;
  images?: TruckImage[];
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  priceRange: 'budget' | 'mid' | 'premium';
  tags?: string[];
  menu?: MenuItem[];
  status: string;
  waitTime: string;
  rating: number;
  reviewCount: number;
  schedule?: {
    day: string;
    hours: string;
    location: string;
  }[];
  aboutInfo?: {
    specialties: string;
    story: string;
    ingredients: string;
    phone: string;
    website: string;
    instagram: string;
    twitter: string;
  };
}

const EditTruck: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [truckData, setTruckData] = useState<TruckData | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [imageManagerOpen, setImageManagerOpen] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState<MenuItem>({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    isAvailable: true,
    allergens: [],
    isVegetarian: false,
    isVegan: false
  });
  const [scheduleData, setScheduleData] = useState<{[key: string]: {hours: string, location: string}}>({
    Monday: { hours: '', location: '' },
    Tuesday: { hours: '', location: '' },
    Wednesday: { hours: '', location: '' },
    Thursday: { hours: '', location: '' },
    Friday: { hours: '', location: '' },
    Saturday: { hours: '', location: '' },
    Sunday: { hours: '', location: '' }
  });
  const [aboutData, setAboutData] = useState({
    description: '',
    specialties: '',
    story: '',
    ingredients: '',
    phone: '',
    website: '',
    instagram: '',
    twitter: ''
  });

  // Redirect if not owner
  useEffect(() => {
    if (!user || user.role !== 'owner') {
      navigate('/login');
      return;
    }

    if (id) {
      fetchTruckData();
    }
  }, [user, navigate, id]);

  // Populate state when truck data is loaded
  useEffect(() => {
    if (truckData) {
      // Populate schedule data
      if (truckData.schedule) {
        const scheduleMap: {[key: string]: {hours: string, location: string}} = {};
        truckData.schedule.forEach(item => {
          scheduleMap[item.day] = {
            hours: item.hours || '',
            location: item.location || ''
          };
        });
        setScheduleData(prev => ({ ...prev, ...scheduleMap }));
      }

      // Populate about data
      if (truckData.aboutInfo) {
        setAboutData({
          description: truckData.description || '',
          specialties: truckData.aboutInfo.specialties || '',
          story: truckData.aboutInfo.story || '',
          ingredients: truckData.aboutInfo.ingredients || '',
          phone: truckData.aboutInfo.phone || '',
          website: truckData.aboutInfo.website || '',
          instagram: truckData.aboutInfo.instagram || '',
          twitter: truckData.aboutInfo.twitter || ''
        });
      } else {
        setAboutData(prev => ({
          ...prev,
          description: truckData.description || ''
        }));
      }
    }
  }, [truckData]);

  const fetchTruckData = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(`/owner/trucks/${id}`);

      if (response.success && response.data) {
        const truckDataFromAPI = response.data as TruckData;
        setTruckData(truckDataFromAPI);
      } else {
        throw new Error(response.message || 'Failed to fetch truck data');
      }
    } catch (error: any) {
      console.error('Error fetching truck data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load truck data",
        variant: "destructive",
      });
      navigate('/owner/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleBasicInfoUpdate = async (field: string, value: any) => {
    if (!truckData) return;

    try {
      const updateData = { [field]: value };
      const response = await apiService.put(`/owner/trucks/${id}/basic-info`, updateData);

      if (response.success) {
        setTruckData(prev => prev ? { ...prev, [field]: value } : null);
        toast({
          title: "Success",
          description: "Truck updated successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update truck",
        variant: "destructive",
      });
    }
  };



  const addTag = () => {
    if (!truckData || !tagInput.trim()) return;

    const currentTags = truckData.tags || [];
    if (currentTags.includes(tagInput.trim())) return;

    const newTags = [...currentTags, tagInput.trim()];
    setTruckData(prev => prev ? { ...prev, tags: newTags } : null);
    handleBasicInfoUpdate('tags', newTags);
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    if (!truckData) return;

    const currentTags = truckData.tags || [];
    const newTags = currentTags.filter(tag => tag !== tagToRemove);
    setTruckData(prev => prev ? { ...prev, tags: newTags } : null);
    handleBasicInfoUpdate('tags', newTags);
  };

  const addMenuItem = async () => {
    if (!newMenuItem.name || !newMenuItem.description || !newMenuItem.category) {
      toast({
        title: "Error",
        description: "Please fill in all required menu item fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiService.post(`/trucks/${id}/menu`, { menuItem: newMenuItem });

      if (response.success) {
        await fetchTruckData(); // Refresh data
        setNewMenuItem({
          name: '',
          description: '',
          price: 0,
          category: '',
          image: '',
          isAvailable: true,
          allergens: [],
          isVegetarian: false,
          isVegan: false
        });
        toast({
          title: "Success",
          description: "Menu item added successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add menu item",
        variant: "destructive",
      });
    }
  };

  const deleteMenuItem = async (menuItemId: string) => {
    try {
      const response = await apiService.delete(`/trucks/${id}/menu/${menuItemId}`);

      if (response.success) {
        await fetchTruckData(); // Refresh data
        toast({
          title: "Success",
          description: "Menu item deleted successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete menu item",
        variant: "destructive",
      });
    }
  };

  const handleScheduleUpdate = async () => {
    try {
      setSaving(true);
      const schedule = Object.entries(scheduleData).map(([day, data]) => ({
        day,
        hours: data.hours,
        location: data.location
      }));

      const response = await apiService.put(`/owner/trucks/${id}/schedule`, { schedule });

      if (response.success) {
        toast({
          title: "Success",
          description: "Schedule updated successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update schedule",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAboutUpdate = async () => {
    try {
      setSaving(true);
      const response = await apiService.put(`/owner/trucks/${id}/about`, aboutData);

      if (response.success) {
        toast({
          title: "Success",
          description: "About information updated successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update about information",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveImages = async (images: TruckImage[]) => {
    try {
      setSaving(true);
      // In a real app, you would save to the backend
      // For now, we'll update the local state
      setTruckData(prev => prev ? { ...prev, images } : null);

      toast({
        title: "Success",
        description: "Images updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update images",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foodtruck-teal mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!truckData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <p className="text-gray-600">Truck not found</p>
            <Button onClick={() => navigate('/owner/dashboard')} className="mt-4">
              Back to Dashboard
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-24">
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

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit {truckData.name}</h1>
          <p className="text-gray-600">Manage your food truck details, menu, and settings</p>
        </div>

        <Tabs defaultValue="menu" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Update your food truck's basic details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Truck Name</Label>
                    <Input
                      id="name"
                      value={truckData.name || ''}
                      onChange={(e) => setTruckData(prev => prev ? { ...prev, name: e.target.value } : null)}
                      onBlur={() => handleBasicInfoUpdate('name', truckData.name)}
                      placeholder="Enter your truck name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cuisine">Cuisine Type</Label>
                    <Input
                      id="cuisine"
                      value={truckData.cuisine || ''}
                      onChange={(e) => setTruckData(prev => prev ? { ...prev, cuisine: e.target.value } : null)}
                      onBlur={() => handleBasicInfoUpdate('cuisine', truckData.cuisine)}
                      placeholder="e.g., Indian, Italian, Mexican"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priceRange">Price Range</Label>
                    <Select
                      value={truckData.priceRange || ''}
                      onValueChange={(value) => {
                        setTruckData(prev => prev ? { ...prev, priceRange: value as any } : null);
                        handleBasicInfoUpdate('priceRange', value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select price range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="budget">Budget (₹)</SelectItem>
                        <SelectItem value="mid">Mid-range (₹₹)</SelectItem>
                        <SelectItem value="premium">Premium (₹₹₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={truckData.status || ''}
                      onValueChange={(value) => {
                        setTruckData(prev => prev ? { ...prev, status: value } : null);
                        handleBasicInfoUpdate('status', value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="busy">Busy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={truckData.description || ''}
                    onChange={(e) => setTruckData(prev => prev ? { ...prev, description: e.target.value } : null)}
                    onBlur={() => handleBasicInfoUpdate('description', truckData.description)}
                    rows={4}
                    placeholder="Tell customers about your food truck, specialties, and what makes you unique..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waitTime">Wait Time</Label>
                  <Input
                    id="waitTime"
                    value={truckData.waitTime || ''}
                    onChange={(e) => setTruckData(prev => prev ? { ...prev, waitTime: e.target.value } : null)}
                    onBlur={() => handleBasicInfoUpdate('waitTime', truckData.waitTime)}
                    placeholder="e.g., 10-15 minutes"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(truckData.tags || []).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-foodtruck-teal/10 text-foodtruck-teal"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-foodtruck-teal/70 hover:text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag (e.g., spicy, vegetarian, halal)"
                      onKeyDown={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Menu Management
                </CardTitle>
                <CardDescription>
                  Add, edit, and manage your menu items
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add New Menu Item */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium mb-4">Add New Menu Item</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="itemName">Item Name</Label>
                      <Input
                        id="itemName"
                        value={newMenuItem.name}
                        onChange={(e) => setNewMenuItem(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Butter Chicken"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="itemCategory">Category</Label>
                      <Input
                        id="itemCategory"
                        value={newMenuItem.category}
                        onChange={(e) => setNewMenuItem(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., Main Course"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="itemPrice">Price (₹)</Label>
                      <Input
                        id="itemPrice"
                        type="number"
                        value={newMenuItem.price}
                        onChange={(e) => setNewMenuItem(prev => ({ ...prev, price: Number(e.target.value) }))}
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="itemImage">Image URL</Label>
                      <Input
                        id="itemImage"
                        value={newMenuItem.image}
                        onChange={(e) => setNewMenuItem(prev => ({ ...prev, image: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label htmlFor="itemDescription">Description</Label>
                    <Textarea
                      id="itemDescription"
                      value={newMenuItem.description}
                      onChange={(e) => setNewMenuItem(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your menu item..."
                      rows={3}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newMenuItem.isVegetarian}
                        onChange={(e) => setNewMenuItem(prev => ({ ...prev, isVegetarian: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Vegetarian</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newMenuItem.isVegan}
                        onChange={(e) => setNewMenuItem(prev => ({ ...prev, isVegan: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Vegan</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newMenuItem.isAvailable}
                        onChange={(e) => setNewMenuItem(prev => ({ ...prev, isAvailable: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">Available</span>
                    </label>
                  </div>

                  <Button onClick={addMenuItem} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Menu Item
                  </Button>
                </div>

                {/* Existing Menu Items */}
                <div>
                  <h3 className="font-medium mb-4">Current Menu Items</h3>
                  {(truckData.menu && truckData.menu.length > 0) ? (
                    <div className="space-y-4">
                      {Object.entries(
                        (truckData.menu || []).reduce((acc: any, item: any) => {
                          const category = item.category || 'Other';
                          if (!acc[category]) acc[category] = [];
                          acc[category].push(item);
                          return acc;
                        }, {})
                      ).map(([category, items]: [string, any]) => (
                        <div key={category} className="border rounded-lg p-4">
                          <h4 className="font-medium text-lg mb-3 text-foodtruck-slate border-b pb-2">
                            {category}
                          </h4>
                          <div className="space-y-3">
                            {items.map((item: any) => (
                              <div key={item._id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h5 className="font-medium">{item.name}</h5>
                                    {item.isVegetarian && (
                                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Veg</span>
                                    )}
                                    {item.isVegan && (
                                      <span className="text-xs bg-green-200 text-green-900 px-2 py-0.5 rounded-full">Vegan</span>
                                    )}
                                    {!item.isAvailable && (
                                      <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Unavailable</span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                                  <p className="font-medium text-foodtruck-teal">₹{item.price}</p>
                                </div>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteMenuItem(item._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No menu items yet. Add your first item above!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Management
                </CardTitle>
                <CardDescription>
                  Manage your food truck's operating schedule and locations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Weekly Schedule</h3>

                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <div key={day} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                      <div className="flex items-center">
                        <Label className="font-medium w-20">{day}</Label>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`${day}-hours`}>Hours</Label>
                        <Input
                          id={`${day}-hours`}
                          placeholder="e.g., 11:00 AM - 8:00 PM or Closed"
                          value={scheduleData[day]?.hours || ''}
                          onChange={(e) => setScheduleData(prev => ({
                            ...prev,
                            [day]: { ...prev[day], hours: e.target.value }
                          }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`${day}-location`}>Location</Label>
                        <Input
                          id={`${day}-location`}
                          placeholder="e.g., Near the Park"
                          value={scheduleData[day]?.location || ''}
                          onChange={(e) => setScheduleData(prev => ({
                            ...prev,
                            [day]: { ...prev[day], location: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                  ))}

                  <Button className="mt-4" onClick={handleScheduleUpdate} disabled={saving}>
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Schedule
                      </>
                    )}
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Schedule Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Keep your schedule updated to help customers find you</li>
                    <li>• Use "Closed" for days when you're not operating</li>
                    <li>• Be specific about locations (landmarks help customers)</li>
                    <li>• Consider peak hours and popular locations</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Edit className="h-5 w-5 mr-2" />
                  About Your Food Truck
                </CardTitle>
                <CardDescription>
                  Tell customers about your story, specialties, and what makes you unique
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="about-description">Truck Description</Label>
                  <Textarea
                    id="about-description"
                    value={truckData.description || ''}
                    onChange={(e) => setTruckData(prev => prev ? { ...prev, description: e.target.value } : null)}
                    onBlur={() => handleBasicInfoUpdate('description', truckData.description)}
                    placeholder="Tell customers about your food truck, your story, and what makes your food special..."
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about-specialties">Specialties & Signature Dishes</Label>
                  <Textarea
                    id="about-specialties"
                    value={aboutData.specialties}
                    onChange={(e) => setAboutData(prev => ({ ...prev, specialties: e.target.value }))}
                    placeholder="What are your most popular dishes? What makes them special?"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about-story">Your Story</Label>
                  <Textarea
                    id="about-story"
                    value={aboutData.story}
                    onChange={(e) => setAboutData(prev => ({ ...prev, story: e.target.value }))}
                    placeholder="Share your journey - how did you start? What inspired you to open a food truck?"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about-ingredients">Ingredients & Quality</Label>
                  <Textarea
                    id="about-ingredients"
                    value={aboutData.ingredients}
                    onChange={(e) => setAboutData(prev => ({ ...prev, ingredients: e.target.value }))}
                    placeholder="Tell customers about your ingredients, sourcing, and quality standards..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="about-phone">Contact Phone</Label>
                    <Input
                      id="about-phone"
                      value={aboutData.phone}
                      onChange={(e) => setAboutData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="e.g., (555) 123-4567"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about-website">Website</Label>
                    <Input
                      id="about-website"
                      value={aboutData.website}
                      onChange={(e) => setAboutData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="e.g., www.yourfoodtruck.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about-instagram">Instagram</Label>
                    <Input
                      id="about-instagram"
                      value={aboutData.instagram}
                      onChange={(e) => setAboutData(prev => ({ ...prev, instagram: e.target.value }))}
                      placeholder="e.g., @yourfoodtruck"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about-twitter">Twitter</Label>
                    <Input
                      id="about-twitter"
                      value={aboutData.twitter}
                      onChange={(e) => setAboutData(prev => ({ ...prev, twitter: e.target.value }))}
                      placeholder="e.g., @yourfoodtruck"
                    />
                  </div>
                </div>

                <Button onClick={handleAboutUpdate} disabled={saving}>
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save About Information
                    </>
                  )}
                </Button>

                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">About Section Tips</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Share your passion and what makes your food special</li>
                    <li>• Mention any awards, certifications, or recognition</li>
                    <li>• Include information about dietary options (vegan, gluten-free, etc.)</li>
                    <li>• Keep contact information up to date</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>



          {/* Images Tab */}
          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Images className="h-5 w-5 mr-2" />
                  Image Management
                </CardTitle>
                <CardDescription>
                  Manage your food truck's image carousel for enhanced advertising
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Image Carousel Preview */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-medium">Current Image Carousel</Label>
                    <Button
                      onClick={() => setImageManagerOpen(true)}
                      className="bg-foodtruck-teal hover:bg-foodtruck-teal/90"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Manage Images
                    </Button>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <TruckImageCarousel
                      images={truckData.images || [
                        {
                          id: 'default-1',
                          url: truckData.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center',
                          caption: `${truckData.name} - Main View`,
                          isAdvertisement: false,
                          order: 1
                        }
                      ]}
                      truckName={truckData.name}
                      height="400px"
                      autoPlay={true}
                      autoPlayInterval={4000}
                      showControls={true}
                      showIndicators={true}
                      editable={false}
                    />
                  </div>
                </div>

                {/* Legacy Main Image Field */}
                <div className="space-y-4 border-t pt-6">
                  <Label className="text-lg font-medium">Legacy Main Image (Backup)</Label>
                  <div className="space-y-2">
                    <Label htmlFor="mainImage">Main Image URL</Label>
                    <Input
                      id="mainImage"
                      value={truckData.image || ''}
                      onChange={(e) => setTruckData(prev => prev ? { ...prev, image: e.target.value } : null)}
                      onBlur={() => handleBasicInfoUpdate('image', truckData.image)}
                      placeholder="https://example.com/your-truck-image.jpg"
                    />
                  </div>
                </div>

                {/* Guidelines */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">Image Guidelines</h4>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Use high-quality images (minimum 800x600 pixels)</li>
                      <li>• Show your food truck clearly and attractively</li>
                      <li>• Include food photos for better engagement</li>
                      <li>• Avoid blurry or dark images</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Advertisement Features</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Mark special images as "Featured" for promotion</li>
                      <li>• Reorder images to highlight your best content</li>
                      <li>• Add captions to describe your offerings</li>
                      <li>• Use multiple images to tell your story</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Pro Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Upload 3-5 high-quality images for best results</li>
                    <li>• Include exterior, interior, and food photos</li>
                    <li>• Update images regularly to keep content fresh</li>
                    <li>• Featured images get priority placement in search results</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Image Manager Modal */}
      <TruckImageManager
        isOpen={imageManagerOpen}
        onClose={() => setImageManagerOpen(false)}
        images={truckData?.images || []}
        onSave={handleSaveImages}
        truckName={truckData?.name || 'Food Truck'}
      />

      <Footer />
    </div>
  );
};

export default EditTruck;