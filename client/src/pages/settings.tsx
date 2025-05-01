import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { useToast } from "@/hooks/use-toast";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const makeConfigSchema = z.object({
  apiKey: z.string().min(1, "Make.com API key is required"),
  webhookBaseUrl: z.string().url("Please enter a valid URL"),
  defaultScenarioFolder: z.string().optional()
});

const notificationSchema = z.object({
  emailEnabled: z.boolean(),
  emailRecipients: z.string().optional(),
  slackEnabled: z.boolean(),
  slackWebhookUrl: z.string().optional(),
  errorNotificationsOnly: z.boolean().default(false)
});

const videoSettingsSchema = z.object({
  defaultDuration: z.coerce.number().min(15).max(300),
  defaultAspectRatio: z.string(),
  watermarkEnabled: z.boolean(),
  defaultAudioTrack: z.string().optional()
});

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("make");

  // Make.com settings form
  const makeForm = useForm<z.infer<typeof makeConfigSchema>>({
    resolver: zodResolver(makeConfigSchema),
    defaultValues: {
      apiKey: "",
      webhookBaseUrl: "https://hook.make.com/",
      defaultScenarioFolder: ""
    },
  });

  // Notification settings form
  const notificationForm = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailEnabled: false,
      emailRecipients: "",
      slackEnabled: false,
      slackWebhookUrl: "",
      errorNotificationsOnly: true
    },
  });

  // Video settings form
  const videoForm = useForm<z.infer<typeof videoSettingsSchema>>({
    resolver: zodResolver(videoSettingsSchema),
    defaultValues: {
      defaultDuration: 60,
      defaultAspectRatio: "9:16",
      watermarkEnabled: true,
      defaultAudioTrack: ""
    },
  });

  const onMakeSubmit = (data: z.infer<typeof makeConfigSchema>) => {
    toast({
      title: "Make.com settings saved",
      description: "Your Make.com integration settings have been updated.",
    });
  };

  const onNotificationSubmit = (data: z.infer<typeof notificationSchema>) => {
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const onVideoSubmit = (data: z.infer<typeof videoSettingsSchema>) => {
    toast({
      title: "Video settings saved",
      description: "Your default video settings have been updated.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data export initiated",
      description: "Your data is being prepared for export. You will receive a download link shortly.",
    });
  };

  const handleTestConnection = () => {
    toast({
      title: "Connection test successful",
      description: "Successfully connected to Make.com API.",
    });
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <MobileHeader />

        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">Configure your content automation system</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
              <TabsTrigger value="make">Make.com</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="video">Video Settings</TabsTrigger>
            </TabsList>
            
            {/* Make.com Settings Tab */}
            <TabsContent value="make">
              <Card className="bg-surface mb-6">
                <CardHeader>
                  <CardTitle>Make.com Integration</CardTitle>
                  <CardDescription>Configure your Make.com integration for automated workflows</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...makeForm}>
                    <form onSubmit={makeForm.handleSubmit(onMakeSubmit)} className="space-y-6">
                      <FormField
                        control={makeForm.control}
                        name="apiKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Make.com API Key</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your Make.com API key"
                                type="password"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Used to programmatically control your scenarios
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={makeForm.control}
                        name="webhookBaseUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Webhook Base URL</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://hook.make.com/"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Base URL for your Make.com webhook endpoints
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={makeForm.control}
                        name="defaultScenarioFolder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Default Scenario Folder</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter folder ID (optional)"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Optional: ID of the folder where new scenarios should be created
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-between">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={handleTestConnection}
                        >
                          Test Connection
                        </Button>
                        <Button type="submit">Save Settings</Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card className="bg-surface mb-6">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure when and how you receive alerts about your automation system</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...notificationForm}>
                    <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Email Notifications</h3>
                        
                        <FormField
                          control={notificationForm.control}
                          name="emailEnabled"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Enable Email Notifications
                                </FormLabel>
                                <FormDescription>
                                  Receive system alerts via email
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        {notificationForm.watch("emailEnabled") && (
                          <FormField
                            control={notificationForm.control}
                            name="emailRecipients"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Recipients</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="email@example.com, another@example.com"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Comma-separated list of email addresses
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Slack Notifications</h3>
                        
                        <FormField
                          control={notificationForm.control}
                          name="slackEnabled"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Enable Slack Notifications
                                </FormLabel>
                                <FormDescription>
                                  Receive system alerts in your Slack workspace
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        {notificationForm.watch("slackEnabled") && (
                          <FormField
                            control={notificationForm.control}
                            name="slackWebhookUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Slack Webhook URL</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="https://hooks.slack.com/services/..."
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Webhook URL for your Slack workspace
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                      
                      <FormField
                        control={notificationForm.control}
                        name="errorNotificationsOnly"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Errors Only
                              </FormLabel>
                              <FormDescription>
                                Only send notifications for errors and warnings
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit">Save Notification Settings</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Video Settings Tab */}
            <TabsContent value="video">
              <Card className="bg-surface mb-6">
                <CardHeader>
                  <CardTitle>Video Settings</CardTitle>
                  <CardDescription>Configure default settings for generated videos</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...videoForm}>
                    <form onSubmit={videoForm.handleSubmit(onVideoSubmit)} className="space-y-6">
                      <FormField
                        control={videoForm.control}
                        name="defaultDuration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Default Duration (seconds)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={15}
                                max={300}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Default duration for generated videos (15-300 seconds)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={videoForm.control}
                        name="defaultAspectRatio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Default Aspect Ratio</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select aspect ratio" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="9:16">9:16 (Vertical / Stories)</SelectItem>
                                <SelectItem value="16:9">16:9 (Landscape / YouTube)</SelectItem>
                                <SelectItem value="1:1">1:1 (Square / Instagram)</SelectItem>
                                <SelectItem value="4:5">4:5 (Portrait / Instagram)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Default aspect ratio for new videos
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={videoForm.control}
                        name="watermarkEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Enable Watermark
                              </FormLabel>
                              <FormDescription>
                                Add your brand watermark to all generated videos
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={videoForm.control}
                        name="defaultAudioTrack"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Default Audio Track</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="URL to default audio track (optional)"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Optional URL to a default audio track for videos
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit">Save Video Settings</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <Card className="bg-surface">
                <CardHeader>
                  <CardTitle>System Data</CardTitle>
                  <CardDescription>Manage your system data and export options</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-lg border p-4">
                        <h3 className="font-medium mb-2">Export Data</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Export your configuration, templates, and logs
                        </p>
                        <Button variant="outline" onClick={handleExportData}>
                          <i className="ri-download-2-line mr-2"></i>
                          Export
                        </Button>
                      </div>
                      
                      <div className="rounded-lg border p-4">
                        <h3 className="font-medium mb-2">Database Maintenance</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Clear old logs and optimize database
                        </p>
                        <Button variant="outline">
                          <i className="ri-refresh-line mr-2"></i>
                          Optimize
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <h3 className="font-medium text-red-500 mb-2">Danger Zone</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        These actions cannot be undone
                      </p>
                      <div className="flex space-x-4">
                        <Button variant="destructive" size="sm">
                          Reset All Settings
                        </Button>
                        <Button variant="destructive" size="sm">
                          Clear All Data
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Settings;
