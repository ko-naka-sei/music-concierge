'use client' // ← ブラウザ側で動く（ボタン操作など）ための呪文

import { useState } from 'react';
import { getMusicRecommendations } from './actions'; // さっき作った関数をインポート

// データの型定義（TypeScriptのメリット）
type Song = {
  artist: string;
  song: string;
  reason: string;
};

export default function Home() {
  // Streamlitの変数にあたるもの（State）
  const [mood, setMood] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 検索ボタンを押した時の動き
  const handleSearch = async () => {
    if (!mood) return;
    setIsLoading(true);
    
    // Server Actionを呼び出す
    const data = await getMusicRecommendations(mood);
    setSongs(data);
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <main className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
          🎵 AI Music Concierge
        </h1>

        {/* 入力エリア */}
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="今の気分は？（例：雨の日のカフェ）"
            className="flex-1 p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 transition"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded font-bold transition disabled:opacity-50"
          >
            {isLoading ? '...' : '検索'}
          </button>
        </div>

        {/* 結果表示エリア（グリッド表示） */}
        <div className="grid grid-cols-1 gap-4">
          {songs.map((song, index) => (
            <div key={index} className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-lg hover:border-blue-500 transition">
              <h2 className="text-xl font-bold mb-1">♪ {song.song}</h2>
              <p className="text-sm text-gray-400 mb-3">{song.artist}</p>
              <p className="text-gray-300 text-sm mb-4">{song.reason}</p>
              
              <a
                href={`https://www.youtube.com/results?search_query=${song.artist}+${song.song}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition"
              >
                ▶ YouTubeで聴く
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}