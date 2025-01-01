"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [allQuestions, setAllQuestions] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showVotes, setShowVotes] = useState<boolean>(false); // To toggle showing votes

    async function getAllQuestions() {
        try {
            const response = await axios.get("/api/getAllQuestions");
            setAllQuestions(response.data.questions);
        } catch (error) {
            console.error("Error fetching questions:", error);
            setError("Failed to load questions. Please try again later.");
        }
    }

    useEffect(() => {
        const savedIndex = localStorage.getItem("currentIndex");
        if (savedIndex) {
            setCurrentIndex(Number(savedIndex));
        }
        getAllQuestions();
    }, []);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => {
            const nextIndex = prevIndex + 1 < allQuestions.length ? prevIndex + 1 : prevIndex;
            localStorage.setItem("currentIndex", nextIndex.toString());
            return nextIndex;
        });
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => {
            const prev = prevIndex > 0 ? prevIndex - 1 : 0;
            localStorage.setItem("currentIndex", prev.toString());
            return prev;
        });
    };

    const handleShowAnswers = () => {
        setShowVotes(!showVotes); // Toggle the display of votes
    };

    return (
        <div>
            <h1>Family Feud Questions</h1>
            {error ? (
                <p>{error}</p>
            ) : allQuestions.length > 0 ? (
                <div>
                    <h2>Question {currentIndex + 1}: {allQuestions[currentIndex]?.question}</h2>
                    <div>
                        {allQuestions[currentIndex]?.options.map((option: string, index: number) => (
                            <div
                                key={index}
                                className={`p-2 border-2 border-gray-300 rounded cursor-pointer flex justify-between items-center`}
                            >
                                <span>{option}</span>
                                {showVotes ? (
                                    <span>{allQuestions[currentIndex]?.votes[index]} votes</span>
                                ) : null}
                            </div>
                        ))}
                    </div>
                    <div>
                        <Button onClick={handlePrevious} disabled={currentIndex === 0}>Previous</Button>
                        <Button onClick={handleNext} disabled={currentIndex === allQuestions.length - 1}>Next</Button>
                        <Button onClick={handleShowAnswers}>{showVotes ? "Hide" : "Show"} answers</Button>
                    </div>
                </div>
            ) : (
                <p>Loading questions...</p>
            )}
        </div>
    );
}
