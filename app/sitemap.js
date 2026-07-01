export default function sitemap() {
  const baseUrl = "https://gihonhebrewsynagogue.org";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/parshiyot`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/donate`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/calendar`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
    },
        {
      url: `${baseUrl}/leadership`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/getinvolved`,
      lastModified: new Date(),
    },
        {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
    },
  ];
}
