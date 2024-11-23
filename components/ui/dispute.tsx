import { CircleCheck, Download } from "lucide-react";
import { Card, CardContent, CardFooter } from "./card";
import { Button } from "./button";

export function PaymentConfirmed() {
  return (
    <Card className="flex flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <div className="flex items-center justify-center">
          <CircleCheck className="h-16 w-16 text-green-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Payment Confirmed
          </h1>
          <p className="text-muted-foreground">
            Your payment has been successfully processed.
          </p>
        </div>
        <Card>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">Amount</div>
              <div className="font-medium">$499.99</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">Recipient</div>
              <div className="font-medium">Acme Inc.</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">Transaction ID</div>
              <div className="font-medium">12345678</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">Payment Method</div>
              <div className="font-medium">Crypto (USDT)</div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Close
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Card>
  );
}
