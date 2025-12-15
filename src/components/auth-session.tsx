import { auth } from "@/auth";
import { AuthButton } from "@/components/client/buttons/auth-button";

export const AuthSession = async () => {
  const session = await auth();

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <AuthButton
        isAuthenticated={!!session}
        userName={session?.user?.name || session?.user?.email || null}
      />
    </div>
  );
};

