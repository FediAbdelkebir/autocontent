import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { apiRequest } from "@/lib/queryClient";
import { VideoTemplate } from "@shared/schema";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { AlertBanner } from "@/components/dashboard/alert-banner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const VideoTemplates = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<VideoTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "countdown",
    makeConfig: { templateId: "", duration: 60 },
    duration: 60,
    aspectRatio: "9:16"
  });

  // Fetch video templates
  const { data: videoTemplates, isLoading, error } = useQuery({
    queryKey: ['/api/video-templates'],
  });

  // Add video template mutation
  const addMutation = useMutation({
    mutationFn: (newTemplate: typeof formData) => {
      return apiRequest("POST", "/api/video-templates", newTemplate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/video-templates'] });
      toast({
        title: "Template added",
        description: "The video template has been added successfully.",
      });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error adding template",
        description: error.message || "There was a problem adding the video template.",
        variant: "destructive",
      });
    }
  });

  // Update video template mutation
  const updateMutation = useMutation({
    mutationFn: (updatedTemplate: Partial<VideoTemplate>) => {
      return apiRequest("PUT", `/api/video-templates/${templateToEdit?.id}`, updatedTemplate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/video-templates'] });
      toast({
        title: "Template updated",
        description: "The video template has been updated successfully.",
      });
      setIsEditDialogOpen(false);
      setTemplateToEdit(null);
    },
    onError: (error) => {
      toast({
        title: "Error updating template",
        description: error.message || "There was a problem updating the video template.",
        variant: "destructive",
      });
    }
  });

  // Delete video template mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest("DELETE", `/api/video-templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/video-templates'] });
      toast({
        title: "Template deleted",
        description: "The video template has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting template",
        description: error.message || "There was a problem deleting the video template.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a proper Make.com config
    const makeConfig = {
      templateId: `${formData.type}-template-${Date.now()}`,
      duration: formData.duration,
      aspectRatio: formData.aspectRatio
    };
    
    addMutation.mutate({
      ...formData,
      makeConfig
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateToEdit) return;
    
    // Update the Make.com config
    const makeConfig = {
      ...(templateToEdit.makeConfig || {}),
      duration: formData.duration,
      aspectRatio: formData.aspectRatio
    };
    
    updateMutation.mutate({
      name: formData.name,
      description: formData.description,
      type: formData.type,
      makeConfig,
      duration: formData.duration,
      aspectRatio: formData.aspectRatio
    });
  };

  const handleEdit = (template: VideoTemplate) => {
    setTemplateToEdit(template);
    setFormData({
      name: template.name,
      description: template.description || "",
      type: template.type,
      makeConfig: template.makeConfig,
      duration: template.duration || 60,
      aspectRatio: template.aspectRatio
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "countdown",
      makeConfig: { templateId: "", duration: 60 },
      duration: 60,
      aspectRatio: "9:16"
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) : value
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "countdown":
        return "ri-list-check";
      case "trailer":
        return "ri-movie-2-line";
      case "news":
        return "ri-newspaper-line";
      case "gameplay":
        return "ri-gamepad-line";
      default:
        return "ri-video-line";
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "countdown":
        return "Countdown";
      case "trailer":
        return "Trailer Analysis";
      case "news":
        return "News Update";
      case "gameplay":
        return "Gameplay Highlights";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
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
              <h1 className="text-2xl font-bold">Video Templates</h1>
              <p className="text-muted-foreground mt-1">Manage templates used for automatic video generation</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <i className="ri-add-line mr-2"></i>
                Add Template
              </Button>
            </div>
          </div>

          {error && (
            <AlertBanner
              title="Error loading templates"
              message="There was a problem fetching the video templates. Please try again."
              type="error"
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="bg-surface">
                  <CardHeader className="animate-pulse">
                    <div className="w-12 h-12 bg-primary bg-opacity-10 rounded flex items-center justify-center">
                      <div className="w-6 h-6 bg-muted rounded"></div>
                    </div>
                    <div className="h-6 w-2/3 bg-muted rounded mt-4"></div>
                    <div className="h-4 w-1/2 bg-muted rounded mt-2"></div>
                  </CardHeader>
                  <CardContent className="animate-pulse">
                    <div className="h-4 w-full bg-muted rounded mb-2"></div>
                    <div className="h-4 w-3/4 bg-muted rounded"></div>
                  </CardContent>
                  <CardFooter className="animate-pulse">
                    <div className="h-10 w-full bg-muted rounded"></div>
                  </CardFooter>
                </Card>
              ))
            ) : videoTemplates && videoTemplates.length > 0 ? (
              videoTemplates.map((template: VideoTemplate) => (
                <Card key={template.id} className="bg-surface">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary bg-opacity-10 rounded flex items-center justify-center mb-2">
                      <i className={`${getTypeIcon(template.type)} text-primary text-xl`}></i>
                    </div>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{getTypeName(template.type)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {template.description || "No description provided"}
                    </p>
                    <div className="flex items-center mt-4 space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <i className="ri-time-line mr-1"></i>
                        <span>{template.duration}s</span>
                      </div>
                      <div className="flex items-center">
                        <i className="ri-aspect-ratio-line mr-1"></i>
                        <span>{template.aspectRatio}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(template)}>
                      <i className="ri-edit-line mr-1"></i>
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(template.id)}
                    >
                      <i className="ri-delete-bin-line mr-1"></i>
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 bg-surface rounded-lg">
                <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-video-line text-primary text-2xl"></i>
                </div>
                <h3 className="text-lg font-medium mb-2">No templates found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first template to start generating videos automatically.
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <i className="ri-add-line mr-2"></i>
                  Add Template
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Template Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Video Template</DialogTitle>
            <DialogDescription>
              Create a new template for automated video generation.
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
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
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
                    <SelectItem value="countdown">Countdown Format</SelectItem>
                    <SelectItem value="trailer">Trailer Analysis</SelectItem>
                    <SelectItem value="news">News Update</SelectItem>
                    <SelectItem value="gameplay">Gameplay Highlights</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">
                  Duration (seconds)
                </Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="15"
                  max="300"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="aspectRatio" className="text-right">
                  Aspect Ratio
                </Label>
                <Select 
                  value={formData.aspectRatio} 
                  onValueChange={(value) => setFormData({...formData, aspectRatio: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select aspect ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9:16">9:16 (Vertical / Stories)</SelectItem>
                    <SelectItem value="16:9">16:9 (Landscape / YouTube)</SelectItem>
                    <SelectItem value="1:1">1:1 (Square / Instagram)</SelectItem>
                    <SelectItem value="4:5">4:5 (Portrait / Instagram)</SelectItem>
                  </SelectContent>
                </Select>
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
                Add Template
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Video Template</DialogTitle>
            <DialogDescription>
              Update the details of the video template.
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
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
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
                    <SelectItem value="countdown">Countdown Format</SelectItem>
                    <SelectItem value="trailer">Trailer Analysis</SelectItem>
                    <SelectItem value="news">News Update</SelectItem>
                    <SelectItem value="gameplay">Gameplay Highlights</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-duration" className="text-right">
                  Duration (seconds)
                </Label>
                <Input
                  id="edit-duration"
                  name="duration"
                  type="number"
                  min="15"
                  max="300"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-aspectRatio" className="text-right">
                  Aspect Ratio
                </Label>
                <Select 
                  value={formData.aspectRatio} 
                  onValueChange={(value) => setFormData({...formData, aspectRatio: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select aspect ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9:16">9:16 (Vertical / Stories)</SelectItem>
                    <SelectItem value="16:9">16:9 (Landscape / YouTube)</SelectItem>
                    <SelectItem value="1:1">1:1 (Square / Instagram)</SelectItem>
                    <SelectItem value="4:5">4:5 (Portrait / Instagram)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => {
                setIsEditDialogOpen(false);
                setTemplateToEdit(null);
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

export default VideoTemplates;
