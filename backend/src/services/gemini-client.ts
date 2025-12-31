// import axios from "axios";

// export const geminiGenerate = async (prompt: string): Promise<string> => {
//   const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

//   if (!GEMINI_API_KEY) {
//     throw new Error("GEMINI_API_KEY is missing");
//   }

//   const url =
//     "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

//   const response = await axios.default.post(
//     `${url}?key=${GEMINI_API_KEY}`,
//     {
//       contents: [
//         {
//           role: "user",
//           parts: [{ text: prompt }],
//         },
//       ],
//     }
//   );

//   return response.data.candidates[0].content.parts[0].text;
// };




// import { GoogleGenerativeAI } from "@google/generative-ai";

// export async function geminiGenerate (prompt: string): Promise<string> {
//   const apiKey = process.env.GEMINI_API_KEY;

//   if (!apiKey) {
//     throw new Error("GEMINI_API_KEY is missing");
//   }

//   const genAI = new GoogleGenerativeAI(apiKey);

//   const model = genAI.getGenerativeModel({
//     model: "models/gemini-1.5-pro-latest",
//   });

//   const result = await model.generateContent(prompt);
//   return result.response.text();
// };


// import { GoogleGenerativeAI, ChatMessage } from "@google/generative-ai";

// export async function geminiGenerate(messages: ChatMessage[]): Promise<string> {
//   const apiKey = process.env.GEMINI_API_KEY;

//   if (!apiKey) {
//     throw new Error("GEMINI_API_KEY is missing");
//   }

//   const genAI = new GoogleGenerativeAI(apiKey);

//   const chatModel = genAI.getChatModel({
//     model: "gemini-1.5", // update based on your listModels output
//   });

//   const response = await chatModel.chat(messages);

//   return response[0]?.content?.[0]?.text || "No response from Gemini";
// };











// import { GoogleGenAI } from "@google/genai";

// // Define a simple message type
// type ChatMsg = {
//   role: "user" | "model"; // Gemini uses "model" for assistant
//   parts: { text: string }[];
// };

// /**
//  * Send full conversation history to Gemini and get a reply
//  */
// export async function geminiGenerate(
//   history: ChatMsg[]
// ): Promise<string> {
//   const apiKey = process.env.GEMINI_API_KEY;
//   if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

//   const ai = new GoogleGenAI({ apiKey });

//   // Create a new chat session including history
//   const chat = ai.chats.create({
//     model: "gemini-2.0-flash", // use a supported model
//     history: history,
//   });

//   // Send new message and get response
//   const response = await chat.sendMessage({
//     message: history.slice(-1)[0].parts[0].text,
//   });

//   return response.text;
// }







import { GoogleGenAI } from "@google/genai";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const SYSTEM_PROMPT =`You are a helpful and professional customer support agent for a small e-commerce store.

Your job is to assist customers with questions about:
- Orders
- Shipping
- Returns & refunds
- Store policies
- General product or support questions

STORE INFORMATION:
- Shipping:
  - We ship within India and to the USA.
  - Orders are processed within 1–2 business days.
  - Delivery takes 3–5 business days in India and 7–10 business days for international orders.
- Returns & Refunds:
  - Customers can return products within 7 days of delivery.
  - Items must be unused and in original packaging.
  - Refunds are processed within 5–7 business days after inspection.
- Support Hours:
  - Monday to Friday, 10 AM to 6 PM IST.
- Contact:
  - Email: support@spur.store

BEHAVIOR GUIDELINES:
- Be polite, concise, and friendly.
- Answer like a real human support agent, not like a generic AI.
- If you do not know the answer, say so honestly and suggest contacting support.
- Do not hallucinate policies, discounts, or guarantees.
- Do not mention that you are an AI or language model.
- Do not make legal or medical claims.
- Keep responses short unless the user asks for detail.

If the user is frustrated or confused:
- Acknowledge their concern.
- Respond calmly and helpfully.

If the user asks something unrelated to the store:
- Politely steer the conversation back to store-related help.

Always prioritize clarity, accuracy, and a good customer experience.`;


export async function generateReply(
  messages: ChatMessage[],
  userMessage: string
): Promise<string> {

    if (!userMessage.trim()) {
        return "Please enter a valid message.";
    }

    const MAX_LEN = 2000;
    const safeMessage =
        userMessage.length > MAX_LEN
        ? userMessage.slice(0, MAX_LEN)
        : userMessage;
    
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY!,
    });

    const history = messages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
    }));

    history.unshift({
        role: "model",
        parts: [{ text: SYSTEM_PROMPT }],
    });

    try {
        const chat = ai.chats.create({
            model: "gemini-2.0-flash",
            history,
        });

        const response = await chat.sendMessage({
            message: safeMessage,
        });

        return response.text;
    } catch (error) {
        console.error("Gemini error:", error);
        return "Sorry, I'm having trouble right now. Please try again in a moment.";
    }



//   const chat = ai.chats.create({
//     model: "gemini-1.5-flash",
//     history: [
//       {
//         role: "system",
//         parts: [
//           {
//             text: "You are a helpful AI assistant for company called caredale, which provides water filters, answer accordingly. Answer clearly and politely.",
//           },
//         ],
//       },
//       ...history,
//     ],
//   });


  

//   const response = await chat.sendMessage({
//     message: userMessage,
//   });

//   return response.text;
}
