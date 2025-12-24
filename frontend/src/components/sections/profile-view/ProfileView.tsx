import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Scale, Lightbulb, Target } from "lucide-react";
import type { Role, Decision } from "@/models";

interface ProfileViewProps {
  role: Role;
  decisions: Decision[];
  onStartReflection: () => void;
  onRestart: () => void;
}

interface Profile {
  summary: string;
  patterns: Array<{ icon: string; title: string; description: string }>;
  tradeoffs: Array<{ title: string; description: string }>;
  insights: string[];
}

const iconMap = {
  TrendingUp,
  Scale,
  Lightbulb,
  Target,
};

export default function ProfileView({
  role,
  onStartReflection,  
  onRestart,
}: ProfileViewProps) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    // Simulate profile generation
    setTimeout(() => {
      setProfile(generateProfile(role));
      setLoading(false);
    }, 2000);
  }, [role]);

  const roleColors = {
    engineer: "border-engineer",
    "product-manager": "border-product",
    founder: "border-founder",
  };

  const roleNames = {
    engineer: "Engineer",
    "product-manager": "Product Manager",
    founder: "Founder",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">
            Analyzing your decisions...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            {roleNames[role]}
          </Badge>
          <h1 className="text-5xl font-semibold mb-4 text-balance">
            Your {roleNames[role]} Profile
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Based on your choices across five scenarios, here's what we learned
            about your decision-making approach.
          </p>
        </div>

        {/* Summary */}
        <Card className={`p-8 mb-8 border-l-4 ${roleColors[role]}`}>
          <p className="text-lg leading-relaxed">{profile.summary}</p>
        </Card>

        {/* Decision Patterns */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-6">
            Your Decision Patterns
          </h2>
          <div className="grid gap-4">
            {profile.patterns.map((pattern, index) => {
              const Icon =
                iconMap[pattern.icon as keyof typeof iconMap] || Target;
              return (
                <Card key={index} className="p-6">
                  <div className="flex gap-4">
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        {pattern.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {pattern.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Trade-off Preferences */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-6">
            How You Balance Trade-offs
          </h2>
          <div className="space-y-4">
            {profile.tradeoffs.map((tradeoff, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-semibold text-lg mb-2">{tradeoff.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {tradeoff.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">Key Insights</h2>
          <Card className="p-8">
            <ul className="space-y-4">
              {profile.insights.map((insight, index) => (
                <li key={index} className="flex gap-3">
                  <span className="text-primary font-semibold">•</span>
                  <span className="leading-relaxed">{insight}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Actions */}
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

function generateProfile(role: Role): Profile {
  // This is a simplified profile generator - in a real app, this would use AI
  const profiles = {
    engineer: {
      summary:
        "You demonstrate a pragmatic approach to engineering leadership, balancing technical excellence with business realities. Your decisions show you value sustainable practices while recognizing when speed is necessary.",
      patterns: [
        {
          icon: "TrendingUp",
          title: "Pragmatic Problem Solver",
          description:
            "You tend to seek middle-ground solutions that balance competing priorities rather than taking extreme positions.",
        },
        {
          icon: "Scale",
          title: "Risk-Aware Builder",
          description:
            "You carefully weigh technical debt against delivery speed, showing awareness of long-term consequences.",
        },
        {
          icon: "Lightbulb",
          title: "Collaborative Decision-Maker",
          description:
            "You value input from stakeholders and prefer transparent communication about trade-offs.",
        },
      ],
      tradeoffs: [
        {
          title: "Speed vs. Quality",
          description:
            "You lean toward finding hybrid approaches that deliver value quickly while maintaining acceptable quality standards.",
        },
        {
          title: "Innovation vs. Stability",
          description:
            "You're open to new technologies but prefer proven approaches when stakes are high.",
        },
      ],
      insights: [
        "Your balanced approach helps build trust with both technical and business stakeholders",
        "You might benefit from being more decisive in situations where compromise isn't possible",
        "Your awareness of technical debt suggests strong architectural thinking",
      ],
    },
    "product-manager": {
      summary:
        "Your product decisions reveal a data-informed leader who balances user needs with business constraints. You show ability to navigate organizational dynamics while maintaining focus on outcomes.",
      patterns: [
        {
          icon: "Target",
          title: "User-Centric Thinker",
          description:
            "You consistently prioritize understanding underlying user needs over implementing specific feature requests.",
        },
        {
          icon: "Scale",
          title: "Strategic Prioritizer",
          description:
            "You evaluate opportunities through multiple lenses - user value, business impact, and team capacity.",
        },
        {
          icon: "TrendingUp",
          title: "Evidence-Based Navigator",
          description:
            "You prefer validating assumptions through research and testing rather than relying on intuition alone.",
        },
      ],
      tradeoffs: [
        {
          title: "Customer Requests vs. Market Research",
          description:
            "You tend to value broader market insights while remaining sensitive to key customer relationships.",
        },
        {
          title: "Scope vs. Quality",
          description:
            "You're willing to scope down features to ship higher quality experiences.",
        },
      ],
      insights: [
        "Your data-driven approach helps build credibility but remember that some decisions require intuition",
        "You navigate stakeholder conflicts well by focusing on shared goals",
        "Consider when to move faster with less validation based on opportunity cost",
      ],
    },
    founder: {
      summary:
        "As a founder, you display strategic thinking balanced with operational awareness. Your decisions show you understand the need for both vision and pragmatism in building a company.",
      patterns: [
        {
          icon: "Target",
          title: "Vision-Driven Leader",
          description:
            "You maintain strategic focus while being flexible about tactics and execution approaches.",
        },
        {
          icon: "Scale",
          title: "Resource Optimizer",
          description:
            "You carefully consider resource allocation, weighing growth against sustainability.",
        },
        {
          icon: "Lightbulb",
          title: "Relationship Builder",
          description:
            "You recognize the importance of stakeholder alignment and communication in critical decisions.",
        },
      ],
      tradeoffs: [
        {
          title: "Growth vs. Control",
          description:
            "You show thoughtfulness about when to prioritize rapid growth versus maintaining optionality.",
        },
        {
          title: "Vision vs. Market Feedback",
          description:
            "You balance conviction in your vision with openness to market signals and adaptation.",
        },
      ],
      insights: [
        "Your balanced approach to growth and sustainability suggests mature leadership",
        "You might benefit from being more aggressive when conviction is high",
        "Your awareness of team dynamics will serve you well as you scale",
      ],
    },
  };

  return profiles[role];
}
