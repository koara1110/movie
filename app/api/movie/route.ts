export async function GET() {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/now_playing?language=ja-JP&page=1",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          accept: "application/json",
        },
      }
    );
  
    const data = await response.json();
    return Response.json(data);
  }