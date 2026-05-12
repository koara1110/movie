"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { Search, Menu } from "lucide-react";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const labels = [
  "0日目",
  "5日目",
  "10日目",
  "15日目",
  "20日目",
  "25日目",
  "30日目",
];

const data = {
  labels,
  datasets: [
    {
      label: "コナン",
      data: [0, 48, 76, 92, 108, 120, 132],
      borderColor: "#ff4d6d",
      tension: 0.4,
    },
    {
      label: "マリオ",
      data: [0, 35, 54, 72, 84, 96, 108],
      borderColor: "#3b82f6",
      tension: 0.4,
    },
    {
      label: "鬼滅",
      data: [0, 24, 42, 55, 67, 74, 88],
      borderColor: "#facc15",
      tension: 0.4,
    },
    {
      label: "ONE PIECE",
      data: [0, 18, 28, 36, 44, 52, 61],
      borderColor: "#8b5cf6",
      tension: 0.4,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color: "white",
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#9ca3af",
      },
      grid: {
        color: "rgba(255,255,255,0.05)",
      },
    },
    y: {
      ticks: {
        color: "#9ca3af",
      },
      grid: {
        color: "rgba(255,255,255,0.05)",
      },
    },
  },
};



export default function Home() {const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/movie/now_playing?language=ja-JP&page=1",
          {
            headers: {
              Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNDUyZTQzYTY5NTNkYWVkMzNiNWZiYjU0YTc0M2YzNyIsIm5iZiI6MTc3ODU4NzU2NC4zMTEsInN1YiI6IjZhMDMxN2FjMGZiMDBkMjRlYzY4YjNkMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nFF-3DXF6ZDzHEYe3LQ69eDqldUowUum1OdYfPubPhQ"}`,
              accept: "application/json",
            }
          }
        );
  
        const data = await response.json();
  
        setMovies(data.results.slice(0, 6));
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchMovies();
  }, []);
  return (
    <main
    className="min-h-screen text-white"
    style={{
      background:
        "radial-gradient(circle at top, #111827 0%, #030712 55%)",
    }}
  >
      <header className="border-b border-white/5 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">
              映画興行収入比較ナビ
            </h1>
            <p className="text-sm text-gray-500">
              上映中映画の興収をグラフ比較
            </p>
          </div>

          <nav className="hidden items-center gap-8 text-sm md:flex">
            <a className="text-blue-400">ホーム</a>
            <a>ランキング</a>
            <a>公開中の映画</a>
            <a>比較する</a>
            <a>ニュース</a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 md:flex">
              <Search size={16} className="mr-2 text-gray-400" />
              <input
                placeholder="作品名を検索"
                className="bg-transparent outline-none"
              />
            </div>

            <button className="rounded-xl border border-white/10 p-3 hover:bg-white/5">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2">
        <div className="flex flex-col justify-center">
          <h2 className="mb-6 text-6xl font-bold leading-tight">
            上映中の映画の
            <br />
            興行収入を
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              グラフで比較
            </span>
          </h2>

          <p className="mb-8 text-lg leading-8 text-gray-400">
            日別の興行収入推移を見える化。
            <br />
            気になる映画の記録をリアルタイムでチェック。
          </p>

          <div className="flex gap-4">
            <button className="rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 font-semibold transition hover:scale-105">
              今すぐ比較する
            </button>

            <button className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 transition hover:bg-white/10">
              ランキングを見る
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">
                公開日からの累計興行収入推移
              </h3>
            </div>

            <div className="flex gap-2 text-sm">
              <button className="rounded-lg border border-white/10 px-3 py-2">
                7日
              </button>
              <button className="rounded-lg bg-blue-500 px-3 py-2">
                30日
              </button>
            </div>
          </div>

          <Line data={data} options={options} />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-20 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-bold">
              今週の興収ランキング
            </h3>

            <button className="text-blue-400">
              もっと見る →
            </button>
          </div>

          <div className="space-y-4">
          {movies.map((movie, index) => (
              <div
              key={movie.id}
                className="rounded-2xl border border-white/5 bg-black/20 p-4 transition hover:border-blue-400/40"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-full bg-blue-500 px-3 py-1 text-sm font-bold">
                  {index + 1}
                  </span>

                  <span className="text-sm text-gray-500">
                  公開日 {movie.release_date}
                  </span>
                </div>

                <img
  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
  alt={movie.title}
  className="mb-4 h-56 w-full rounded-2xl object-cover"
/>
               
                <h4 className="mb-2 text-xl font-bold">
                  {movie.title}
                </h4>

                <p className="text-4xl font-bold text-blue-400">
                  上映中
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h3 className="mb-6 text-2xl font-bold">
            注目の比較
          </h3>

          <div className="rounded-2xl border border-white/5 bg-black/20 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-gray-400">名探偵コナン</p>
                <h4 className="text-xl font-bold">100万ドルの五稜星</h4>
              </div>

              <span className="text-2xl font-bold text-blue-400">
                VS
              </span>

              <div className="text-right">
                <p className="text-gray-400">マリオ</p>
                <h4 className="text-xl font-bold">
                  ブラザーズムービー
                </h4>
              </div>
            </div>

            <div className="h-40 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10" />

            <button className="mt-5 w-full rounded-2xl border border-white/10 py-3 hover:bg-white/5">
              比較を見る →
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-bold">
              最新ニュース
            </h3>

            <button className="text-blue-400">
              もっと見る →
            </button>
          </div>

          <div className="space-y-4 text-gray-300">
            <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
              『名探偵コナン』累計興収60億円突破！
            </div>

            <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
              『キングダム』週末ランキング初登場1位
            </div>

            <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
              『鬼滅の刃』歴代興収記録を更新
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-24 md:grid-cols-4">
        {[
          "興収推移をグラフ化",
          "作品同士を簡単比較",
          "ランキングを即確認",
          "最新情報を高速更新",
        ].map((item) => (
          <div
            key={item}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl"
          >
            <div className="mb-5 text-5xl">◉</div>

            <h3 className="mb-3 text-xl font-bold">
              {item}
            </h3>

            <p className="text-gray-400">
              映画データをリアルタイムで可視化。
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}