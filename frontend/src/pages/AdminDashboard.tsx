import React, { useState, useEffect } from 'react';
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Calendar,
  Mail,
  Phone,
  Building,
  Plus,
  Edit,
  Trash2,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface OwnerApplication {
  _id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  cuisineType: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: {
    name: string;
    email: string;
  };
  rejectionReason?: string;
  notes?: string;
  applicationAge: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'owner' | 'admin';
  isActive: boolean;
  banReason?: string;
  bannedAt?: string;
  bannedBy?: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: {
    name: string;
    email: string;
  };
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  readTime: number;
  views: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  endDate?: string;
  location: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  eventType: 'city_event' | 'truck_event' | 'offer';
  organizer: {
    name: string;
    email: string;
  };
  organizerType: 'admin' | 'owner';
  participatingTrucks: Array<{
    truck: {
      name: string;
    };
    status: 'pending' | 'confirmed' | 'declined';
    confirmedAt: string;
  }>;
  maxParticipants?: number;
  registrationDeadline?: string;
  tags: string[];
  featured: boolean;
  requirements?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  pricing?: {
    participationFee: number;
    currency: string;
  };
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: {
    name: string;
    email: string;
  };
  approvedAt?: string;
  rejectionReason?: string;
  participantCount: number;
  availableSpots?: number;
  isRegistrationOpen: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  pendingApplications: number;
  monthlyApplications: number;
  totalApplications: number;
  approvalRate: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentApplications: OwnerApplication[];
  applicationBreakdown: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [applications, setApplications] = useState<OwnerApplication[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [blogSearchTerm, setBlogSearchTerm] = useState('');
  const [blogStatusFilter, setBlogStatusFilter] = useState('all');
  const [blogCategoryFilter, setBlogCategoryFilter] = useState('all');
  const [eventSearchTerm, setEventSearchTerm] = useState('');
  const [eventStatusFilter, setEventStatusFilter] = useState('all');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<OwnerApplication | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [notes, setNotes] = useState('');
  const [banReason, setBanReason] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardData();
      fetchApplications();
      fetchBlogs();
      fetchEvents();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await apiService.get('/admin/dashboard');
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await apiService.get(`/admin/applications?${params.toString()}`);
      if (response.success) {
        setApplications(response.data.applications);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveApplication = async (applicationId: string, notes?: string) => {
    try {
      setActionLoading(true);
      const response = await apiService.put(`/admin/applications/${applicationId}/approve`, { notes });

      if (response.success) {
        toast({
          title: "Application Approved",
          description: "Vendor account has been created successfully",
        });
        fetchApplications();
        fetchDashboardData();
        setShowApplicationModal(false);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve application",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectApplication = async (applicationId: string, rejectionReason: string, notes?: string) => {
    try {
      setActionLoading(true);
      const response = await apiService.put(`/admin/applications/${applicationId}/reject`, {
        rejectionReason,
        notes
      });

      if (response.success) {
        toast({
          title: "Application Rejected",
          description: "Application has been rejected",
        });
        fetchApplications();
        fetchDashboardData();
        setShowApplicationModal(false);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject application",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const fetchUsers = async () => {
    // Only fetch users if there's a search term with minimum length
    if (!userSearchTerm.trim() || userSearchTerm.trim().length < 2) {
      setUsers([]);
      setUsersLoading(false);
      return;
    }

    try {
      setUsersLoading(true);
      const params = new URLSearchParams();
      if (userRoleFilter !== 'all') params.append('role', userRoleFilter);
      if (userStatusFilter !== 'all') params.append('status', userStatusFilter);
      if (userSearchTerm) params.append('search', userSearchTerm);

      const response = await apiService.get(`/admin/users?${params.toString()}`);
      if (response.success) {
        setUsers(response.data.users);
      }
    } catch (error: any) {
      // Don't show error for search requirement
      if (!error.message?.includes('Search term is required')) {
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive"
        });
      }
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleBanUser = async (userId: string, reason: string) => {
    try {
      setActionLoading(true);
      const response = await apiService.put(`/admin/users/${userId}/ban`, { reason });

      if (response.success) {
        toast({
          title: "User Status Updated",
          description: response.message,
        });
        fetchUsers();
        setShowBanModal(false);
        setShowUserModal(false);
        setBanReason('');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user status",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      setBlogsLoading(true);
      const params = new URLSearchParams();
      if (blogStatusFilter !== 'all') params.append('status', blogStatusFilter);
      if (blogCategoryFilter !== 'all') params.append('category', blogCategoryFilter);
      if (blogSearchTerm) params.append('search', blogSearchTerm);

      const response = await apiService.get(`/admin/blogs?${params.toString()}`);
      if (response.success) {
        setBlogs(response.data.blogs);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load blogs",
        variant: "destructive"
      });
    } finally {
      setBlogsLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setEventsLoading(true);
      const params = new URLSearchParams();
      if (eventStatusFilter !== 'all') params.append('status', eventStatusFilter);
      if (eventTypeFilter !== 'all') params.append('eventType', eventTypeFilter);
      if (eventSearchTerm) params.append('search', eventSearchTerm);

      const response = await apiService.get(`/admin/events?${params.toString()}`);
      if (response.success) {
        setEvents(response.data.events);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive"
      });
    } finally {
      setEventsLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    try {
      setActionLoading(true);
      const response = await apiService.delete(`/admin/blogs/${blogId}`);

      if (response.success) {
        toast({
          title: "Blog Deleted",
          description: response.message,
        });
        fetchBlogs();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      setActionLoading(true);
      const response = await apiService.delete(`/admin/events/${eventId}`);

      if (response.success) {
        toast({
          title: "Event Deleted",
          description: response.message,
        });
        fetchEvents();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveEvent = async (eventId: string, notes?: string) => {
    try {
      setActionLoading(true);
      const response = await apiService.put(`/admin/events/${eventId}/approve`, { notes });

      if (response.success) {
        toast({
          title: "Event Approved",
          description: response.message,
        });
        fetchEvents();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve event",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectEvent = async (eventId: string, rejectionReason: string) => {
    try {
      setActionLoading(true);
      const response = await apiService.put(`/admin/events/${eventId}/reject`, { rejectionReason });

      if (response.success) {
        toast({
          title: "Event Rejected",
          description: response.message,
        });
        fetchEvents();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject event",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchApplications();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [userSearchTerm, userRoleFilter, userStatusFilter]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchBlogs();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [blogSearchTerm, blogStatusFilter, blogCategoryFilter]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchEvents();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [eventSearchTerm, eventStatusFilter, eventTypeFilter]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage food truck owner applications and platform operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{dashboardData.stats.pendingApplications}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.monthlyApplications}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.totalApplications}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{dashboardData.stats.approvalRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foodtruck-teal focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Applications List */}
            <Card>
              <CardHeader>
                <CardTitle>Food Truck Owner Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foodtruck-teal mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading applications...</p>
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No applications found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div key={application._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{application.businessName}</h3>
                              {getStatusBadge(application.status)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {application.ownerName}
                              </div>
                              <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {application.email}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(application.submittedAt)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedApplication(application);
                                setRejectionReason('');
                                setNotes('');
                                setShowApplicationModal(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {application.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApproveApplication(application._id)}
                                  disabled={actionLoading}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedApplication(application);
                                    setShowApplicationModal(true);
                                  }}
                                  disabled={actionLoading}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* User Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users by name or email (min 2 characters)..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foodtruck-teal focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="user">Customers</option>
                <option value="owner">Food Truck Owners</option>
              </select>
              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foodtruck-teal focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Banned</option>
              </select>
            </div>

            {/* Users List */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Users</CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foodtruck-teal mx-auto"></div>
                    <p className="text-gray-600 mt-2">Searching users...</p>
                  </div>
                ) : !userSearchTerm.trim() || userSearchTerm.trim().length < 2 ? (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Search for Users</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Enter at least 2 characters of a name or email address in the search box above to find and manage platform users.
                      This search-only approach helps maintain performance with large user databases.
                    </p>
                    {userSearchTerm.trim().length > 0 && userSearchTerm.trim().length < 2 && (
                      <p className="text-orange-600 text-sm mt-2">
                        Please enter at least 2 characters to search
                      </p>
                    )}
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No users found matching your search criteria</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{user.name}</h3>
                              <Badge variant="secondary" className={`${
                                user.role === 'owner' ? 'bg-blue-100 text-blue-800' :
                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {user.role === 'owner' ? 'Food Truck Owner' :
                                 user.role === 'admin' ? 'Admin' : 'Customer'}
                              </Badge>
                              <Badge variant="secondary" className={`${
                                user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.isActive ? 'Active' : 'Banned'}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {user.email}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Joined {formatDate(user.createdAt)}
                              </div>
                            </div>
                            {!user.isActive && user.banReason && (
                              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                                <strong>Ban Reason:</strong> {user.banReason}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserModal(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {user.role !== 'admin' && (
                              <Button
                                variant={user.isActive ? "destructive" : "default"}
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  if (user.isActive) {
                                    setShowBanModal(true);
                                  } else {
                                    handleBanUser(user._id, '');
                                  }
                                }}
                                disabled={actionLoading}
                              >
                                {user.isActive ? (
                                  <>
                                    <X className="h-4 w-4 mr-1" />
                                    Ban
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-4 w-4 mr-1" />
                                    Unban
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blogs" className="space-y-6">
            {/* Blog Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search blogs..."
                  value={blogSearchTerm}
                  onChange={(e) => setBlogSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={blogStatusFilter}
                onChange={(e) => setBlogStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foodtruck-teal focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              <select
                value={blogCategoryFilter}
                onChange={(e) => setBlogCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foodtruck-teal focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="food-trends">Food Trends</option>
                <option value="truck-spotlights">Truck Spotlights</option>
                <option value="city-guides">City Guides</option>
                <option value="recipes">Recipes</option>
                <option value="events">Events</option>
                <option value="business-tips">Business Tips</option>
                <option value="sustainability">Sustainability</option>
                <option value="reviews">Reviews</option>
                <option value="news">News</option>
                <option value="other">Other</option>
              </select>
              <Button
                onClick={() => window.open('/admin/blogs/create', '_blank')}
                className="bg-foodtruck-teal hover:bg-foodtruck-slate"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Blog
              </Button>
            </div>

            {/* Blogs List */}
            <Card>
              <CardHeader>
                <CardTitle>Blog Posts</CardTitle>
              </CardHeader>
              <CardContent>
                {blogsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foodtruck-teal mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading blogs...</p>
                  </div>
                ) : blogs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No blogs found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {blogs.map((blog) => (
                      <div key={blog._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{blog.title}</h3>
                              <Badge variant="secondary" className={`${
                                blog.status === 'published' ? 'bg-green-100 text-green-800' :
                                blog.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {blog.status}
                              </Badge>
                              {blog.featured && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{blog.excerpt}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-500">
                              <div>Category: {blog.category}</div>
                              <div>Author: {blog.author.name}</div>
                              <div>Views: {blog.views}</div>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              {blog.tags.map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`/admin/blogs/${blog._id}/edit`, '_blank')}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this blog?')) {
                                  handleDeleteBlog(blog._id);
                                }
                              }}
                              disabled={actionLoading}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            {/* Event Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search events..."
                  value={eventSearchTerm}
                  onChange={(e) => setEventSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={eventStatusFilter}
                onChange={(e) => setEventStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foodtruck-teal focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foodtruck-teal focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="city_event">City Events</option>
                <option value="truck_event">Truck Events</option>
                <option value="offer">Offers</option>
              </select>
              <select
                value={eventStatusFilter}
                onChange={(e) => setEventStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foodtruck-teal focus:border-transparent"
              >
                <option value="all">All Approval Status</option>
                <option value="pending">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <Button
                onClick={() => window.open('/admin/events/create', '_blank')}
                className="bg-foodtruck-teal hover:bg-foodtruck-slate"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Event
              </Button>
            </div>

            {/* Events List */}
            <Card>
              <CardHeader>
                <CardTitle>Events</CardTitle>
              </CardHeader>
              <CardContent>
                {eventsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foodtruck-teal mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading events...</p>
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No events found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{event.title}</h3>
                              <Badge variant="secondary" className={`${
                                event.status === 'published' ? 'bg-green-100 text-green-800' :
                                event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {event.status}
                              </Badge>
                              <Badge variant="secondary" className={`${
                                event.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                                event.approvalStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {event.approvalStatus}
                              </Badge>
                              <Badge variant="secondary" className={`${
                                event.eventType === 'city_event' ? 'bg-blue-100 text-blue-800' :
                                event.eventType === 'truck_event' ? 'bg-purple-100 text-purple-800' :
                                'bg-orange-100 text-orange-800'
                              }`}>
                                {event.eventType === 'city_event' ? 'City Event' :
                                 event.eventType === 'truck_event' ? 'Truck Event' : 'Offer'}
                              </Badge>
                              {event.featured && (
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{event.description.substring(0, 150)}...</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(event.date)}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {event.location.address}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {event.participantCount} participants
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {event.approvalStatus === 'pending' && (
                              <>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleApproveEvent(event._id)}
                                  disabled={actionLoading}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    const reason = window.prompt('Please provide a reason for rejection:');
                                    if (reason && reason.trim().length >= 10) {
                                      handleRejectEvent(event._id, reason);
                                    } else if (reason !== null) {
                                      toast({
                                        title: "Error",
                                        description: "Rejection reason must be at least 10 characters long",
                                        variant: "destructive"
                                      });
                                    }
                                  }}
                                  disabled={actionLoading}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`/admin/events/${event._id}/edit`, '_blank')}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this event?')) {
                                  handleDeleteEvent(event._id);
                                }
                              }}
                              disabled={actionLoading}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Application Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pending</span>
                      <span className="text-sm text-gray-600">{dashboardData.applicationBreakdown.pending}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Approved</span>
                      <span className="text-sm text-gray-600">{dashboardData.applicationBreakdown.approved}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Rejected</span>
                      <span className="text-sm text-gray-600">{dashboardData.applicationBreakdown.rejected}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.recentApplications.map((app) => (
                      <div key={app._id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium text-sm">{app.businessName}</p>
                          <p className="text-xs text-gray-600">{app.ownerName}</p>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Application Details Modal */}
      <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Application Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Business Name</label>
                  <p className="text-lg font-semibold">{selectedApplication.businessName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Owner Name</label>
                  <p className="text-lg">{selectedApplication.ownerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-lg">{selectedApplication.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-lg">{selectedApplication.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Cuisine Type</label>
                  <p className="text-lg capitalize">{selectedApplication.cuisineType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedApplication.status)}</div>
                </div>
              </div>

              {selectedApplication.description && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-gray-900">{selectedApplication.description}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">Submitted</label>
                <p className="text-lg">{formatDate(selectedApplication.submittedAt)}</p>
              </div>

              {selectedApplication.status === 'pending' && (
                <>
                  {/* Rejection Reason (only show if rejecting) */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Rejection Reason</label>
                    <Textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter reason for rejection (required for rejection)"
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Notes (Optional)</label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any additional notes..."
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                </>
              )}

              {selectedApplication.status !== 'pending' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Review Information</h4>
                  {selectedApplication.reviewedAt && (
                    <p className="text-sm text-gray-600">
                      Reviewed on: {formatDate(selectedApplication.reviewedAt)}
                    </p>
                  )}
                  {selectedApplication.reviewedBy && (
                    <p className="text-sm text-gray-600">
                      Reviewed by: {selectedApplication.reviewedBy.name}
                    </p>
                  )}
                  {selectedApplication.rejectionReason && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Rejection Reason:</p>
                      <p className="text-sm text-gray-600">{selectedApplication.rejectionReason}</p>
                    </div>
                  )}
                  {selectedApplication.notes && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Notes:</p>
                      <p className="text-sm text-gray-600">{selectedApplication.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {selectedApplication?.status === 'pending' && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowApplicationModal(false)}
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (!rejectionReason.trim()) {
                      toast({
                        title: "Error",
                        description: "Rejection reason is required",
                        variant: "destructive"
                      });
                      return;
                    }
                    handleRejectApplication(selectedApplication._id, rejectionReason, notes);
                  }}
                  disabled={actionLoading}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleApproveApplication(selectedApplication._id, notes)}
                  disabled={actionLoading}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </div>
            )}
            {selectedApplication?.status !== 'pending' && (
              <Button
                variant="outline"
                onClick={() => setShowApplicationModal(false)}
              >
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban User Modal */}
      <Dialog open={showBanModal} onOpenChange={setShowBanModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> This will ban the user <strong>{selectedUser.name}</strong> from the platform.
                  They will not be able to access their account until unbanned.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Ban Reason *</label>
                <Textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Enter reason for banning this user..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowBanModal(false);
                setBanReason('');
              }}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!banReason.trim()) {
                  toast({
                    title: "Error",
                    description: "Ban reason is required",
                    variant: "destructive"
                  });
                  return;
                }
                handleBanUser(selectedUser!._id, banReason);
              }}
              disabled={actionLoading || !banReason.trim()}
            >
              {actionLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Banning...
                </>
              ) : (
                <>
                  <X className="h-4 w-4 mr-1" />
                  Ban User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
