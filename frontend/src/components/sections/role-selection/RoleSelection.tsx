import { Card } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import type { Role,RoleId } from "@/models.ts";





const RoleSelection = ({ 
  roles,  
  onRoleSelect,
}: { 
  roles: Role[] | null
  onRoleSelect: (role: RoleId) => void 
}) => {

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-16">
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
          { roles?.map((role) => (
            <Card
              key={role.id}
              className={`p-8 hover:shadow-lg transition-all duration-300 border-2 hover:scale-[1.02]`}
            >
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6`}
              >
                {/* <role.icon className={`w-8 h-8`} /> */}
              </div>

              <h2 className="text-2xl font-semibold mb-3">{role.name}</h2>

              <p className="text-muted-foreground mb-8 leading-relaxed min-h-12]">
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
      </div>
    </div>
  );
}

export default RoleSelection;

