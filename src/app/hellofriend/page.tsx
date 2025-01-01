"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { Brain } from "lucide-react";
import { config } from "@/config";
import { NavigationButtons } from "@/components/navigation-buttons";
import { Loader } from "@/components/loader";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [allQuestions, setAllQuestions] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showVotes, setShowVotes] = useState<boolean>(false); // To toggle showing votes

    async function getAllQuestions() {
        setLoading(true);
        try {
            const response = await axios.get("/api/getAllQuestions");
            setAllQuestions(response.data.questions);
        } catch (error) {
            console.error("Error fetching questions:", error);
            setError("Failed to load questions. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllQuestions();
    }, []);

    const handleNext = () => {
        setShowVotes(false); // Hide votes when moving to the next question
        setCurrentIndex((prevIndex) => {
            const nextIndex = prevIndex + 1 < allQuestions.length ? prevIndex + 1 : prevIndex;
            return nextIndex;
        });
    };

    const handlePrevious = () => {
        setShowVotes(false); // Hide votes when moving to the previous question
        setCurrentIndex((prevIndex) => {
            const prev = prevIndex > 0 ? prevIndex - 1 : 0;
            return prev;
        });
    };

    const handleShowAnswers = () => {
        setShowVotes(!showVotes); // Toggle the display of votes
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-center mb-12">
                        <Brain className="w-10 h-10 text-white opacity-90 mr-3" />
                        <h1 className="text-4xl font-bold text-white tracking-tight">{config.name}</h1>
                    </div>

                    {/* Quiz Card */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
                        <div className="text-white/90 mb-8">
                            <span className="text-sm font-medium text-blue-200">Question {currentIndex + 1} of {allQuestions.length}</span>
                            <h2 className="text-2xl font-semibold mt-2">
                                {allQuestions[currentIndex]?.question}
                            </h2>
                        </div>

                        {/* Answer Options */}
                        <div className="space-y-3">
                            {allQuestions[currentIndex]?.options.map((option: any, index: number) => (
                                <button
                                    key={index}
                                    className="w-full text-left px-6 py-4 rounded-xl bg-white/5 hover:bg-white/15 
                           transition-all duration-200 text-white border border-white/10 
                           hover:border-white/30 focus:outline-none focus:ring-2 
                           focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent
                           flex justify-between gap-4"
                                >
                                    <div>
                                        <span className="inline-block w-6 h-6 rounded-full bg-white/10 text-center text-sm mr-3">
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                        {option}
                                    </div>
                                    {showVotes ? (
                                        <span>{allQuestions[currentIndex]?.votes[index]} votes</span>
                                    ) : null}
                                </button>
                            ))}
                        </div>
                        {/* Progress Bar */}
                        <div className="mt-8 mb-6">
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-400/80 rounded-full transition-all duration-300"
                                    style={{ width: `${((currentIndex + 1) / allQuestions.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <NavigationButtons
                            currentQuestion={currentIndex}
                            totalQuestions={allQuestions.length}
                            onPrevious={handlePrevious}
                            onNext={handleNext}
                            onShow={handleShowAnswers}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
