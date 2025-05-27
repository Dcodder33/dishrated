import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, DollarSign, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { eventService } from '@/services';
import LocationPicker from './LocationPicker';
import { LocationCoordinates } from '../utils/locationService';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated?: (event: any) => void;
}

// Helper function to validate URL
const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onEventCreated
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    date: '',
    endDate: '',
    eventType: 'truck_event',
    location: null as { address: string; coordinates: LocationCoordinates } | null,
    maxParticipants: '',
    registrationDeadline: '',
    tags: '',
    requirements: '',
    contactInfo: {
      email: user?.email || '',
      phone: ''
    },
    pricing: {
      participationFee: '0',
      currency: 'INR'
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const keys = name.split('.');
      setFormData(prev => {
        const newData = { ...prev };
        let current: any = newData;

        // Navigate to the parent object
        for (let i = 0; i < keys.length - 1; i++) {
          if (current[keys[i]] && typeof current[keys[i]] === 'object') {
            current[keys[i]] = { ...current[keys[i]] };
            current = current[keys[i]];
          }
        }

        // Set the final value
        current[keys[keys.length - 1]] = value;
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to create events",
        variant: "destructive"
      });
      return;
    }

    // Validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.image.trim() || !formData.date || !formData.location?.address.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields including title, description, image, date, and location",
        variant: "destructive"
      });
      return;
    }

    // Validate image URL
    if (!isValidUrl(formData.image)) {
      toast({
        title: "Invalid Image URL",
        description: "Please enter a valid image URL",
        variant: "destructive"
      });
      return;
    }

    // Check if event date is in the future
    if (new Date(formData.date) <= new Date()) {
      toast({
        title: "Invalid Date",
        description: "Event date must be in the future",
        variant: "destructive"
      });
      return;
    }

    // Check if end date is after start date
    if (formData.endDate && new Date(formData.endDate) <= new Date(formData.date)) {
      toast({
        title: "Invalid End Date",
        description: "End date must be after start date",
        variant: "destructive"
      });
      return;
    }

    // Check if registration deadline is before event date
    if (formData.registrationDeadline && new Date(formData.registrationDeadline) >= new Date(formData.date)) {
      toast({
        title: "Invalid Registration Deadline",
        description: "Registration deadline must be before event date",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // Prepare data for API
      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        image: formData.image.trim(),
        date: formData.date,
        endDate: formData.endDate || undefined,
        eventType: formData.eventType,
        location: formData.location,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
        registrationDeadline: formData.registrationDeadline || undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        requirements: formData.requirements.trim() || undefined,
        contactInfo: {
          email: formData.contactInfo.email.trim() || undefined,
          phone: formData.contactInfo.phone.trim() || undefined
        },
        pricing: {
          participationFee: parseFloat(formData.pricing.participationFee) || 0,
          currency: formData.pricing.currency
        }
      };

      console.log('Event data being sent:', eventData);

      // Create event via API
      const createdEvent = await eventService.createEvent(eventData);

      const successMessage = formData.eventType === 'city_event' && user?.role !== 'admin'
        ? "Event created successfully! It will be reviewed by an admin before being published."
        : "Event created successfully!";

      toast({
        title: "Success!",
        description: successMessage,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        image: '',
        date: '',
        endDate: '',
        eventType: 'city_event',
        location: null,
        maxParticipants: '',
        registrationDeadline: '',
        tags: '',
        requirements: '',
        contactInfo: {
          email: user?.email || '',
          phone: ''
        },
        pricing: {
          participationFee: '0',
          currency: 'INR'
        }
      });

      onClose();

      if (onEventCreated) {
        onEventCreated(createdEvent);
      }

    } catch (error: any) {
      console.error('Error creating event:', error);
      console.error('Error response:', error.response?.data);

      let errorMessage = 'Failed to create event. Please try again.';

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Create New Event</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter event title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Describe your event"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Image URL *
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type *
              </label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="city_event">City Event {user?.role !== 'admin' && '(Requires Admin Approval)'}</option>
                <option value="truck_event">Truck Event</option>
                <option value="offer">Special Offer</option>
              </select>
              {formData.eventType === 'city_event' && user?.role !== 'admin' && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> City events require admin approval before being published.
                    Your event will be reviewed and you'll be notified of the decision.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Date & Time
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Deadline (Optional)
              </label>
              <input
                type="datetime-local"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Location
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Location *
              </label>
              <LocationPicker
                value={formData.location}
                onChange={(location) => setFormData(prev => ({ ...prev, location }))}
                placeholder="Search for event location or use current location"
                required
              />
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Details</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Participants (Optional)
              </label>
              <input
                type="number"
                min="1"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Leave empty for unlimited"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="festival, food, family"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements (Optional)
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Special requirements for participants"
              />
            </div>
          </div>

          {/* Contact & Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact & Pricing</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactInfo.email"
                  value={formData.contactInfo.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contactInfo.phone"
                  value={formData.contactInfo.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Participation Fee
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="pricing.participationFee"
                  value={formData.pricing.participationFee}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  name="pricing.currency"
                  value={formData.pricing.currency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-red-500 hover:bg-red-600"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
