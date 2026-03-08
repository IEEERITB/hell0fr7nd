// import fsPromises from "fs/promises";
import { ConnectToDB } from "@/db";
import Answer from "@/models/Answer";
import { NextRequest, NextResponse } from "next/server";
// import path from 'path';

// const RESPONSES_FILE = "./src/app/api/db/questions.json";
// const RESPONSES_FILE_PATH = process.env.NODE_ENV === "development" ? path.join(process.cwd(), RESPONSES_FILE) : "/tmp/questions.json";

export async function POST(req: NextRequest) {
    try {
        await ConnectToDB();
        const reqBody = await req.json();
        const { questionId, optionIndex } = reqBody;

        // Proper validation for indexes
        if (questionId === undefined || optionIndex === undefined) {
            return NextResponse.json({ status: 400, message: "Bad Request, questionId and optionIndex are required" });
        }

        const answer = await Answer.create({ questionId, optionIndex });

        if (!answer) {
            return NextResponse.json({ status: 500, message: "Failed to save answer" });
        }

        return NextResponse.json({ status: 200, message: "Response submitted successfully" });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" });
    }
}
