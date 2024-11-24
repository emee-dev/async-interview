import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeIcon, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="text-center space-y-6 max-w-md">
        <AlertCircle className="mx-auto h-24 w-24 text-muted-foreground" />
        <h1 className="text-xl font-bold tracking-tighter sm:text-4xl">
          404 - Not Found
        </h1>
        <p className="text-lg text-muted-foreground">
          {"Oops! The page you're looking for doesn't exist or has been moved."}
        </p>
        <Button asChild className="mt-4">
          <Link href="/" className="inline-flex items-center">
            <HomeIcon className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
