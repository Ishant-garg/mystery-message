import { google } from "@ai-sdk/google"; // Assuming correct import path for the Google model
import { generateText } from "ai"; // Assuming correct import path for the generateText function

export async function POST(request : Request) {
  try {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
    
    // Generate text using the Google model
    const { text } = await generateText({
      model: google("models/gemini-1.5-pro-latest"), // Assuming correct model name and format
      prompt: prompt,
    });

    // Return the generated text in the response
    return new Response(JSON.stringify({ text }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error : any) {
    // Handle any errors that occur during text generation
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
