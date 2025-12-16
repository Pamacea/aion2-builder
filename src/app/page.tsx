import { DiscoverClass } from "@/components/client/discover-class";
import { DiscoverHead } from "@/components/client/discover-head";

// Force dynamic rendering since we need database access
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
    <DiscoverHead />
    <DiscoverClass />
    </>
  );
}
