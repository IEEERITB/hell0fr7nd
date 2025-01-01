// import fsPromises from "fs/promises";
import Question from "@/models/Questions";
import { NextRequest, NextResponse } from "next/server";
// import path from 'path';

// const RESPONSES_FILE = "./src/app/api/db/questions.json";
// const RESPONSES_FILE_PATH = process.env.NODE_ENV === "development" ? path.join(process.cwd(), RESPONSES_FILE) : "/tmp/questions.json";

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const { questionId, optionIndex } = reqBody;

        // Proper validation for indexes
        if (questionId === undefined || optionIndex === undefined) {
            return NextResponse.json({ status: 400, message: "Bad Request, questionId and optionIndex are required" });
        }

        const result = await Question.updateOne({ _id: questionId }, { $inc: { [`votes.${optionIndex}`]: 1 } });

        if (result.modifiedCount === 0) {
            return NextResponse.json({ status: 404, message: "Question not found" });
        }

        return NextResponse.json({ status: 200, message: "Response submitted successfully" });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" });
    }
}
