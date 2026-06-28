import MapViewer from "./components/MapViewer";
import { kowakujo } from "@/lib/maps/kowakujo";

export default function Home() {
  return (
    <div className="h-dvh w-screen overflow-hidden">
      <MapViewer data={kowakujo} />
    </div>
  );
}
