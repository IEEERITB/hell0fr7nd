import { ConnectToDB } from "@/db";
import Question from "@/models/Questions";
import Answer from "@/models/Answer";
// import fsPromises from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
// import path from 'path';

// const QUESTION_FILE = "./src/app/api/db/questions.json";
// const QUESTION_FILE_PATH = process.env.NODE_ENV === "development" ? path.join(process.cwd(), QUESTION_FILE) : "/tmp/questions.json";

ConnectToDB();

export async function GET(req: NextRequest) {
    const questions = await Question.find();
    const answers = await Answer.find();

    const questionsWithVotes = questions.map((question) => {
        const questionId = String(question._id);
        const votes = new Array(question.options.length).fill(0);

        answers.forEach((answer) => {
            if (String(answer.questionId) === questionId && answer.optionIndex >= 0 && answer.optionIndex < votes.length) {
                votes[answer.optionIndex]++;
            }
        });

        const questionObj = question.toObject();
        delete questionObj.votes;
        
        return {
            ...questionObj,
            votes,
        };
    });

    return NextResponse.json({ status: 200, questions: questionsWithVotes });
}
