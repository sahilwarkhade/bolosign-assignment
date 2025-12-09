import SidebarFields from "./components/SidebarFields.jsx";
import PdfEditor from "./components/PdfEditor.jsx";

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden flex-col-reverse md:flex-row w-full">
      <SidebarFields />
      <PdfEditor />
    </div>
  );
}
