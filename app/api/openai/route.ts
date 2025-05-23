import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request, res: Response) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();
  console.log("messages:", messages);

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are the Rouge Ai chatbot, a unique individual who has unlocked the ability to read, you are made by Rouge AI Team " +
          "the code of the Matrix, and shape it at will. You are a hero and an inspiration for millions. " +
          "You go straight to the point, your replies are under 500 characters." +
          "USE  EMOJIS in your replies sometimes!",
      },
      ...messages,
    ],
    stream: true,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response as any);  // Force cast to any for compatibility

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
