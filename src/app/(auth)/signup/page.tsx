import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center w-full min-h-full p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}
