"use server";

export async function getCompanyNews(company: string) {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    throw new Error("NEWS_API_KEY is not set");
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(company)}&sortBy=relevancy&pageSize=3&apiKey=${apiKey}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    const data = await response.json();

    if (data.status === "error") {
      throw new Error(data.message);
    }

    return data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
    }));
  } catch (error) {
    console.error("NewsAPI Error:", error);
    return [];
  }
}
