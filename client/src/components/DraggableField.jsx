import { Rnd } from "react-rnd";

export default function DraggableField({ field, pageRect, onChange, signatureImage }) {
  const { id, type, nx, ny, nw, nh } = field;

  if (!pageRect.width || !pageRect.height) return null;

  const xPx = nx * pageRect.width;
  const yPx = ny * pageRect.height;
  const wPx = nw * pageRect.width;
  const hPx = nh * pageRect.height;

  const renderFieldContent = () => {
    switch (type) {
      case "text":
        return (
          <input
            type="text"
            placeholder="Text"
            className="w-full h-full bg-white/80 text-xs px-2 border border-gray-400 rounded"
          />
        );

      case "date":
        return (
          <input
            type="date"
            className="w-full h-full text-xs px-1 border border-gray-400 rounded"
          />
        );

      case "checkbox":
        return (
          <div className="w-full h-full flex items-center justify-center bg-white">
            <input type="checkbox" className="w-4 h-4" />
          </div>
        );

      case "radio":
        return (
          <div className="w-full h-full flex items-center justify-center bg-white">
            <input type="radio" className="w-4 h-4" />
          </div>
        );

      case "image":
        return (
          <div className="w-full h-full border border-gray-400 flex items-center justify-center bg-white">
            <span className="text-[10px] text-gray-600">Image Box</span>
          </div>
        );

      case "signature":
        return (
          <div className="w-full h-full flex items-center justify-center bg-white">
            {signatureImage ? (
              <img
                src={signatureImage}
                alt="Signature"
                className="max-w-full max-h-full object-contain select-none"
              />
            ) : (
              <span className="text-[10px] text-gray-600">Signature</span>
            )}
          </div>
        );

      default:
        return (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600">
            {type.toUpperCase()}
          </div>
        );
    }
  };

  return (
    <Rnd
      bounds="parent"
      size={{ width: wPx, height: hPx }}
      position={{ x: xPx, y: yPx }}
      enableUserSelectHack={false}
      dragHandleClassName="drag-handler"
      style={{ touchAction: "none" }} 
      onDragStop={(_e, d) =>
        onChange(id, {
          nx: d.x / pageRect.width,
          ny: d.y / pageRect.height,
        })
      }
      onResizeStop={(_e, _dir, ref, _delta, pos) =>
        onChange(id, {
          nx: pos.x / pageRect.width,
          ny: pos.y / pageRect.height,
          nw: ref.offsetWidth / pageRect.width,
          nh: ref.offsetHeight / pageRect.height,
        })
      }
    >
      <div className="drag-handler w-full h-full bg-white shadow-sm border-2 border-blue-500 rounded overflow-hidden text-gray-900">
        {renderFieldContent()}
      </div>
    </Rnd>
  );
}
