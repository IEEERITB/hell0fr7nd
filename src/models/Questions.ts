import { Schema, model, models } from "mongoose";

interface IQuestion {
    question: string;
    options: string[];
    votes: number[];
}

const QuestionSchema = new Schema<IQuestion>(
    {
        question: { type: String, required: true },
        options: { type: [String], required: true },
        votes: { type: [Number], required: true },
    },
);

const Question = models.Questions || model('Questions', QuestionSchema);
export default Question;