import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Home, LineChart, Key } from "lucide-react";
import TopNav from "./component/top-nav";

export default function MyHousePage() {
  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2000')" }}
        />
        <div className="absolute inset-0 bg-primary/80 mix-blend-multiply z-10" />
        <div className="relative z-20 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Manage Your Property</h1>
          <p className="text-lg text-white/90 mb-8">
            Access powerful tools to track your home's value, manage tenants, and optimize your real estate investments all in one place.
          </p>
          <Button size="lg" variant="secondary" className="font-semibold" asChild>
            <Link to="/auth">Sign In to Dashboard</Link>
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Homeowner Services</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need to maximize the potential of your property.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            {
              icon: LineChart,
              title: "Valuation Tracking",
              desc: "Get real-time updates on your property's market value based on local trends."
            },
            {
              icon: Key,
              title: "Tenant Management",
              desc: "Seamlessly handle lease agreements, background checks, and rent collection."
            },
            {
              icon: Home,
              title: "Maintenance Hub",
              desc: "Request and track repair services from our network of trusted professionals."
            }
          ].map((service, i) => (
            <div key={i} className="p-8 border rounded-2xl bg-card hover:border-primary transition-colors">
              <div className="mx-auto w-16 h-16 flex items-center justify-center bg-primary/10 text-primary rounded-full mb-6">
                <service.icon size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>
      </div>
    </>
  );
}
