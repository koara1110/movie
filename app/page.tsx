"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";

import { Line } from "react-chartjs-2";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Crown,
  ExternalLink,
  LineChart,
  Share2,
  Menu,
  Scale,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

type ChartPeriod = "7" | "30" | "all";

type TMDBMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
};

const HERO_DATASETS = [
  {
    label: "コナン",
    base: [0, 48, 76, 92, 108, 120, 132],
    borderColor: "#ff4d6d",
  },
  {
    label: "マリオ",
    base: [0, 35, 54, 72, 84, 96, 108],
    borderColor: "#3b82f6",
  },
  {
    label: "鬼滅",
    base: [0, 24, 42, 55, 67, 74, 88],
    borderColor: "#facc15",
  },
  {
    label: "ONE PIECE",
    base: [0, 18, 28, 36, 44, 52, 61],
    borderColor: "#8b5cf6",
  },
];

const PERIOD_LABELS: Record<ChartPeriod, string[]> = {
  "7": ["月", "火", "水", "木", "金", "土", "日"],
  "30": ["0日目", "5日目", "10日目", "15日目", "20日目", "25日目", "30日目"],
  all: ["1週", "2週", "3週", "4週", "2か月", "3か月", "累計"],
};

function scaleSeries(values: number[], factor: number): number[] {
  return values.map((v) => Math.round(v * factor));
}

const MOCK_RANK_STATS = [
  { weekly: 8.2, cumulative: 34.2 },
  { weekly: 6.1, cumulative: 28.7 },
  { weekly: 5.4, cumulative: 21.4 },
  { weekly: 4.2, cumulative: 18.1 },
  { weekly: 3.8, cumulative: 14.6 },
];

const NEWS_ITEMS = [
  {
    date: "2024.05.10",
    title: "『名探偵コナン』累計興収60億円突破！",
    thumbClass: "from-rose-500/40 to-violet-600/30",
  },
  {
    date: "2024.05.08",
    title: "『キングダム』週末ランキング初登場1位",
    thumbClass: "from-amber-500/35 to-stone-700/40",
  },
  {
    date: "2024.05.05",
    title: "『鬼滅の刃』歴代興収記録を更新",
    thumbClass: "from-teal-500/35 to-cyan-700/35",
  },
];

const FEATURES: {
  title: string;
  body: string;
  icon: LucideIcon;
}[] = [
  {
    title: "興収推移をグラフ化",
    body: "累計・週末の動きを折れ線で把握。期間切替で長期トレンドも一望できます。",
    icon: LineChart,
  },
  {
    title: "作品同士を簡単比較",
    body: "気になる2作品を並べて推移を重ね表示。ヒットの伸び方をすぐに比べられます。",
    icon: Scale,
  },
  {
    title: "ランキングを即確認",
    body: "今週の席順と累計を一覧表示。公開日とあわせて興行の位置づけを把握。",
    icon: Crown,
  },
  {
    title: "最新情報を高速更新",
    body: "上映作品の動向をまとめてチェック。ニュースとあわせてマーケの空気感を掴めます。",
    icon: Bell,
  },
];

function buildHeroChartData(period: ChartPeriod) {
  const labels = PERIOD_LABELS[period];
  let factor = 1;
  if (period === "7") factor = 0.22;
  if (period === "all") factor = 1.12;

  return {
    labels,
    datasets: HERO_DATASETS.map((d) => ({
      label: d.label,
      data: scaleSeries(d.base, factor),
      borderColor: d.borderColor,
      backgroundColor: d.borderColor,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
    })),
  };
}

function heroChartOptions(): ChartOptions<"line"> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        position: "right",
        align: "center",
        labels: {
          color: "#e5e7eb",
          usePointStyle: true,
          pointStyle: "circle",
          padding: 14,
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.94)",
        titleColor: "#f9fafb",
        bodyColor: "#e5e7eb",
        borderColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        padding: 10,
        displayColors: true,
      },
    },
    scales: {
      x: {
        ticks: { color: "#9ca3af", maxRotation: 0 },
        grid: { color: "rgba(255,255,255,0.04)" },
        border: { display: false },
      },
      y: {
        ticks: { color: "#9ca3af" },
        grid: { color: "rgba(255,255,255,0.06)" },
        border: { display: false },
      },
    },
  };
}

const compareMiniData = (
  leftTitle: string,
  rightTitle: string
): ChartData<"line"> => ({
  labels: ["1週", "2週", "3週", "4週"],
  datasets: [
    {
      label: leftTitle,
      data: [14, 32, 48, 58],
      borderColor: "#ff4d6d",
      backgroundColor: "#ff4d6d",
      tension: 0.35,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 3,
    },
    {
      label: rightTitle,
      data: [11, 26, 40, 52],
      borderColor: "#3b82f6",
      backgroundColor: "#3b82f6",
      tension: 0.35,
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 3,
    },
  ],
});

const compareMiniOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "#d1d5db",
        usePointStyle: true,
        pointStyle: "circle",
        boxWidth: 8,
        padding: 12,
        font: { size: 11 },
      },
    },
    tooltip: {
      backgroundColor: "rgba(15, 23, 42, 0.94)",
      titleColor: "#f9fafb",
      bodyColor: "#e5e7eb",
      borderColor: "rgba(255,255,255,0.08)",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      ticks: { color: "#9ca3af", font: { size: 10 } },
      grid: { display: false },
      border: { display: false },
    },
    y: {
      ticks: { color: "#9ca3af", font: { size: 10 } },
      grid: { color: "rgba(255,255,255,0.05)" },
      border: { display: false },
    },
  },
};

export default function Home() {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("30");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("/api/movie");
        if (!response.ok) throw new Error("fetch failed");
        const json: { results?: TMDBMovie[] } = await response.json();
        setMovies((json.results ?? []).slice(0, 5));
        setLoadError(false);
      } catch {
        setLoadError(true);
        setMovies([]);
      }
    };

    fetchMovies();
  }, []);

  const heroData = useMemo(
    () => buildHeroChartData(chartPeriod),
    [chartPeriod]
  );
  const heroOptions = useMemo(() => heroChartOptions(), []);

  const leftMovie = movies[0];
  const rightMovie = movies[1];
  const compareLeftTitle = leftMovie?.title ?? "作品 A";
  const compareRightTitle = rightMovie?.title ?? "作品 B";
  const miniChartData = useMemo(
    () => compareMiniData(compareLeftTitle, compareRightTitle),
    [compareLeftTitle, compareRightTitle]
  );

  const periodTabs: { id: ChartPeriod; label: string }[] = [
    { id: "7", label: "7日" },
    { id: "30", label: "30日" },
    { id: "all", label: "すべて" },
  ];

  return (
    <main
      className="min-h-screen text-white"
      style={{
        background:
          "radial-gradient(ellipse 120% 80% at 50% -20%, #1e3a5f 0%, #0f172a 35%, #030712 70%)",
      }}
    >
      <header className="sticky top-0 z-20 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/25 to-violet-600/25 ring-1 ring-white/10">
              <LineChart className="h-5 w-5 text-sky-400" aria-hidden />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">
                映画興行収入比較ナビ
              </h1>
              <p className="hidden text-xs text-gray-500 sm:block">
                上映中映画の興収をグラフ比較
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-1 text-sm text-gray-400 md:flex">
            {[
              ["ホーム", true],
              ["ランキング", false],
              ["公開中の映画", false],
              ["比較する", false],
              ["ニュース", false],
            ].map(([label, active]) => (
              <a
                key={String(label)}
                href="#"
                className={`relative px-3 py-2 transition hover:text-white ${
                  active ? "text-white" : ""
                }`}
              >
                {label}
                {active ? (
                  <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-sky-500" />
                ) : null}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <div className="hidden items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 md:flex">
              <Search size={16} className="mr-2 text-gray-500" aria-hidden />
              <input
                type="search"
                placeholder="作品名を検索"
                className="w-40 bg-transparent text-sm text-white outline-none placeholder:text-gray-500 lg:w-52"
              />
            </div>
            <button
              type="button"
              className="rounded-xl border border-white/10 p-2.5 text-gray-300 transition hover:bg-white/5 hover:text-white"
              aria-label="メニュー"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-2 lg:items-center lg:gap-10 lg:py-20">
        <div className="flex max-w-xl flex-col justify-center">
          <h2 className="mb-5 text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
            上映中映画の
            <br />
            興行収入を
            <br />
            <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
              グラフで比較
            </span>
          </h2>
          <p className="mb-8 text-base leading-relaxed text-gray-400 sm:text-lg">
            日別の興行収入推移を可視化。
            <br className="hidden sm:block" />
            気になる映画の記録をリアルタイムでチェック。
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 px-7 py-3.5 text-sm font-semibold shadow-lg shadow-blue-900/30 transition hover:brightness-110 sm:px-8 sm:py-4 sm:text-base"
            >
              今すぐ比較する
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-gray-100 transition hover:bg-white/10 sm:px-8 sm:py-4 sm:text-base"
            >
              <BarChart3 className="h-4 w-4 text-sky-400 sm:h-5 sm:w-5" aria-hidden />
              ランキングを見る
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-start sm:justify-between">
            <h3 className="text-lg font-bold sm:text-xl">
              公開日からの累計興行収入推移
            </h3>
            <div className="flex shrink-0 gap-1 rounded-lg bg-black/30 p-1 ring-1 ring-white/10">
              {periodTabs.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setChartPeriod(id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
                    chartPeriod === id
                      ? "bg-sky-600 text-white shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[280px] w-full sm:h-[320px] lg:h-[340px]">
            <Line data={heroData} options={heroOptions} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-16 lg:grid-cols-3">
        <div className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between gap-2">
            <h3 className="text-xl font-bold">今週の興収ランキング</h3>
            <button
              type="button"
              className="shrink-0 text-sm font-medium text-sky-400 transition hover:text-sky-300"
            >
              もっと見る →
            </button>
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-3">
            {loadError ? (
              <p className="rounded-2xl border border-white/5 bg-black/25 p-4 text-sm text-gray-400">
                ランキングを読み込めませんでした。APIキーとネットワークを確認してください。
              </p>
            ) : movies.length === 0 ? (
              <p className="animate-pulse rounded-2xl border border-white/5 bg-black/20 p-4 text-sm text-gray-500">
                読み込み中…
              </p>
            ) : (
              movies.map((movie, index) => {
                const stats = MOCK_RANK_STATS[index] ?? MOCK_RANK_STATS[4];
                const poster = movie.poster_path
                  ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                  : null;
                return (
                  <div
                    key={movie.id}
                    className="flex gap-3 rounded-2xl border border-white/5 bg-black/25 p-3 transition hover:border-sky-500/30"
                  >
                    <span className="flex w-8 shrink-0 items-start justify-center pt-1 text-lg font-bold text-sky-400">
                      {index + 1}
                    </span>
                    {poster ? (
                      <img
                        src={poster}
                        alt=""
                        className="h-20 w-14 shrink-0 rounded-lg object-cover ring-1 ring-white/10"
                      />
                    ) : (
                      <div className="h-20 w-14 shrink-0 rounded-lg bg-white/10 ring-1 ring-white/10" />
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="line-clamp-2 font-semibold leading-snug text-white">
                        {movie.title}
                      </h4>
                      <p className="mt-0.5 text-xs text-gray-500">
                        公開 {movie.release_date || "—"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <span className="text-gray-400">
                          週末{" "}
                          <span className="font-semibold text-white">
                            {stats.weekly.toFixed(1)}億円
                          </span>
                        </span>
                        <span className="text-gray-400">
                          累計{" "}
                          <span className="font-semibold text-sky-400">
                            {stats.cumulative.toFixed(1)}億円
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
          <h3 className="mb-5 text-xl font-bold">注目の比較</h3>
          <div className="rounded-2xl border border-white/5 bg-black/25 p-4">
            <div className="mb-4 flex items-stretch justify-between gap-2">
              <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
                {leftMovie?.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${leftMovie.poster_path}`}
                    alt=""
                    className="aspect-[2/3] w-full max-w-[100px] rounded-lg object-cover ring-1 ring-white/10"
                  />
                ) : (
                  <div className="aspect-[2/3] w-full max-w-[100px] rounded-lg bg-gradient-to-br from-rose-500/20 to-slate-800 ring-1 ring-white/10" />
                )}
                <p className="w-full truncate text-center text-xs text-gray-500">
                  {compareLeftTitle}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-center justify-center px-1">
                <span className="rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 px-2.5 py-1 text-xs font-bold text-white shadow-lg shadow-blue-900/40">
                  VS
                </span>
              </div>
              <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
                {rightMovie?.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${rightMovie.poster_path}`}
                    alt=""
                    className="aspect-[2/3] w-full max-w-[100px] rounded-lg object-cover ring-1 ring-white/10"
                  />
                ) : (
                  <div className="aspect-[2/3] w-full max-w-[100px] rounded-lg bg-gradient-to-br from-blue-500/20 to-slate-800 ring-1 ring-white/10" />
                )}
                <p className="w-full truncate text-center text-xs text-gray-500">
                  {compareRightTitle}
                </p>
              </div>
            </div>
            <div className="h-[140px] w-full">
              <Line data={miniChartData} options={compareMiniOptions} />
            </div>
            <button
              type="button"
              className="mt-3 w-full rounded-2xl border border-white/10 py-2.5 text-sm font-medium text-gray-200 transition hover:bg-white/5"
            >
              比較を見る →
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between gap-2">
            <h3 className="text-xl font-bold">最新ニュース</h3>
            <button
              type="button"
              className="shrink-0 text-sm font-medium text-sky-400 transition hover:text-sky-300"
            >
              もっと見る →
            </button>
          </div>
          <div className="space-y-3">
            {NEWS_ITEMS.map((item) => (
              <a
                key={item.title}
                href="#"
                className="flex gap-3 rounded-2xl border border-white/5 bg-black/25 p-3 transition hover:border-white/15"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">{item.date}</p>
                  <p className="mt-1 line-clamp-2 text-sm font-medium leading-snug text-gray-100">
                    {item.title}
                  </p>
                </div>
                <div
                  className={`h-16 w-24 shrink-0 rounded-lg bg-gradient-to-br ${item.thumbClass} ring-1 ring-white/10`}
                  aria-hidden
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 pb-12 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
        {FEATURES.map(({ title, body, icon: Icon }) => (
          <div
            key={title}
            className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-center backdrop-blur-xl md:text-left"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-500/20 to-violet-600/20 ring-1 ring-white/10 md:mx-0">
              <Icon className="h-6 w-6 text-sky-400" strokeWidth={1.75} aria-hidden />
            </div>
            <h3 className="mb-2 text-lg font-bold">{title}</h3>
            <p className="text-sm leading-relaxed text-gray-400">{body}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-white/5 bg-black/30">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-white">映画興行収入比較ナビ</p>
            <p className="mt-1 text-xs text-gray-500">
              © {new Date().getFullYear()} Box Office Navi. All rights reserved.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
            <a href="#" className="hover:text-white">
              このサイトについて
            </a>
            <a href="#" className="hover:text-white">
              使い方
            </a>
            <a href="#" className="hover:text-white">
              お問い合わせ
            </a>
            <a href="#" className="hover:text-white">
              プライバシーポリシー
            </a>
          </nav>
          <div className="flex gap-3">
            <a
              href="#"
              className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
              aria-label="共有"
            >
              <Share2 className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="rounded-lg border border-white/10 p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
              aria-label="外部リンク"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
