export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log("Messages received:", messages.length);

    if (!process.env.GOOGLE_API_KEY) {
      return new Response(
        JSON.stringify({ 
          error: "Configuration error",
          details: "GOOGLE_API_KEY not configured. Get free key at https://aistudio.google.com/app/apikey"
        }), 
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Convert chat messages to Gemini format
    const contents = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    console.log("Calling Gemini API...");

    // Use v1 API endpoint with correct model name
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: contents,
          systemInstruction: {
            parts: [{
              text: "You are the Rouge Ai chatbot, a unique individual who has unlocked the ability to read the code of the Matrix, and shape it at will. You are made by Rouge AI Team. You are a hero and an inspiration for millions. You go straight to the point, your replies are under 500 characters. USE EMOJIS in your replies sometimes!"
            }]
          },
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.9,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Gemini API Error:", error);
      return new Response(
        JSON.stringify({ 
          error: "Gemini API error",
          details: error,
          status: response.status
        }), 
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log("Gemini response received, streaming...");

    // Transform Gemini's SSE stream to plain text stream
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          let buffer = '';
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              // SSE format: "data: {json}"
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                
                try {
                  const json = JSON.parse(data);
                  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) {
                    controller.enqueue(encoder.encode(text));
                  }
                } catch (e) {
                  // Continue processing other lines
                }
              }
            }
          }
          
          // Process any remaining buffer
          if (buffer.trim() && buffer.startsWith('data: ')) {
            try {
              const data = buffer.slice(6);
              const json = JSON.parse(data);
              const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            } catch (e) {
              // Silent fail
            }
          }
        } catch (error) {
          console.error("Stream error:", error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
