import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Building2, Compass, ShieldCheck } from "lucide-react";
import TopNav from "./component/top-nav";

export default function ApartmentPage() {
  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=2000')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30 z-10" />
        <div className="relative z-20 text-left px-8 md:px-16 w-full max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-2xl">
            Elevated City Living
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl">
            Experience luxury apartments with breathtaking skyline views, premium amenities, and unmatched convenience in the heart of the city.
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="font-semibold bg-primary hover:bg-primary/90 text-white" asChild>
              <Link to="/listings?type=apartment">Browse Apartments</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2 space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">The Pinnacle of Urban Lifestyle</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Our apartments are carefully curated to offer a seamless blend of comfort and luxury. Whether you are looking for a cozy studio or a sprawling penthouse, we have the perfect space for you.
              </p>
            </div>
            
            <ul className="space-y-6">
              {[
                { icon: Compass, title: "Prime Locations", desc: "Situated in the most sought-after neighborhoods." },
                { icon: Building2, title: "World-Class Amenities", desc: "Rooftop pools, fitness centers, and concierge services." },
                { icon: ShieldCheck, title: "24/7 Security", desc: "Advanced security systems for your peace of mind." },
              ].map((item, idx) => (
                <li key={idx} className="flex gap-4 items-start">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{item.title}</h4>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800" 
                alt="Apartment interior" 
                className="rounded-2xl h-64 w-full object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1502672260266-1c1e5240980c?auto=format&fit=crop&q=80&w=800" 
                alt="Apartment view" 
                className="rounded-2xl h-64 w-full object-cover translate-y-8"
              />
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
