import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import type { Role, Decision } from "@/models";
import { scenarios } from "@/data";




const ScenarioView = ({
  role,
  onComplete,
}: {
  role: Role;
  sessionId: string;
  onComplete: (decisions: Decision[]) => void;
}) => {
  const roleScenarios = scenarios[role];
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [decisions, setDecisions] = useState<Decision[]>([]);

  const scenario = roleScenarios[currentScenario];
  const progress = ((currentScenario + 1) / roleScenarios.length) * 100;

  const handleContinue = () => {
    if (selectedChoice === null) return;

    const newDecisions = [
      ...decisions,
      { scenarioId: scenario.id, choiceIndex: selectedChoice },
    ];
    setDecisions(newDecisions);

    if (currentScenario < roleScenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedChoice(null);
    } else {
      onComplete(newDecisions);
    }
  };

  const roleColors = {
    engineer: "bg-engineer",
    "product-manager": "bg-product",
    founder: "bg-founder",
  };

  const roleNames = {
    engineer: "Engineer",
    "product-manager": "Product Manager",
    founder: "Founder",
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className="text-sm">
              {roleNames[role]}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Scenario {currentScenario + 1} of {roleScenarios.length}
            </span>
          </div>

          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${roleColors[role]} transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Scenario Content */}
        <div className="mb-12">
          <h1 className="text-4xl font-semibold mb-6 text-balance">
            {scenario.title}
          </h1>

          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-muted-foreground leading-relaxed">
              {scenario.description}
            </p>
          </div>

          <p className="text-lg font-medium">{scenario.prompt}</p>
        </div>

        {/* Choices */}
        <div className="space-y-4 mb-8">
          {scenario.choices.map((choice, index) => (
            <Card
              key={index}
              className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedChoice === index
                  ? "ring-2 ring-primary bg-accent"
                  : "hover:bg-accent/50"
              }`}
              onClick={() => setSelectedChoice(index)}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    selectedChoice === index
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {selectedChoice === index && (
                    <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                  )}
                </div>
                <p className="text-base leading-relaxed flex-1">{choice}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={selectedChoice === null}
          size="lg"
          className="w-full"
        >
          {currentScenario < roleScenarios.length - 1
            ? "Continue"
            : "View Your Profile"}
        </Button>
      </div>
    </div>
  );
}

export default ScenarioView;