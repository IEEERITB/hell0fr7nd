"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1 < allQuestions.length ? prevIndex + 1 : prevIndex;
      return nextIndex;
    });
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => {
      const prev = prevIndex > 0 ? prevIndex - 1 : 0;
      return prev;
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post("/api/submitResponse", {
        questionId: allQuestions[currentIndex]._id,
        optionIndex: selectedOption,
      });
      if (res.status === 200) {
        console.log("Response submitted successfully");
        localStorage.setItem("currentIndex", (currentIndex + 1).toString());
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const savedIndex = localStorage.getItem("currentIndex");
    if (savedIndex) {
      setCurrentIndex(Number(savedIndex));
    }
    getAllQuestions();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (currentIndex >= allQuestions.length) return "Questions already answered";

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
                className={`p-2 border-2 rounded cursor-pointer transition-all duration-300 ${
                  selectedOption === index
                    ? "border-blue-600 bg-blue-100" // Add background color for selected option
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedOption(index)}
              >
                {option}
              </div>
            ))}
          </div>
          <div>
            <Button onClick={handlePrevious} disabled={currentIndex === 0}>
              Previous
            </Button>
            <Button onClick={handleNext} disabled={currentIndex === allQuestions.length - 1}>
              Next
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
}
