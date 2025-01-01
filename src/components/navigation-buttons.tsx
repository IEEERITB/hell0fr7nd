import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

type NavigationButtonsProps = {
    currentQuestion: number;
    totalQuestions: number;
    onPrevious: () => void;
    onNext: () => void;
    onShow?: () => void;
    onSubmit?: () => void;
};

export function NavigationButtons({
    currentQuestion,
    totalQuestions,
    onPrevious,
    onNext,
    onShow,
    onSubmit,
}: NavigationButtonsProps) {
    const isFirstQuestion = currentQuestion === 0;
    const isLastQuestion = currentQuestion === totalQuestions - 1;

    return (
        <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
            <div className="flex gap-4">

                <button
                    onClick={onPrevious}
                    disabled={isFirstQuestion}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200
                    ${isFirstQuestion
                            ? 'opacity-50 cursor-not-allowed text-white/50'
                            : 'text-white hover:bg-white/10'}`}
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Previous
                </button>
                <button
                    onClick={onNext}
                    disabled={isLastQuestion}
                    className={`flex items-center px-4 py-2 text-white hover:bg-white/10 
                rounded-lg transition-all duration-200
                ${isLastQuestion
                            ? 'opacity-50 cursor-not-allowed text-white/50'
                            : 'text-white hover:bg-white/10'}`}
                >
                    Next
                    <ArrowRight className="w-5 h-5 ml-2" />
                </button>
            </div>
            {onShow && (
                <button
                    onClick={onShow}
                    className="flex items-center px-6 py-2 text-white rounded-lg
                    hover:bg-white/10 transition-all duration-200"
                >
                    Show Answers
                </button>
            )}
            {onSubmit && (
                <button
                    onClick={onSubmit}
                    className="flex items-center px-6 py-2 bg-green-500 text-white rounded-lg
                    hover:bg-green-600 transition-all duration-200"
                >
                    <Check className="w-5 h-5 mr-2" />
                    Submit
                </button>
            )}
        </div>
    );
}