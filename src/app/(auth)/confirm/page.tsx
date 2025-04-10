import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function ConfirmEmailPage() {
  return (
    <div className="flex items-center justify-center w-full min-h-full p-6 m-6 md:p-10 ">
      <Card>
        <CardTitle>Confirm your Email address</CardTitle>
        <CardDescription>
          A confirmation email has been sent to your address.
        </CardDescription>
      </Card>
    </div>
  );
}
