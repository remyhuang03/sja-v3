import ModernNewsBoard from "./components/news/ModernNewsBoard";
import HomeIcons from "./components/HomeIcons";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* News Board */}
        <div className="lg:col-span-1">
          <ModernNewsBoard />
        </div>

        {/* Tool Icons */}
        <div className="lg:col-span-2">
          <HomeIcons />
        </div>
      </div>
    </div>
  );
}
