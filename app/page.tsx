'use client'

import { useState } from 'react';
import { getMusicRecommendations } from './actions';
// ↓ 追加 1. シェア用ライブラリ
import { TwitterShareButton, TwitterIcon, LineShareButton, LineIcon } from "react-share";

type Song = {
  artist: string;
  song: string;
  reason: string;
};

export default function Home() {
  const [mood, setMood] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ↓ 追加 2. あなたのアプリのURL（Vercelで発行されたURLに書き換えてください）
  const appUrl = "https://music-concierge.vercel.app"; 

  const handleSearch = async () => {
    if (!mood) return;
    setIsLoading(true);
    const data = await getMusicRecommendations(mood);
    setSongs(data);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <main className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">
          🎵 AI Music Concierge
        </h1>

        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="今の気分は？"
            className="flex-1 p-3 rounded bg-gray-800 border border-gray-700"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-blue-600 px-6 py-3 rounded font-bold disabled:opacity-50"
          >
            {isLoading ? '...' : '検索'}
          </button>
        </div>

        {/* 結果表示エリア */}
        <div className="grid gap-4 mb-10">
          {songs.map((song, index) => (
            <div key={index} className="bg-gray-800 p-5 rounded border border-gray-700">
              <h2 className="text-xl font-bold">♪ {song.song}</h2>
              <p className="text-gray-400">{song.artist}</p>
              <p className="text-gray-300 text-sm mt-2">{song.reason}</p>
              <a
                href={`https://www.youtube.com/results?search_query=${song.artist}+${song.song}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition"
              >
                ▶ YouTubeで聴く
              </a>
            </div>
          ))}
        </div>

        {/* ↓ 追加 3. シェアボタンエリア（結果がある時だけ表示） */}
        {songs.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-xl text-center border border-gray-700">
            <p className="mb-4 text-lg font-bold">🎧 この選曲をシェアする</p>
            <div className="flex justify-center gap-6">
              
              {/* X (Twitter) ボタン */}
              <TwitterShareButton 
                url={appUrl} 
                title={`今の気分は「${mood}」\nAIにおすすめされた曲は...\n♪ ${songs[0].song}\n`}
                hashtags={["AI音楽コンシェルジュ", "個人開発"]}
              >
                <div className="flex flex-col items-center gap-2 hover:opacity-80">
                  <TwitterIcon size={48} round />
                  <span className="text-sm">Post</span>
                </div>
              </TwitterShareButton>

              {/* LINE ボタン */}
              <LineShareButton 
                url={appUrl} 
                title={`今の気分は「${mood}」\nAIにおすすめされた曲は...\n♪ ${songs[0].song}`}
              >
                <div className="flex flex-col items-center gap-2 hover:opacity-80">
                  <LineIcon size={48} round />
                  <span className="text-sm">LINE</span>
                </div>
              </LineShareButton>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}