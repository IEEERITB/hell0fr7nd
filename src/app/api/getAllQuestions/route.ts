import fsPromises from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from 'path';

const QUESTION_FILE = "./src/db/questions.json";
const QUESTION_FILE_PATH = path.join(process.cwd(), QUESTION_FILE);

export async function GET(req: NextRequest) {
    const fileRes = await fsPromises.readFile(QUESTION_FILE_PATH, "utf-8");
    if (!fileRes) return NextResponse.json({ status: 500, message: "Internal Server Error" });
    const allQuestions = JSON.parse(fileRes);

    return NextResponse.json({ status: 200, questions: allQuestions.questions });
}
