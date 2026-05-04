import { Link } from "react-router";

interface CategoryCardProps {
  title: string;
  imageUrl: string;
  description: string;
  link: string;
}

export default function CategoryCard({ title, imageUrl, description, link }: CategoryCardProps) {
  return (
    <Link to={link} className="card">
      <div className="card-image" style={{ backgroundImage: `url(${imageUrl})` }} />
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
      </div>
    </Link>
  );
}
