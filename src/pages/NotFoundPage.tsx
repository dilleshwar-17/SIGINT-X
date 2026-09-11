import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <Compass className="h-12 w-12 text-text-muted" aria-hidden="true" />
      <h1 className="font-mono text-3xl font-semibold text-text-primary">404 — NOT FOUND</h1>
      <p className="max-w-sm text-sm text-text-secondary">
        The page you requested does not exist or the analysis is no longer available.
      </p>
      <Button variant="primary">
        <Link to="/">Return to Dashboard</Link>
      </Button>
    </div>
  );
}