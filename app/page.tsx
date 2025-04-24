
import NewsBoard from "./components/news/NewsBoard";
import HomeIcons from "./HomeIcons";

export default function Home() {
  return (
    <div className="flex flex-wrap sm:flex-nowrap gap-2">
      <div className="flex-[2] min-w-[300px]">
        <NewsBoard />
      </div>

      <div className="flex-[3] min-w-[300px] m-4 mt-2 sm:m-0 sm:mr-2 sm:mt-6 text-2xl">
        <HomeIcons />
      </div>
    </div>
  );
}
