import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { generateReply } from "../services/llm/gemini-client.js";

// export const generateChatCompletion = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     const { message } = req.body;
//     try {
//         const user = await User.findById(res.locals.jwtData.id);
//         if(!user) {
//             return res.status(401).json({ message: "User not registered OR Token malfucntioned" });
//         }

//         // grab chats of user
//         const chats = user.messages.map(({ role, content }) => ({ role, content })) as ChatCompletionRequestMessage[];
//         chats.push({ content: message, role: "user" });
//         user.messages.push({ content: message, role: "user" });

//         // send all chats with new one to OpenAI API
//         const config = configureOpenAI();
//         console.log("OpenAI config:", config); // Add this to debug
//         const openai = new OpenAIApi(config);

//         // get latest response
//         const chatResponse = await openai.createChatCompletion({ 
//             model: "gpt-3.5-turbo",
//             messages: chats,
//         });

//         user.messages.push(chatResponse.data.choices[0].message);
//         await user.save();

//         return res.status(200).json({ chats: user.messages });
//     } catch (error) {
//         // console.log(error);
//         // return res.status(500).json({ message: "Something went wrong" });
//         console.log("Full error object:", error);
//         console.log("Error message:", error.message);
//         console.log("Error response:", error.response?.data);
//         return res.status(500).json({ message: "Something went wrong" });
//     }
    
// };



// type ChatMsg = {
//   role: "user" | "model"; // Gemini uses "model" for assistant
//   parts: { text: string }[];
// };



type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};


export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;

  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
    }

//     // Convert chat history to Gemini prompt
//     const historyPrompt = user.messages
//       .map((m) =>
//         m.role === "user"
//           ? `User: ${m.content}`
//           : `Assistant: ${m.content}`
//       )
//       .join("\n");

//     const finalPrompt = `
// You are a helpful AI assistant.
// Continue the conversation.

// ${historyPrompt}
// User: ${message}
// Assistant:
// `;

//     user.messages.push({ 
//         role: "user",
//         content: message,
//     });

//     const reply = await geminiGenerate(finalPrompt);

//     user.messages.push({
//       role: "assistant",
//       content: reply,
//     });




    // const chatHistory: ChatMsg[] = user.messages.map((m: any) => ({
    //   role: m.role === "user" ? "user" : "model",
    //   parts: [{ text: m.content }],
    // }));

    // chatHistory.push({ role: "user", parts: [{ text: message }] });

    // const reply = await geminiGenerate(chatHistory);

    // user.messages.push({ role: "user", content: message });
    // user.messages.push({ role: "assistant", content: reply });
    // await user.save();

    // return res.status(200).json({ chats: user.messages });





    // Save user message FIRST
    user.messages.push({
      role: "user",
      content: message,
    });

    const normalizedMessages: ChatMessage[] = user.messages.map((m: any) => {
        if (m.role === "user") {
            return {
            role: "user",
            content: m.content,
            };
        }

        return {
            role: "assistant",
            content: m.content,
        };
    });

    // Call Gemini with full history
    const reply = await generateReply(
      normalizedMessages, // full DB history
      message         // latest user message
    );

    // Save Gemini reply
    user.messages.push({
      role: "assistant",
      content: reply,
    });

    await user.save();

    return res.status(200).json({ chats: user.messages });


  } catch (error: any) {
    console.error("Gemini Error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


export const sendChatsToUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //user token check
        const user = await User.findById(res.locals.jwtData.id);
        if(!user) {
            return res.status(401).send("User not registered OR Token malfucntioned");
        }
        if(user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }

        return res.status(200).json({ message: "OK", chats: user.messages });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "ERROR", cause: error.message })
    }
};



export const deleteChats = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //user token check
        const user = await User.findById(res.locals.jwtData.id);
        if(!user) {
            return res.status(401).send("User not registered OR Token malfucntioned");
        }
        if(user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions didn't match");
        }

        //@ts-ignore
        user.messages = [];
        await user.save();
        return res.status(200).json({ message: "OK"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "ERROR", cause: error.message })
    }
};