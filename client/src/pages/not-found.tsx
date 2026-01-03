import NotFoundHero from "./not-found/sections/NotFoundHero";
import NotFoundActions from "./not-found/sections/NotFoundActions";
import NotFoundHelp from "./not-found/sections/NotFoundHelp";

export default function NotFound() {
  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center"
      style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #0d9488 25%, #134e4a 50%, #9a3412 75%, #7c2d12 100%)',
      }}
    >
      <div className="relative">
        <NotFoundHero />
        <NotFoundActions />
        <NotFoundHelp />
      </div>
    </div>
  );
}
