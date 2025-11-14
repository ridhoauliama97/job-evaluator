import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { UserDetailsForm } from "@/components/UserDetailsForm";
import { JobAlternativesForm } from "@/components/JobAlternativesForm";
import { PSIResults } from "@/components/PSIResults";
import { EvaluationHistory } from "@/components/EvaluationHistory";
import {
  UserDetails,
  JobAlternative,
  PSIResult,
  EvaluationHistory as EvaluationHistoryType,
} from "@/types/psi";
import { calculatePSI } from "@/utils/psiCalculation";
import {
  Sparkles,
  Target,
  TrendingUp,
  History as HistoryIcon,
} from "lucide-react";

type Step = "user-details" | "job-alternatives" | "results";

const Index = () => {
  const [step, setStep] = useState<Step>("user-details");
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [result, setResult] = useState<PSIResult | null>(null);
  const [history, setHistory] = useState<EvaluationHistoryType[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("psi-evaluation-history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save to history when result is generated
  const saveToHistory = (newResult: PSIResult) => {
    const historyItem: EvaluationHistoryType = {
      id: newResult.timestamp.toString(),
      userDetails: newResult.userDetails,
      timestamp: newResult.timestamp,
      topAlternative: newResult.rankedAlternatives[0].alternative.name,
      alternativesCount: newResult.alternatives.length,
    };

    const updatedHistory = [historyItem, ...history].slice(0, 10); // Keep last 10
    setHistory(updatedHistory);
    localStorage.setItem(
      "psi-evaluation-history",
      JSON.stringify(updatedHistory)
    );

    // Save full result
    localStorage.setItem(
      `psi-result-${historyItem.id}`,
      JSON.stringify(newResult)
    );
  };

  const handleUserDetailsSubmit = (details: UserDetails) => {
    setUserDetails(details);
    setStep("job-alternatives");
  };

  const handleJobAlternativesSubmit = (alternatives: JobAlternative[]) => {
    if (!userDetails) return;

    const calculation = calculatePSI(alternatives);

    const rankedAlternatives = alternatives
      .map((alt, index) => ({
        alternative: alt,
        psiValue: calculation.psiValues[index],
        rank: 0,
      }))
      .sort((a, b) => b.psiValue - a.psiValue)
      .map((item, index) => ({ ...item, rank: index + 1 }));

    const newResult: PSIResult = {
      ...calculation,
      userDetails,
      alternatives,
      rankedAlternatives,
      timestamp: Date.now(),
    };

    setResult(newResult);
    saveToHistory(newResult);
    setStep("results");
  };

  const handleReset = () => {
    setStep("user-details");
    setUserDetails(null);
    setResult(null);
  };

  const handleViewHistory = (id: string) => {
    const savedResult = localStorage.getItem(`psi-result-${id}`);
    if (savedResult) {
      setResult(JSON.parse(savedResult));
      setStep("results");
    }
  };

  const handleDeleteHistory = (id: string) => {
    const updatedHistory = history.filter((item) => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem(
      "psi-evaluation-history",
      JSON.stringify(updatedHistory)
    );
    localStorage.removeItem(`psi-result-${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Navbar />

      <main className="container mx-auto px-3 sm:px-4 pt-20 sm:pt-24 pb-8 sm:pb-12">
        {/* Hero Section */}
        {step === "user-details" && (
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12 text-center space-y-4 sm:space-y-6 animate-in fade-in duration-700">
            <div className="inline-block p-2 sm:p-3 rounded-2xl bg-primary/10 mb-2 sm:mb-4">
              <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight px-4">
              Make Smarter
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Career Decisions
              </span>
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Use the Preference Selection Index (PSI) method to evaluate and
              rank job alternatives based on multiple criteria with scientific
              precision.
            </p>

            {/* Feature Cards */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 text-left">
              <div className="p-4 sm:p-6 rounded-xl bg-card border border-border hover:shadow-medium transition-shadow">
                <Target className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2 sm:mb-3" />
                <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                  Multi-Criteria Analysis
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Evaluate 10 key criteria including salary, location, career
                  opportunities, and more
                </p>
              </div>
              <div className="p-4 sm:p-6 rounded-xl bg-card border border-border hover:shadow-medium transition-shadow">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2 sm:mb-3" />
                <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                  Scientific Method
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Based on peer-reviewed PSI methodology with 4-decimal
                  precision calculations
                </p>
              </div>
              <div className="p-4 sm:p-6 rounded-xl bg-card border border-border hover:shadow-medium transition-shadow sm:col-span-2 md:col-span-1">
                <HistoryIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2 sm:mb-3" />
                <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                  Track & Compare
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Save evaluations, view history, and export reports in PDF,
                  Excel, or CSV
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-5xl mx-auto space-y-8">
          {step === "user-details" && (
            <>
              <UserDetailsForm onSubmit={handleUserDetailsSubmit} />
              <EvaluationHistory
                history={history}
                onView={handleViewHistory}
                onDelete={handleDeleteHistory}
              />
            </>
          )}

          {step === "job-alternatives" && (
            <JobAlternativesForm
              onSubmit={handleJobAlternativesSubmit}
              onBack={() => setStep("user-details")}
            />
          )}

          {step === "results" && result && (
            <PSIResults result={result} onReset={handleReset} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 sm:mt-20">
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            PSI Decision Support System &copy; {new Date().getFullYear()} •
            Built with precision, care and ❤️ by{" "}
            <a
              href="https://next-portfolio-ridhoauliama97.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold"
            >
              Ridho Aulia Mahqoma Angkat
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
