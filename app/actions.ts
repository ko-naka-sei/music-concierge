'use server' // ← これが重要！サーバー側で動く魔法の呪文

import { GoogleGenerativeAI } from "@google/generative-ai";

// AIを呼び出す関数
export async function getMusicRecommendations(mood: string) {
  // サーバー側で安全にAPIキーを読み込む
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `
    ユーザーの気分: "${mood}"
    
    以下の条件で3曲選定し、必ず純粋なJSON配列のみ返してください。
    Markdown記法（\`\`\`jsonなど）は含めないでください。
    
    フォーマット:
    [
      {"artist": "...", "song": "...", "reason": "..."}
    ]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // JSON以外の余計な文字を削除するクリーニング処理
    text = text.replace(/```json|```/g, "").trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Error:", error);
    return []; // エラー時は空のリストを返す
  }
}