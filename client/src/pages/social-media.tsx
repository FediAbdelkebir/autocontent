import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { apiRequest } from "@/lib/queryClient";
import { getStatusBadgeClass, formatTimeAgo, getSocialIcon } from "@/lib/utils";
import { SocialPlatform, SocialPost } from "@shared/schema";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertBanner } from "@/components/dashboard/alert-banner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const SocialMedia = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("platforms");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [platformToEdit, setPlatformToEdit] = useState<SocialPlatform | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "youtube",
    accountName: "",
    isActive: true
  });

  // Fetch social platforms
  const { data: socialPlatforms, isLoading: isLoadingPlatforms, error: platformsError } = useQuery({
    queryKey: ['/api/social-platforms'],
  });

  // Fetch social posts
  const { data: socialPosts, isLoading: isLoadingPosts, error: postsError } = useQuery({
    queryKey: ['/api/social-posts'],
    queryFn: () => fetch('/api/social-posts?limit=20').then(res => res.json())
  });

  // Add social platform mutation
  const addMutation = useMutation({
    mutationFn: (newPlatform: typeof formData) => {
      return apiRequest("POST", "/api/social-platforms", newPlatform);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social-platforms'] });
      toast({
        title: "Platform added",
        description: "The social media platform has been added successfully.",
      });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error adding platform",
        description: error.message || "There was a problem adding the social media platform.",
        variant: "destructive",
      });
    }
  });

  // Update social platform mutation
  const updateMutation = useMutation({
    mutationFn: (updatedPlatform: Partial<SocialPlatform>) => {
      return apiRequest("PUT", `/api/social-platforms/${platformToEdit?.id}`, updatedPlatform);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social-platforms'] });
      toast({
        title: "Platform updated",
        description: "The social media platform has been updated successfully.",
      });
      setIsEditDialogOpen(false);
      setPlatformToEdit(null);
    },
    onError: (error) => {
      toast({
        title: "Error updating platform",
        description: error.message || "There was a problem updating the social media platform.",
        variant: "destructive",
      });
    }
  });

  // Delete social platform mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest("DELETE", `/api/social-platforms/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social-platforms'] });
      toast({
        title: "Platform deleted",
        description: "The social media platform has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting platform",
        description: error.message || "There was a problem deleting the social media platform.",
        variant: "destructive",
      });
    }
  });

  // Retry failed post mutation
  const retryMutation = useMutation({
    mutationFn: (postId: number) => {
      return apiRequest("PUT", `/api/social-posts/${postId}/retry`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social-posts'] });
      toast({
        title: "Post retry initiated",
        description: "The system will attempt to repost the content.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error retrying post",
        description: error.message || "There was a problem initiating the retry.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(formData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!platformToEdit) return;
    
    updateMutation.mutate({
      name: formData.name,
      type: formData.type,
      accountName: formData.accountName,
      isActive: formData.isActive
    });
  };

  const handleEdit = (platform: SocialPlatform) => {
    setPlatformToEdit(platform);
    setFormData({
      name: platform.name,
      type: platform.type,
      accountName: platform.accountName || "",
      isActive: platform.isActive
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this platform? This will also remove all posts associated with it.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleRetry = (postId: number) => {
    retryMutation.mutate(postId);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "youtube",
      accountName: "",
      isActive: true
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const getPlatformStatusClass = (platform: SocialPlatform) => {
    if (!platform.isActive) return getStatusBadgeClass("inactive");
    if (platform.rateLimitReset && new Date(platform.rateLimitReset) > new Date()) {
      return getStatusBadgeClass("rate_limited");
    }
    return getStatusBadgeClass("active");
  };

  const getPlatformStatusText = (platform: SocialPlatform) => {
    if (!platform.isActive) return "Inactive";
    if (platform.rateLimitReset && new Date(platform.rateLimitReset) > new Date()) {
      return "Rate Limited";
    }
    return "Active";
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <MobileHeader />

        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Social Media</h1>
              <p className="text-muted-foreground mt-1">Manage connected platforms and posts</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <i className="ri-add-line mr-2"></i>
                Connect Platform
              </Button>
            </div>
          </div>

          {(platformsError || postsError) && (
            <AlertBanner
              title="Error loading data"
              message="There was a problem fetching the social media data. Please try again."
              type="error"
            />
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="posts">Recent Posts</TabsTrigger>
            </TabsList>
            
            {/* Platforms Tab */}
            <TabsContent value="platforms">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {isLoadingPlatforms ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="bg-surface">
                      <CardHeader className="animate-pulse">
                        <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                          <div className="w-6 h-6 bg-muted rounded"></div>
                        </div>
                        <div className="h-6 w-2/3 bg-muted rounded mt-4"></div>
                        <div className="h-4 w-1/2 bg-muted rounded mt-2"></div>
                      </CardHeader>
                      <CardContent className="animate-pulse">
                        <div className="h-4 w-full bg-muted rounded mb-2"></div>
                        <div className="h-4 w-3/4 bg-muted rounded"></div>
                      </CardContent>
                    </Card>
                  ))
                ) : socialPlatforms && socialPlatforms.length > 0 ? (
                  socialPlatforms.map((platform: SocialPlatform) => (
                    <Card key={platform.id} className="bg-surface">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                            <i className={`${getSocialIcon(platform.type)} text-2xl`}></i>
                          </div>
                          <span className={getPlatformStatusClass(platform)}>
                            {getPlatformStatusText(platform)}
                          </span>
                        </div>
                        <CardTitle className="mt-4">{platform.name}</CardTitle>
                        <p className="text-muted-foreground text-sm">
                          {platform.accountName || "No account name set"}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center mt-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(platform)}>
                            <i className="ri-settings-line mr-1"></i>
                            Configure
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(platform.id)}
                          >
                            <i className="ri-delete-bin-line mr-1"></i>
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 bg-surface rounded-lg">
                    <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                      <i className="ri-share-line text-primary text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-medium mb-2">No platforms connected</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Connect social media platforms to start sharing your content.
                    </p>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <i className="ri-add-line mr-2"></i>
                      Connect Platform
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Posts Tab */}
            <TabsContent value="posts">
              <div className="bg-surface rounded-lg p-5 mb-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Post Text</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Scheduled/Posted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingPosts ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10">
                          <div className="flex justify-center items-center">
                            <i className="ri-loader-4-line animate-spin text-2xl mr-2"></i>
                            <span>Loading social posts...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : socialPosts && socialPosts.length > 0 ? (
                      socialPosts.map((post: any) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">
                            {post.video?.title || "Unknown Content"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <i className={`${getSocialIcon(post.platform?.type)} mr-2`}></i>
                              <span>{post.platform?.name || "Unknown"}</span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate" title={post.postText}>
                            {post.postText || "No text"}
                          </TableCell>
                          <TableCell>
                            <span className={getStatusBadgeClass(post.status)}>
                              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {post.postedAt
                              ? formatTimeAgo(post.postedAt)
                              : post.scheduledAt
                              ? `Scheduled for ${formatTimeAgo(post.scheduledAt)}`
                              : "Not scheduled"}
                          </TableCell>
                          <TableCell className="text-right">
                            {post.status === "failed" && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRetry(post.id)}
                                className="mr-2"
                              >
                                <i className="ri-restart-line mr-1"></i>
                                Retry
                              </Button>
                            )}
                            {post.postUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(post.postUrl, "_blank")}
                              >
                                <i className="ri-external-link-line mr-1"></i>
                                View
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10">
                          <p className="text-muted-foreground">No social posts found</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Add Platform Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Connect Social Platform</DialogTitle>
            <DialogDescription>
              Add a new social media platform for content publishing.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Display Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Platform
                </Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({...formData, type: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="twitter">X (Twitter)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="accountName" className="text-right">
                  Account Name
                </Label>
                <Input
                  id="accountName"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="@youraccount"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Active
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    {formData.isActive ? "Enabled" : "Disabled"}
                  </Label>
                </div>
              </div>
              <div className="col-span-full mt-2">
                <p className="text-sm text-muted-foreground">
                  <i className="ri-information-line mr-1"></i>
                  Note: In a production environment, you would be redirected to the platform's authentication page to authorize access.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => {
                resetForm();
                setIsAddDialogOpen(false);
              }}>
                Cancel
              </Button>
              <Button type="submit" disabled={addMutation.isPending}>
                {addMutation.isPending && (
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                )}
                Connect Platform
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Platform Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Social Platform</DialogTitle>
            <DialogDescription>
              Update the configuration for this social media platform.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Display Name
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-type" className="text-right">
                  Platform
                </Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({...formData, type: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="twitter">X (Twitter)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-accountName" className="text-right">
                  Account Name
                </Label>
                <Input
                  id="edit-accountName"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="@youraccount"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-isActive" className="text-right">
                  Active
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="edit-isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                  />
                  <Label htmlFor="edit-isActive" className="cursor-pointer">
                    {formData.isActive ? "Enabled" : "Disabled"}
                  </Label>
                </div>
              </div>
              <div className="col-span-full mt-2">
                <p className="text-sm text-muted-foreground">
                  <i className="ri-information-line mr-1"></i>
                  To refresh the authentication tokens, you would typically need to reauthorize with the platform.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => {
                setIsEditDialogOpen(false);
                setPlatformToEdit(null);
              }}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && (
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocialMedia;
