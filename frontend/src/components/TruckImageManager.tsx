import React, { useState } from 'react';
import { X, Plus, Upload, Move, Trash2, Star, StarOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TruckImage {
  id: string;
  url: string;
  caption?: string;
  isAdvertisement?: boolean;
  order: number;
}

interface TruckImageManagerProps {
  isOpen: boolean;
  onClose: () => void;
  images: TruckImage[];
  onSave: (images: TruckImage[]) => void;
  truckName: string;
}

const TruckImageManager: React.FC<TruckImageManagerProps> = ({
  isOpen,
  onClose,
  images,
  onSave,
  truckName
}) => {
  const [editingImages, setEditingImages] = useState<TruckImage[]>(images);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [newImageIsAd, setNewImageIsAd] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addImage = () => {
    if (!newImageUrl.trim()) return;

    const newImage: TruckImage = {
      id: `img-${Date.now()}`,
      url: newImageUrl.trim(),
      caption: newImageCaption.trim() || undefined,
      isAdvertisement: newImageIsAd,
      order: editingImages.length + 1
    };

    setEditingImages([...editingImages, newImage]);
    setNewImageUrl('');
    setNewImageCaption('');
    setNewImageIsAd(false);
  };

  const removeImage = (id: string) => {
    const filtered = editingImages.filter(img => img.id !== id);
    // Reorder remaining images
    const reordered = filtered.map((img, index) => ({
      ...img,
      order: index + 1
    }));
    setEditingImages(reordered);
  };

  const updateImage = (id: string, updates: Partial<TruckImage>) => {
    setEditingImages(editingImages.map(img => 
      img.id === id ? { ...img, ...updates } : img
    ));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...editingImages];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    
    // Update order
    const reordered = newImages.map((img, index) => ({
      ...img,
      order: index + 1
    }));
    
    setEditingImages(reordered);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveImage(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleSave = () => {
    onSave(editingImages);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a server and get back a URL
      // For demo purposes, we'll create a local URL
      const url = URL.createObjectURL(file);
      setNewImageUrl(url);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Images - {truckName}</DialogTitle>
          <DialogDescription>
            Add, edit, and reorder images for your food truck. Drag and drop to reorder.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Image */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add New Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image-url">Image URL</Label>
                  <Input
                    id="image-url"
                    placeholder="https://example.com/image.jpg"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-upload">Or Upload File</Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image-caption">Caption (Optional)</Label>
                <Textarea
                  id="image-caption"
                  placeholder="Describe this image..."
                  value={newImageCaption}
                  onChange={(e) => setNewImageCaption(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-advertisement"
                  checked={newImageIsAd}
                  onCheckedChange={(checked) => setNewImageIsAd(checked as boolean)}
                />
                <Label htmlFor="is-advertisement" className="text-sm">
                  Mark as featured/advertisement
                </Label>
              </div>

              <Button onClick={addImage} disabled={!newImageUrl.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </CardContent>
          </Card>

          {/* Current Images */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Images ({editingImages.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {editingImages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No images added yet. Add your first image above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {editingImages.map((image, index) => (
                    <div
                      key={image.id}
                      className={cn(
                        "relative group border rounded-lg overflow-hidden cursor-move transition-all",
                        draggedIndex === index ? "opacity-50 scale-95" : "hover:shadow-lg"
                      )}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      {/* Image */}
                      <div className="aspect-video relative">
                        <img
                          src={image.url}
                          alt={image.caption || `Image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center';
                          }}
                        />
                        
                        {/* Order Badge */}
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          #{image.order}
                        </div>

                        {/* Advertisement Badge */}
                        {image.isAdvertisement && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-foodtruck-gold text-black">
                              Featured
                            </Badge>
                          </div>
                        )}

                        {/* Controls */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                            onClick={() => updateImage(image.id, { isAdvertisement: !image.isAdvertisement })}
                          >
                            {image.isAdvertisement ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                          >
                            <Move className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-red-500/50"
                            onClick={() => removeImage(image.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Caption */}
                      <div className="p-3 space-y-2">
                        <Textarea
                          placeholder="Image caption..."
                          value={image.caption || ''}
                          onChange={(e) => updateImage(image.id, { caption: e.target.value })}
                          rows={2}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TruckImageManager;
