export default function SidebarFields() {
  const fields = [
    { type: "signature", label: "Signature" },
    { type: "text", label: "Text Box" },
    { type: "date", label: "Date" },
    { type: "checkbox", label: "Checkbox" },
    { type: "radio", label: "Radio" },
    { type: "image", label: "Image" },
  ];

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData("fieldType", type);
  };

  return (
    <aside className="w-full md:w-56 flex flex-col shrink-0 h-[20vh] md:h-full border-r border-slate-200 bg-black px-4 py-6 space-y-4 text-white">
      <h2 className="text-lg font-semibold">Fields</h2>
      <div className="gap-x-4 space-y-2 flex flex-row md:flex-col flex-wrap">
        {fields.map((f) => (
          <button
            key={f.type}
            draggable
            onDragStart={(e) => handleDragStart(e, f.type)}
            className="md:w-full text-gray-900 text-center px-3 py-1 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs md:text-sm cursor-grab active:cursor-grabbing h-10"
          >
            {f.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-400">
        Drag a field and drop it onto the PDF.
      </p>
    </aside>
  );
}
