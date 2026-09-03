import { EmptyState } from "@/components/feedback/EmptyState";
import { PageContainer } from "@/components/layout/PageContainer";
import { useProfile } from "@/features/profile/hooks/useProfile";

export function HomePage() {
  const { data: profile } = useProfile();

  return (
    <PageContainer>
      <EmptyState
        title={
          profile ? `Welcome back, ${profile.display_name}` : "Welcome back"
        }
        description="The cinematic home feed will be implemented in the home phase."
      />
    </PageContainer>
  );
}
