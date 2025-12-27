import {capitalize} from "lodash";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Sparkles, Target, TrendingUp } from "lucide-react";
import type { ArchetypeMatch } from "@/models";

interface ProfileViewProps {
  profile: ArchetypeMatch;
  onStartReflection: () => void;
  onRestart: () => void;
}

export default function ProfileView({
  profile,
  onStartReflection,
  onRestart,
}: ProfileViewProps) {
  const { archetype, matched_traits, missing_traits, coverage } = profile;

  const roleColors: Record<string, string> = {
    engineer: "border-blue-500",
    "product_manager": "border-purple-500",
    founder: "border-amber-500",
  };

  const roleBgColors: Record<string, string> = {
    engineer: "bg-blue-500/10 text-blue-600",
    "product_manager": "bg-purple-500/10 text-purple-600",
    founder: "bg-amber-500/10 text-amber-600",
  };
  console.log(archetype);
  

  const roleColor = roleColors[archetype.role.name] || "border-primary";
  const roleBgColor =
    roleBgColors[archetype.role.name] || "bg-primary/10 text-primary";

  const coveragePercentage = Math.round(coverage * 100);

  const formatTrait = (trait: string) => {
    return trait
      .split("_")
      .map((word) => capitalize(word))
      .join(" ");
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className={`mb-4 ${roleBgColor}`}>
            {archetype.role.name}
          </Badge>
          <h1 className="text-5xl font-semibold mb-4 text-balance">
            {archetype.name}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your decisions reveal a distinct approach to challenges in a startup
            environment.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Match Score</span>
            </div>
            <p className="text-4xl font-bold">
              {matched_traits.length}
              <span className="text-lg text-muted-foreground font-normal">
                /{archetype.key_traits.length}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">traits matched</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Trait Coverage
              </span>
            </div>
            <p className="text-4xl font-bold">{coveragePercentage}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              of archetype traits
            </p>
          </Card>
        </div>

        <Card className={`p-8 mb-8 border-l-4 ${roleColor}`}>
          <div className="flex gap-3 items-start">
            <Sparkles className="w-6 h-6 text-primary shrink-0 mt-1" />
            <p className="text-lg leading-relaxed">{archetype.message}</p>
          </div>
        </Card>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Check className="w-6 h-6 text-green-500" />
            Traits You Demonstrated
          </h2>
          <Card className="p-6">
            <div className="flex flex-wrap gap-2">
              {matched_traits.map((trait) => (
                <Badge
                  key={trait}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm bg-green-500/10 text-green-700 border-green-200"
                >
                  {formatTrait(trait)}
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        {missing_traits.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <X className="w-6 h-6 text-muted-foreground" />
              Traits to Explore
            </h2>
            <Card className="p-6">
              <p className="text-muted-foreground mb-4">
                These traits are associated with this archetype but weren't
                strongly reflected in your choices:
              </p>
              <div className="flex flex-wrap gap-2">
                {missing_traits.map((trait) => (
                  <Badge
                    key={trait}
                    variant="outline"
                    className="px-3 py-1.5 text-sm text-muted-foreground"
                  >
                    {formatTrait(trait)}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        )}

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Key Traits of {archetype.name}
          </h2>
          <Card className="p-6">
            <div className="flex flex-wrap gap-2">
              {archetype.key_traits.map((trait) => {
                const isMatched = matched_traits.includes(trait);
                return (
                  <Badge
                    key={trait}
                    variant={isMatched ? "default" : "outline"}
                    className={`px-3 py-1.5 text-sm ${
                      isMatched
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formatTrait(trait)}
                    {isMatched && <Check className="w-3 h-3 ml-1" />}
                  </Badge>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="flex gap-4">
          <Button onClick={onStartReflection} size="lg" className="flex-1">
            Start Reflection Conversation
          </Button>
          <Button onClick={onRestart} variant="outline" size="lg">
            Start Over
          </Button>
        </div>
      </div>
    </div>
  );
}
