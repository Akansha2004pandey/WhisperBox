import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    const promptText = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = promptText;
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
        return new Response(
            JSON.stringify({
                success: true,
                messages: result.response.text(), // Assuming `result.text` contains the generated text
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error while generating AI response:", error);
        return new Response(
            JSON.stringify({
                success: false,
                messages: "Error while generating AI response",
            }),
            { status: 500 }
        );
    }
}