import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";
import type { Scenario } from "@/models";

const ScenarioView = ({
  roleName,
  scenario,
  handleNextScenario,
  scenariosCompleted,
  totalScenarios,
}: {
  roleName: string;
  scenario: Scenario | null;
  handleNextScenario: (choiceId: string) => void;
  scenariosCompleted: number;
  totalScenarios: number;
}) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const onContinue = () => {
    if (selectedChoice) {
      handleNextScenario(selectedChoice);
      setSelectedChoice(null);
    } else {
      alert("Please select a choice to continue.");
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      {scenario && (
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="text-sm">
                {roleName}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Scenario {scenariosCompleted + 1} of {totalScenarios}
              </span>
            </div>

            <Progress value={(scenariosCompleted / totalScenarios) * 100} />
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

            <p className="text-lg font-medium">{scenario.title}</p>
          </div>

          {/* Choices */}
          <div className="space-y-4 mb-8">
            {scenario.choices.map((choice) => (
              <Card
                key={choice.id}
                className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedChoice === choice.id
                    ? "ring-2 ring-primary bg-accent"
                    : "hover:bg-accent/50"
                }`}
                onClick={() => setSelectedChoice(choice.id)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      selectedChoice === choice.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30"
                    }`}
                  >
                    {selectedChoice === choice.id && (
                      <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                    )}
                  </div>
                  <p className="text-base leading-relaxed flex-1">
                    {choice.choice_text}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Continue Button */}
          <Button
            onClick={onContinue}
            disabled={selectedChoice === null}
            size="lg"
            className="w-full"
          >
            {scenariosCompleted < totalScenarios - 1
              ? "Continue"
              : "View Your Profile"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScenarioView;
