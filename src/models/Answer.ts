import { Schema, model, models } from "mongoose";

interface IAnswer {
    questionId: string;
    optionIndex: number;
    createdAt: Date;
}

const AnswerSchema = new Schema<IAnswer>(
    {
        questionId: { type: String, required: true },
        optionIndex: { type: Number, required: true },
    },
    { timestamps: true }
);

const Answer = models.Answers || model('Answers', AnswerSchema);
export default Answer;
