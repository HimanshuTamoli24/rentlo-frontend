import TopNav from "./top-nav";
import CategoryCard from "./CategoryCard";
import "./category.module.css";

const categories = [
  {
    title: "New house",
    description: "Explore brand‑new houses with modern amenities.",
    link: "/new-house",
    imageUrl: "https://source.unsplash.com/random/400x300?new-house",
  },
  {
    title: "Apartment",
    description: "Find apartments in prime city locations.",
    link: "/apartment",
    imageUrl: "https://source.unsplash.com/random/400x300?apartment",
  },
  {
    title: "Construction",
    description: "Browse upcoming construction projects.",
    link: "/construction",
    imageUrl: "https://source.unsplash.com/random/400x300?construction",
  },
  {
    title: "My house",
    description: "Your personal dashboard for owned properties.",
    link: "/my-house",
    imageUrl: "https://source.unsplash.com/random/400x300?house",
  },
  {
    title: "Services",
    description: "Discover services related to property management.",
    link: "/services",
    imageUrl: "https://source.unsplash.com/random/400x300?services",
  },
];

export default function CategoryPage() {
  return (
    <>
      <TopNav />
      <div className="category-page">
      <h1 className="category-title">Explore Categories</h1>
      <div className="category-grid">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.title}
            title={cat.title}
            description={cat.description}
            imageUrl={cat.imageUrl}
            link={cat.link}
          />
        ))}
      </div>
      </div>
    </>
  );
}
