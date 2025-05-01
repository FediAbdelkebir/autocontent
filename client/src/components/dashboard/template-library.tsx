interface TemplateItem {
  id: number;
  name: string;
  description: string;
  icon: string;
}

interface TemplateLibraryProps {
  templates: TemplateItem[];
  onAddTemplate?: () => void;
  onEditTemplate?: (id: number) => void;
  onMoreOptions?: (id: number) => void;
}

export const TemplateLibrary = ({
  templates = [],
  onAddTemplate,
  onEditTemplate,
  onMoreOptions
}: TemplateLibraryProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold">Video Templates</h3>
        <button 
          className="text-primary text-sm flex items-center"
          onClick={onAddTemplate}
        >
          <i className="ri-add-line mr-1"></i>
          Add Template
        </button>
      </div>
      
      <div className="space-y-3">
        {templates.length > 0 ? (
          templates.map((template) => (
            <div className="bg-background rounded-lg p-3 flex items-center" key={template.id}>
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded flex items-center justify-center mr-3">
                <i className={`${template.icon} text-primary`}></i>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{template.name}</h4>
                <p className="text-muted-foreground text-xs mt-0.5">{template.description}</p>
              </div>
              <div className="flex items-center text-muted-foreground">
                <button 
                  className="hover:text-foreground p-1" 
                  onClick={() => onEditTemplate && onEditTemplate(template.id)}
                  aria-label="Edit template"
                >
                  <i className="ri-edit-line"></i>
                </button>
                <button 
                  className="hover:text-foreground p-1 ml-1" 
                  onClick={() => onMoreOptions && onMoreOptions(template.id)}
                  aria-label="More options"
                >
                  <i className="ri-more-2-fill"></i>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 bg-background rounded-lg">
            <p className="text-muted-foreground">No templates available</p>
            <button 
              className="mt-2 text-primary hover:underline"
              onClick={onAddTemplate}
            >
              Add your first template
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
