import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(date: Date | string | null | undefined): string {
  if (!date) return "Unknown time";
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch {
    return "Invalid date";
  }
}

export function getStatusBadgeClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'success':
    case 'active':
    case 'ready':
    case 'published':
    case 'completed':
    case 'posted':
      return 'status-badge-success';
    case 'warning':
    case 'pending':
    case 'processing':
      return 'status-badge-warning';
    case 'error':
    case 'failed':
    case 'rate limited':
      return 'status-badge-error';
    default:
      return 'bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getSocialIcon(platform: string): string {
  const platformLower = platform.toLowerCase();
  
  if (platformLower.includes('youtube')) return 'ri-youtube-line text-[#FF0000]';
  if (platformLower.includes('instagram')) return 'ri-instagram-line text-[#E1306C]';
  if (platformLower.includes('tiktok')) return 'ri-tiktok-line';
  if (platformLower.includes('twitter') || platformLower.includes('x')) return 'ri-twitter-x-line';
  
  return 'ri-share-line';
}

export function getActivityIconClass(status: string): string {
  switch (status.toLowerCase()) {
    case 'success':
      return 'border-l-2 border-secondary pl-3 pb-4';
    case 'warning':
      return 'border-l-2 border-[#FFD740] pl-3 pb-4';
    case 'error':
      return 'border-l-2 border-destructive pl-3 pb-4';
    default:
      return 'border-l-2 border-muted-foreground pl-3 pb-4';
  }
}
