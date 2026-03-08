"use client";

import { Loader } from "@/components/loader";
import { NavigationButtons } from "@/components/navigation-buttons";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

const funnyMessages = [
  "Congratulations! You've survived the feud. Your trophy is in the mail... probably.",
  "You're officially done! Now go touch some grass.",
  "Feud complete! Time to tell your mom you finished a quiz.",
  "Done! Now go outside, the sun is a big yellow ball in the sky.",
  "Victory! Or as we say in engineering, 'printf(\"Done!\")'",
  "You've completed the feud! Reward yourself with a snack.",
  "Feud finished! Your laptop thanks you for the break.",
  "Congratulations! You're now qualified to have opinions about everything.",
  "Done! Now go water your plants, they've missed you.",
  "You've finished! That's it. Go sleep."
];

function GameOver() {
  const [message] = useState(() => 
    funnyMessages[Math.floor(Math.random() * funnyMessages.length)]
  );

  return (
    <div className="animate-fade-in">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">🎉 You Completed the Feud! 🎉</h1>
        <p className="text-xl text-white/80 mb-8">{message}</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <a href="https://ieee.ritb.in" target="_blank" rel="noopener noreferrer">
            <Button className="bg-white text-black rounded-xl border-0 hover:bg-white outline-0">
              Visit ieee.ritb.in
            </Button>
          </a>
          <a href="https://www.instagram.com/ieeeritb/?hl=en" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" className="hover:bg-transparent text-white hover:text-white outline-0 border-0 focus:outline-0">
              Follow on Instagram <MoveRight />
            </Button>
          </a>
          <a href="https://www.linkedin.com/company/ieee-ritb" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" className="hover:bg-transparent text-white hover:text-white outline-0 border-0 focus:outline-0">
              Follow on LinkedIn <MoveRight />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [submittedOptions, setSubmittedOptions] = useState<Record<string, number>>({});
  const [showRulesDialog, setShowRulesDialog] = useState(false);

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

  const handleJoinFeud = () => {
    setShowRulesDialog(true);
  };

  const handleStartFeud = () => {
    setShowRulesDialog(false);
    setIsFadingOut(true);
    setTimeout(() => {
      setShowIntro(false);
    }, 300);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1 < allQuestions.length ? prevIndex + 1 : prevIndex;
      return nextIndex;
    });
  };

  const handlePrevious = () => {
    setSelectedOption(null);
    setCurrentIndex((prevIndex) => {
      const prev = prevIndex > 0 ? prevIndex - 1 : 0;
      return prev;
    });
  };

  const handleSubmit = async () => {
    if (selectedOption === null) {
      toast("Select an option first!", {
        description: "You need to pick an answer before submitting.",
        style: { background: "#ef4444", color: "#fff" },
      });
      return;
    }
    try {
      const res = await axios.post("/api/submitResponse", {
        questionId: allQuestions[currentIndex]._id,
        optionIndex: selectedOption,
      });
      if (res.status === 200) {
        console.log("Response submitted successfully");
        localStorage.setItem("currentIndex", (currentIndex + 1).toString());
        localStorage.setItem(`submitted_${allQuestions[currentIndex]._id}`, selectedOption?.toString() || "");
        setSubmittedOptions(prev => ({
          ...prev,
          [allQuestions[currentIndex]._id]: selectedOption!
        }));
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
      setShowIntro(false);
    }
    
    const savedSubmissions: Record<string, number> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("submitted_")) {
        const value = localStorage.getItem(key);
        if (value !== null && value !== "") {
          savedSubmissions[key.replace("submitted_", "")] = Number(value);
        }
      }
    }
    setSubmittedOptions(savedSubmissions);
    
    getAllQuestions();
  }, []);

  if (loading && showIntro) return (
    <>
      <h1 className="text-5xl text-center mb-6 font-bold text-white">
        Not just a <span className="line-through">club</span>
      </h1>
      <div className="flex items-center justify-center md:flex-row flex-col gap-2">
        <Button
          onClick={handleJoinFeud}
          className="bg-white text-black rounded-xl border-0 hover:bg-white outline-0"
        >
          Join the feud
        </Button>
        <a
          href="https://www.instagram.com/ieeeritb/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="ghost"
            className="hover:bg-transparent text-white hover:text-white outline-0 border-0 focus:outline-0"
          >
            Inside IEEE <MoveRight />
          </Button>
        </a>
      </div>
    </>
  );

  if (loading) return <Loader />;
  if (currentIndex >= allQuestions.length) return <GameOver />;

  return (
    <>
      {showRulesDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowRulesDialog(false)}
          />
          <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 max-w-md mx-4 text-center animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to IEEE Feud! 🎯</h2>
            <p className="text-white/80 mb-4">
              These are <span className="text-yellow-400 font-semibold">fun questions</span> - there are no right or wrong answers!
            </p>
            <p className="text-white/80 mb-4">
              Your answer will be compared with everyone else's. The answer chosen by the <span className="text-green-400 font-semibold">most people</span> wins!
            </p>
            <p className="text-white/80 mb-6">
              Later, we'll have a special round where you guess which answer will be the most popular. <span className="text-purple-400 font-semibold">Win goodies</span> based on your prediction!
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleStartFeud}
                className="bg-green-500 text-white rounded-xl border-0 hover:bg-green-600 outline-0"
              >
                Let's Go! 🚀
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {showIntro && (
        <div
          className={`transition-opacity duration-300 ${
            isFadingOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <h1 className="text-5xl text-center mb-6 font-bold text-white">
            Not just a <span className="line-through">club</span>
          </h1>
          <div className="flex items-center justify-center md:flex-row flex-col gap-2">
            <Button
              onClick={handleJoinFeud}
              className="bg-white text-black rounded-xl border-0 hover:bg-white outline-0"
            >
              Join the feud
            </Button>
            <a
              href="https://www.instagram.com/ieeeritb/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                className="hover:bg-transparent text-white hover:text-white outline-0 border-0 focus:outline-0"
              >
                Inside IEEE <MoveRight />
              </Button>
            </a>
          </div>
        </div>
      )}
      {!showIntro && (
        <div className="animate-fade-in">
          {(() => {
            const currentQuestionId = allQuestions[currentIndex]?._id;
            const submittedOption = currentQuestionId ? submittedOptions[currentQuestionId] : undefined;
            const isAlreadySubmitted = submittedOption !== undefined;

            return (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
                <div className="text-white/90 mb-8">
        <h3 className="text-md font-medium text-blue-200">IEEE Feud</h3>
                  <span className="text-sm font-medium text-blue-200">Question {currentIndex + 1} of {allQuestions.length}</span>
                  <h2 className="text-2xl font-semibold mt-2">
                    {allQuestions[currentIndex]?.question}
                  </h2>
                </div>
                {/* Answer Options */}
                <div className="space-y-3">
                  {allQuestions[currentIndex]?.options.map((option: any, index: number) => {
                    const isSelected = isAlreadySubmitted ? submittedOption === index : selectedOption === index;
                    return (
                      <button
                        key={index}
                        onClick={() => !isAlreadySubmitted && setSelectedOption(index)}
                        disabled={isAlreadySubmitted}
                        className={`w-full text-left px-6 py-4 rounded-xl bg-white/5 hover:bg-white/15 
                                 transition-all duration-200 text-white border border-white/10 
                                 hover:border-white/30 focus:outline-none focus:ring-2 
                                 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent
                                 flex justify-between gap-4
                                 ${isSelected ? "bg-green-500/30 ring-green-400/50 ring-2 ring-offset-2 ring-offset-transparent border-green-400/50" : ""}`}
                      >
                        <div>
                          <span className="inline-block w-6 h-6 rounded-full bg-white/10 text-center text-sm mr-3">
                            {String.fromCharCode(65 + index)}
                          </span>
                          {option}
                        </div>
                        {isSelected && isAlreadySubmitted && (
                          <span className="text-green-400">✓</span>
                        )}
                      </button>
                    );
                  })}
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
                  onSubmit={handleSubmit}
                  isSubmitted={isAlreadySubmitted}
                />
              </div>
            );
          })()}
        </div>
      )}
      <Toaster position="top-center" />
    </>
  );
}
