// Shared metadata for the entire site
export const siteConfig = {
  name: "Mohammed Sadhef",
  title: "Mohammed Sadhef | Full Stack Developer | MERN Stack & Python",
  description: "Mohammed Sadhef - Full Stack Developer specializing in MERN Stack, Python, JavaScript, and AI integration. View my portfolio and projects.",
  url: "https://sadhef.info",
  ogImage: "https://sadhef.info/sadhefportfolio.webp",
  links: {
    github: "https://github.com/mohdsadhef",
    linkedin: "https://linkedin.com/in/mohdsadhef",
    twitter: "https://twitter.com/mohdsadhef"
  },
  keywords: [
    "Sadhef", 
    "Mohammed Sadhef", 
    "Full Stack Developer", 
    "MERN Stack", 
    "React", 
    "Node.js", 
    "MongoDB", 
    "Express", 
    "Python", 
    "JavaScript"
  ]
};

// Default metadata for SEO
export const defaultMetadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@mohdsadhef"
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png"
  },
  manifest: `${siteConfig.url}/site.webmanifest`
};