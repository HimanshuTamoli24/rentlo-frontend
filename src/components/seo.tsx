import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: object;
}

export default function SEO({
  title = "Rentlo - Modern Property Management & Rentals",
  description = "Rentlo is a state-of-the-art property platform for owners and tenants. Manage listings, track visits, and find your dream home with ease.",
  keywords = "rentals, real estate, property management, apartment hunting, landlord tools, tenant portal, home visits, Rentlo",
  image = "/images/auth.png",
  url = "https://rentlo.com",
  type = "website",
  schema,
}: SEOProps) {
  const siteTitle = title.includes("Rentlo") ? title : `${title} | Rentlo`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Himanshu Tamoli" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}

      {/* Favicon / Theming */}
      <link rel="icon" type="image/png" href="/favicon.png" />
      <meta name="theme-color" content="#2563eb" />

      {/* Semantic Tags / Canonical */}
      <link rel="canonical" href={window.location.href} />
    </Helmet>
  );
}
