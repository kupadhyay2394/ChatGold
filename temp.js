// const axios = require("axios");

// async function getGoldArticles() {
//   try {
//     const res = await axios.post("https://eventregistry.org/api/v1/article/getArticles", {
//       query: {
//         $query: {
//           keyword: "gold investment",
//           keywordLoc: "title,body" // ✅ search in title & body
//         },
//         $filter: {
//           forceMaxDataTimeWindow: "31" // ✅ restrict to 31 days
//         }
//       },
//       resultType: "articles",
//       articlesSortBy: "date",
//       articlesCount: 3,
//       includeArticleBody: true,    // ✅ get full text
//       includeArticleSummary: true, // ✅ get summary if body not available
//       apiKey: "b78b78f8-3d32-4ab1-a400-3c2b6f1e37a5"
//     });

//     return res;

//     // if (res.data && res.data.articles && res.data.articles.results) {
//     //   res.data.articles.results.forEach((article, index) => {
//     //     console.log(`\n${index + 1}. ${article.title}`);
//     //     console.log(`   Source: ${article.source.title}`);
//     //     console.log(`   URL: ${article.url}`);
//     //     console.log(`   Summary: ${article.body || article.summary || "No content available."}\n`);
//     //   });
//     // } else {
//     //   console.log("No gold investment articles found.");
//     // }
//   } catch (err) {
//     console.error("Error fetching articles:", err.response?.data || err.message);
//   }
// }

