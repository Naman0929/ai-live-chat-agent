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
}
