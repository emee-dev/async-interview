import { FileX2 } from "lucide-react";

export function NoData() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <FileX2 className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
      <p className="text-muted-foreground">
        There is no interview data to display at this time.
      </p>
    </div>
  );
}
