import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Video, Share2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { ContentSource, VideoTemplate } from "@shared/schema";

interface ContentGeneratorProps {
  contentSources: ContentSource[];
  videoTemplates: VideoTemplate[];
  onSuccess?: () => void;
}

export function ContentGenerator({ contentSources, videoTemplates, onSuccess }: ContentGeneratorProps) {
  const [sourceId, setSourceId] = useState<string>("");
  const [templateId, setTemplateId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [generationStage, setGenerationStage] = useState<string>("");
  const { toast } = useToast();
  
  const handleGenerate = async () => {
    if (!sourceId || !templateId) {
      toast({
        title: "Missing information",
        description: "Please select both a content source and a video template.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setGenerationStage("Gathering content data...");
    
    try {
      // Step 1: Fetch data from content source
      const contentResponse = await apiRequest('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sourceId: parseInt(sourceId),
          templateId: parseInt(templateId)
        })
      } as RequestInit);
      
      if (!contentResponse.ok) {
        throw new Error("Failed to generate content");
      }
      
      const contentData = await contentResponse.json();
      
      setGenerationStage("Generating video...");
      
      // Step 2: Wait for video generation to complete
      // This would usually be a polling mechanism, but we're keeping it simple for the demo
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setGenerationStage("Preparing for social media...");
      
      // Step 3: Wait for social posts to be created
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success!
      toast({
        title: "Content generated successfully!",
        description: `Created video "${contentData.title}" with template "${videoTemplates.find(t => t.id === parseInt(templateId))?.name}".`,
        variant: "default"
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Generation failed",
        description: "There was an error generating the content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setGenerationStage("");
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generate New Content</CardTitle>
        <CardDescription>
          Create new videos from content sources using pre-defined templates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="content-source">Content Source</Label>
            <Select value={sourceId} onValueChange={setSourceId} disabled={loading}>
              <SelectTrigger id="content-source">
                <SelectValue placeholder="Select content source" />
              </SelectTrigger>
              <SelectContent>
                {contentSources.map((source) => (
                  <SelectItem key={source.id} value={source.id.toString()}>
                    {source.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="video-template">Video Template</Label>
            <Select value={templateId} onValueChange={setTemplateId} disabled={loading}>
              <SelectTrigger id="video-template">
                <SelectValue placeholder="Select video template" />
              </SelectTrigger>
              <SelectContent>
                {videoTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id.toString()}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {generationStage && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{generationStage}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerate} 
          disabled={loading || !sourceId || !templateId}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Video className="mr-2 h-4 w-4" />
              Generate Content
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}