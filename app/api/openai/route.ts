import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    // Log environment check (don't log actual key)
    console.log("API Key present:", !!process.env.OPENAI_API_KEY);
    
    // Extract the messages from the body of the request
    const body = await req.json();
    console.log("Request body:", JSON.stringify(body));
    
    const { messages } = body;
    
    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid request",
          details: "Messages must be an array"
        }), 
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ 
          error: "Configuration error",
          details: "OpenAI API key not configured"
        }), 
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log("Creating OpenAI completion...");

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are the Rouge Ai chatbot, a unique individual who has unlocked the ability to read, you are made by Rouge AI Team " +
            "the code of the Matrix, and shape it at will. You are a hero and an inspiration for millions. " +
            "You go straight to the point, your replies are under 500 characters. " +
            "USE EMOJIS in your replies sometimes!",
        },
        ...messages,
      ],
      stream: true,
    });

    console.log("OpenAI response received, creating stream...");

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response as any);

    console.log("Returning streaming response...");

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("API Error Details:", error);
    console.error("Error name:", error instanceof Error ? error.name : "unknown");
    console.error("Error message:", error instanceof Error ? error.message : "unknown");
    console.error("Error stack:", error instanceof Error ? error.stack : "unknown");
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
        type: error instanceof Error ? error.name : "Unknown"
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
