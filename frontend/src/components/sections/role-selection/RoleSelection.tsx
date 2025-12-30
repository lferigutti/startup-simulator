import { Card } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import type { Role, RoleId } from "@/models.ts";
import ROLE_STYLES from "@/data.tsx";
import { Compass } from "lucide-react";

const RoleSelection = ({
  roles,
  onRoleSelect,
}: {
  roles: Role[] | null;
  onRoleSelect: (role: RoleId) => void;
}) => {
  return (
    <div className="flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-16">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center text-primary ">
              <Compass className="w-10 h-10 md:w-20 md:h-20" />
            </div>
          </div>
          <h1 className="text-5xl font-semibold mb-6 text-balance">
            Startup Role Simulator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Experience startup decisions from different perspectives. Make
            choices, discover patterns, and reflect on your approach through
            realistic workplace scenarios.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles?.map((role) => (
            <Card
              key={role.id}
              className="p-8 hover:shadow-lg transition-all duration-300 border-2 hover:scale-[1.02]"
            >
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                style={
                  ROLE_STYLES[role.id]
                    ? {
                        backgroundColor: `hsl(var(${ROLE_STYLES[role.id].colorVar}) / 0.20)`,
                        //color: `hsl(var(${ROLE_STYLES[role.id].colorVar}))`,
                      }
                    : undefined
                }
              >
                {ROLE_STYLES[role.id]?.icon}
              </div>

              <h2 className="text-2xl font-semibold mb-3">{role.name}</h2>

              <p className="text-muted-foreground mb-8 leading-relaxed min-h-12">
                {role.description}
              </p>

              <Button
                onClick={() => onRoleSelect(role.id)}
                className="w-full"
                size="lg"
              >
                Start as {role.name}
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-16 max-w-2xl mx-auto text-center text-sm text-muted-foreground leading-relaxed">
          <p className="mb-2 font-medium text-foreground/80">
            About this project
          </p>
          <p>
            This is a small experiment about how people make decisions in messy
            startup situations. It’s not a scientific test – it’s a reflection
            tool to surface patterns in your choices and spark more honest
            conversations about how you like to work.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
