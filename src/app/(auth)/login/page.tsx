import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center w-full min-h-full p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
