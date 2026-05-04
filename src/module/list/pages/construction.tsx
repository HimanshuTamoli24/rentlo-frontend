import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import TopNav from "./component/top-nav";

export default function ConstructionPage() {
  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541888081622-df820af726ce?auto=format&fit=crop&q=80&w=2000')" }}
        />
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 uppercase tracking-wider">
            Building the Future
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 font-light">
            Invest in upcoming architectural marvels. Explore our ongoing construction projects and secure your place before completion.
          </p>
          <Button size="lg" className="font-semibold bg-yellow-500 hover:bg-yellow-600 text-black" asChild>
            <Link to="/contact">Invest Now</Link>
          </Button>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
          <div className="w-24 h-1 bg-yellow-500 mb-6"></div>
          <p className="text-muted-foreground max-w-2xl">
            From commercial high-rises to sprawling residential complexes, our construction projects are designed to redefine the skyline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            {
              title: "The Vertex Tower",
              status: "Phase 2 - Foundation",
              desc: "A 50-story commercial hub located in the downtown business district, expected to be completed in 2028.",
              img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1000",
            },
            {
              title: "Oasis Residences",
              status: "Phase 4 - Interior Finishing",
              desc: "Luxury eco-friendly residential complex featuring vertical gardens and solar power integration.",
              img: "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&q=80&w=1000",
            }
          ].map((project, i) => (
            <div key={i} className="flex flex-col border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={project.img} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/80 text-yellow-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {project.status}
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                <p className="text-muted-foreground mb-6">{project.desc}</p>
                <Button variant="outline" className="w-full">View Details</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
      </div>
    </>
  );
}
