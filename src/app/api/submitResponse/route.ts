import fsPromises from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from 'path';

const RESPONSES_FILE = "./src/db/questions.json";
const RESPONSES_FILE_PATH = path.join(process.cwd(), RESPONSES_FILE);

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const { questionIndex, optionIndex } = reqBody;

        // Proper validation for indexes
        if (questionIndex === undefined || optionIndex === undefined) {
            return NextResponse.json({ status: 400, message: "Bad Request, questionIndex and optionIndex are required" });
        }

        let fileRes;
        try {
            fileRes = await fsPromises.readFile(RESPONSES_FILE_PATH, "utf-8");
        } catch (readError) {
            console.error("Error reading file:", readError);
            return NextResponse.json({ status: 500, message: "Failed to read the data file." });
        }

        let prevResponses;
        try {
            prevResponses = await JSON.parse(fileRes);
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            return NextResponse.json({ status: 500, message: "Failed to parse the data file." });
        }

        // Validate question and option existence
        if (!prevResponses.questions || !prevResponses.questions[questionIndex]) {
            return NextResponse.json({ status: 404, message: "Question not found" });
        }

        if (!prevResponses.questions[questionIndex].votes || prevResponses.questions[questionIndex].votes[optionIndex] === undefined) {
            return NextResponse.json({ status: 404, message: "Option not found" });
        }

        // Increment vote
        prevResponses.questions[questionIndex].votes[optionIndex]++;

        // Write back to file
        try {
            await fsPromises.writeFile(RESPONSES_FILE_PATH, JSON.stringify(prevResponses, null, 2));
        } catch (writeError) {
            console.error("Error writing file:", writeError);
            return NextResponse.json({ status: 500, message: "Failed to update the data file." });
        }

        return NextResponse.json({ status: 200, message: "Vote recorded successfully", data: prevResponses });
    } catch (error) {
        console.error("Unexpected error:", error);
        return NextResponse.json({ status: 500, message: "Internal Server Error" });
    }
}
