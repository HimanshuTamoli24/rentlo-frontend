import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import TopNav from "./component/top-nav";

export default function NewHousePage() {
  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000')" }}
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Discover Your Dream Home</h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Explore our exclusive collection of newly constructed houses featuring modern amenities, sustainable designs, and prime locations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="font-semibold" asChild>
              <Link to="/listings">View Properties</Link>
            </Button>
            <Button size="lg" variant="outline" className=" border-white hover:bg-white hover:text-black font-semibold">
              Contact an Agent
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose a New Construction?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the unparalleled feeling of being the first to call it home. Our new constructions offer cutting-edge architecture and energy efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "Modern Design",
              desc: "Open floor plans, high ceilings, and contemporary finishes tailored to modern lifestyles.",
              img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800",
            },
            {
              title: "Energy Efficiency",
              desc: "State-of-the-art appliances and insulation help you save on utility bills while saving the planet.",
              img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
            },
            {
              title: "Move-In Ready",
              desc: "No renovations needed. Turn the key and step into a pristine, perfect living space.",
              img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800",
            }
          ].map((feature, i) => (
            <div key={i} className="group rounded-2xl overflow-hidden border bg-card transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="h-48 overflow-hidden">
                <img 
                  src={feature.img} 
                  alt={feature.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      </div>
    </>
  );
}
