import { useState } from "react";
import { getSocialIcon, getStatusBadgeClass, truncateText } from "@/lib/utils";

interface ContentItem {
  id: number;
  title: string;
  thumbnailUrl: string;
  source: string;
  format: string;
  platforms: string[];
  status: string;
  time: string;
}

interface ContentTableProps {
  items: ContentItem[];
}

export const ContentTable = ({ items = [] }: ContentTableProps) => {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    if (!sortField) return 0;
    
    const fieldA = a[sortField as keyof ContentItem];
    const fieldB = b[sortField as keyof ContentItem];
    
    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      return sortDirection === 'asc' 
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    }
    
    return 0;
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="text-muted-foreground text-xs uppercase tracking-wider text-left">
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('title')}>
              Content {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('source')}>
              Source {sortField === 'source' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('format')}>
              Format {sortField === 'format' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-4 py-2">Platforms</th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('status')}>
              Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('time')}>
              Time {sortField === 'time' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {sortedItems.length > 0 ? (
            sortedItems.map((item, index) => (
              <tr className="border-t border-gray-700 hover:bg-background" key={index}>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded bg-background mr-3 flex-shrink-0 overflow-hidden">
                      {item.thumbnailUrl ? (
                        <img 
                          src={item.thumbnailUrl} 
                          alt={`${item.title} thumbnail`} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <i className="ri-image-line text-muted-foreground"></i>
                        </div>
                      )}
                    </div>
                    <div className="truncate max-w-[180px]" title={item.title}>
                      {truncateText(item.title, 30)}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{item.source}</td>
                <td className="px-4 py-3">{item.format}</td>
                <td className="px-4 py-3">
                  <div className="flex space-x-1">
                    {item.platforms.map((platform, idx) => (
                      <i className={getSocialIcon(platform)} key={idx}></i>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={getStatusBadgeClass(item.status)}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{item.time}</td>
              </tr>
            ))
          ) : (
            <tr className="border-t border-gray-700">
              <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                No content items found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
