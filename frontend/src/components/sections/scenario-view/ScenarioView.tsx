import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
ArrowLeft,
CheckCircle2 } from "lucide-react";
import type { Role,
Scenario } from "@/models";
import ROLE_STYLES from "@/data.tsx";


const ScenarioView = ({
  role,
  scenario,
  handleNextScenario,
  scenariosCompleted,
  totalScenarios,
}: {
  role: Role;
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
    <div className="py-8 px-4">
      {scenario && (
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <a href="/" className="mb-6 inline-block text-sm text-primary">
              <ArrowLeft className="inline-block mr-2" /> Back to Home
            </a>
            <div className="flex items-center justify-between mb-4">
              <Badge
                variant="outline"
                className="text-sm text"
                style={
                  ROLE_STYLES[role.id]
                    ? {
                        borderColor: `hsl(var(${ROLE_STYLES[role.id].colorVar}))`,
                      }
                    : undefined
                }
              >
                {role.name}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Scenario {scenariosCompleted + 1} of {totalScenarios}
              </span>
            </div>

            <Progress value={(scenariosCompleted / totalScenarios) * 100} />
          </div>

          {/* Scenario Content */}
          <div className="mb-6">
            <h1 className="text-4xl font-semibold mb-6 text-balance">
              {scenario.title}
            </h1>

            <div className="max-w-none mb-8">
              <p className="text-foreground/85 text-lg md:text-xl leading-relaxed">
                {scenario.description}
              </p>
            </div>
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
                  <p className="text-lg leading-relaxed flex-1 text-foreground/90">
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
