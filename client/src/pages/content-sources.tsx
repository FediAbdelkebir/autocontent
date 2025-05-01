import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { apiRequest } from "@/lib/queryClient";
import { getStatusBadgeClass } from "@/lib/utils";
import { ContentSource } from "@shared/schema";

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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertBanner } from "@/components/dashboard/alert-banner";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const ContentSources = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [sourceToEdit, setSourceToEdit] = useState<ContentSource | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "RSS",
    url: "",
    apiKey: "",
    isActive: true,
    fetchInterval: 30
  });

  // Fetch content sources
  const { data: contentSources, isLoading, error } = useQuery({
    queryKey: ['/api/content-sources'],
  });

  // Add content source mutation
  const addMutation = useMutation({
    mutationFn: (newSource: typeof formData) => {
      return apiRequest("POST", "/api/content-sources", newSource);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content-sources'] });
      toast({
        title: "Content source added",
        description: "The content source has been added successfully.",
      });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error adding content source",
        description: error.message || "There was a problem adding the content source.",
        variant: "destructive",
      });
    }
  });

  // Update content source mutation
  const updateMutation = useMutation({
    mutationFn: (updatedSource: Partial<ContentSource>) => {
      return apiRequest("PUT", `/api/content-sources/${sourceToEdit?.id}`, updatedSource);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content-sources'] });
      toast({
        title: "Content source updated",
        description: "The content source has been updated successfully.",
      });
      setIsEditDialogOpen(false);
      setSourceToEdit(null);
    },
    onError: (error) => {
      toast({
        title: "Error updating content source",
        description: error.message || "There was a problem updating the content source.",
        variant: "destructive",
      });
    }
  });

  // Delete content source mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest("DELETE", `/api/content-sources/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content-sources'] });
      toast({
        title: "Content source deleted",
        description: "The content source has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting content source",
        description: error.message || "There was a problem deleting the content source.",
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
    if (!sourceToEdit) return;
    
    updateMutation.mutate({
      name: formData.name,
      type: formData.type,
      url: formData.url,
      apiKey: formData.apiKey,
      isActive: formData.isActive,
      fetchInterval: formData.fetchInterval
    });
  };

  const handleEdit = (source: ContentSource) => {
    setSourceToEdit(source);
    setFormData({
      name: source.name,
      type: source.type,
      url: source.url,
      apiKey: source.apiKey || "",
      isActive: source.isActive,
      fetchInterval: source.fetchInterval
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this content source?")) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "RSS",
      url: "",
      apiKey: "",
      isActive: true,
      fetchInterval: 30
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) : value
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "RSS":
        return "ri-rss-line";
      case "API":
        return "ri-code-line";
      default:
        return "ri-question-line";
    }
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
              <h1 className="text-2xl font-bold">Content Sources</h1>
              <p className="text-muted-foreground mt-1">Manage your content ingestion sources</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <i className="ri-add-line mr-2"></i>
                Add Content Source
              </Button>
            </div>
          </div>

          {error && (
            <AlertBanner
              title="Error loading content sources"
              message="There was a problem fetching the content sources. Please try again."
              type="error"
            />
          )}

          <div className="bg-surface rounded-lg p-5 mb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fetch Interval</TableHead>
                  <TableHead>Last Fetched</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex justify-center items-center">
                        <i className="ri-loader-4-line animate-spin text-2xl mr-2"></i>
                        <span>Loading content sources...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : contentSources && contentSources.length > 0 ? (
                  contentSources.map((source: ContentSource) => (
                    <TableRow key={source.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <i className={`${getTypeIcon(source.type)} text-primary mr-2`}></i>
                          {source.name}
                        </div>
                      </TableCell>
                      <TableCell>{source.type}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={source.url}>
                        {source.url}
                      </TableCell>
                      <TableCell>
                        <span className={getStatusBadgeClass(source.isActive ? "active" : "inactive")}>
                          {source.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>{source.fetchInterval} min</TableCell>
                      <TableCell>
                        {source.lastFetched
                          ? new Date(source.lastFetched).toLocaleString()
                          : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(source)} className="h-8 w-8">
                          <i className="ri-edit-line"></i>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(source.id)} className="h-8 w-8 text-destructive">
                          <i className="ri-delete-bin-line"></i>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <p className="text-muted-foreground">No content sources found</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setIsAddDialogOpen(true)}
                      >
                        <i className="ri-add-line mr-2"></i>
                        Add Content Source
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      {/* Add Content Source Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Content Source</DialogTitle>
            <DialogDescription>
              Add a new source to fetch content from for video creation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
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
                  Type
                </Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({...formData, type: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RSS">RSS Feed</SelectItem>
                    <SelectItem value="API">API</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  URL
                </Label>
                <Input
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              {formData.type === "API" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="apiKey" className="text-right">
                    API Key
                  </Label>
                  <Input
                    id="apiKey"
                    name="apiKey"
                    type="password"
                    value={formData.apiKey}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fetchInterval" className="text-right">
                  Fetch Interval (min)
                </Label>
                <Input
                  id="fetchInterval"
                  name="fetchInterval"
                  type="number"
                  min="5"
                  max="1440"
                  value={formData.fetchInterval}
                  onChange={handleInputChange}
                  className="col-span-3"
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
                Add Source
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Content Source Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Content Source</DialogTitle>
            <DialogDescription>
              Update the details of the content source.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
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
                  Type
                </Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({...formData, type: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RSS">RSS Feed</SelectItem>
                    <SelectItem value="API">API</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-url" className="text-right">
                  URL
                </Label>
                <Input
                  id="edit-url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              {formData.type === "API" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-apiKey" className="text-right">
                    API Key
                  </Label>
                  <Input
                    id="edit-apiKey"
                    name="apiKey"
                    type="password"
                    value={formData.apiKey}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="••••••••"
                  />
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-fetchInterval" className="text-right">
                  Fetch Interval (min)
                </Label>
                <Input
                  id="edit-fetchInterval"
                  name="fetchInterval"
                  type="number"
                  min="5"
                  max="1440"
                  value={formData.fetchInterval}
                  onChange={handleInputChange}
                  className="col-span-3"
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
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => {
                setIsEditDialogOpen(false);
                setSourceToEdit(null);
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

export default ContentSources;
