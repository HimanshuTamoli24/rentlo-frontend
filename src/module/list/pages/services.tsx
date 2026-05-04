import { Button } from "@/components/ui/button";
import { Wrench, FileText, Truck, HeadphonesIcon } from "lucide-react";
import TopNav from "./component/top-nav";

export default function ServicesPage() {
  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Comprehensive Real Estate Services</h1>
          <p className="text-xl opacity-90 mb-8">
            Beyond just buying and renting, we provide end-to-end solutions to make your real estate journey effortless.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              icon: Wrench,
              title: "Property Maintenance",
              desc: "From minor repairs to full-scale renovations, our vetted contractors ensure your property remains in top condition.",
              img: "https://images.unsplash.com/photo-1581141849291-1125c7b692b5?auto=format&fit=crop&q=80&w=800"
            },
            {
              icon: FileText,
              title: "Legal & Documentation",
              desc: "Expert legal assistance for lease agreements, property transfers, and compliance with local housing laws.",
              img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800"
            },
            {
              icon: Truck,
              title: "Relocation Assistance",
              desc: "Moving made easy. We partner with top moving companies to provide you a seamless transition to your new home.",
              img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
            },
            {
              icon: HeadphonesIcon,
              title: "24/7 Support Concierge",
              desc: "Dedicated support for all our clients. Whether it's an emergency repair or a simple query, we're always here.",
              img: "https://images.unsplash.com/photo-1556745753-b2904692b3cd?auto=format&fit=crop&q=80&w=800"
            }
          ].map((service, i) => (
            <div key={i} className="flex flex-col sm:flex-row bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="sm:w-2/5 h-48 sm:h-auto relative">
                <img src={service.img} alt={service.title} className="w-full h-full object-cover" />
              </div>
              <div className="sm:w-3/5 p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <service.icon className="text-primary" size={24} />
                  <h3 className="text-xl font-bold">{service.title}</h3>
                </div>
                <p className="text-muted-foreground mb-4">{service.desc}</p>
                <Button variant="outline" className="w-fit self-start">Learn More</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
      </div>
    </>
  );
}
