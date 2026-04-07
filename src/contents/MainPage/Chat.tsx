import axios from 'axios';
import React, { useState } from 'react'

interface SourceItem {
    source: string;
    preview: string;
}

interface ChatResult {
    question: string;
    answer: string;
    sources: SourceItem[];
}

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);


    const askAcneChat = async () => {
    if (!input.trim()) {
      alert("질문을 입력해주세요!");
      return;
    }

    // 사용자 메시지 추가
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(
        "http://192.168.0.54:9001/api/chat/ask/",
        { question: input }
      );

      const data = res.data;

      //출처 포함해서 메시지 구성
    //   const sourcesText = data.sources
    //     ?.map((s: SourceItem) => `- ${s.source}: ${s.preview}`)
    //     .join("\n");

      const botMessage = {
        role: "bot",
        text: data.answer,
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "서버 오류 발생" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">

      {/* 채팅 내용 */}
      <div className="chat-body">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role}`}>
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="chat-message bot">답변 생성 중...</div>
        )}
      </div>

      {/* 입력창 */}
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="피부 고민을 입력하세요."
          onKeyDown={(e) => {
            if (e.key === "Enter") askAcneChat();
          }}
        />

        <button onClick={askAcneChat}>
          전송
        </button>
      </div>

    </div>
  );
};

export default Chat;