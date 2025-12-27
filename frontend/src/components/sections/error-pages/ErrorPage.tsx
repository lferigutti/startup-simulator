import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  Home,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const ErrorPage = ({ error }: { error: Error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-b from-background to-muted/20">
      <Card className="max-w-lg w-full p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-4">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Oops!</h1>
          <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
            Something went wrong
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We encountered an unexpected error. Don't worry, it's not your
            fault.
          </p>
          {error.message && (
            <Card className="p-4 mb-8 bg-muted/50 border-destructive/20">
              <p className="text-sm text-destructive font-mono text-left wrap-break-words">
                {error.message}
              </p>
            </Card>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="flex-1"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload Page
          </Button>
          <Link to="/" className="flex-1">
            <Button className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ErrorPage;
