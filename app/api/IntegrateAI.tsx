import { PromptGen } from "./PromptUser";
import { useState } from "react";

interface AIResponse {
  content: string;
  status: string;
}

export const IntegrateAI = () => {
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetch("/api/ai_endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: PromptGen.text,
          temperature: PromptGen.temperature,
          maxTokens: PromptGen.maxTokens,
        }),
      });
      const data = await result.json();
      if (data.status === "error") {
        setError(data.content);
      } else {
        setResponse(data);
      }
    } catch (error) {
      setError("Failed to generate response");
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="ai-integration-container">
      <button
        onClick={generateResponse}
        disabled={loading}
        className="generate-button"
      >
        {loading ? "Generating..." : "Generate AI Response"}
      </button>
      {error && <div className="error-message">{error}</div>}
      {response && <div className="response-container">{response.content}</div>}
    </div>
  );
};
