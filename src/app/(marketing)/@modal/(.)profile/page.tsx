"use client";

import { useRouter } from "next/navigation";

import { Dialog, DialogClose, DialogContent } from "~/components/ui/dialog";
import { useAuth } from "~/lib/context/auth";

export default function Profile() {
  const auth = useAuth();
  const router = useRouter();
  // const session = await getServerSession();

  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogClose />
      <DialogContent>
        <p>User id: {auth.user.userId}</p>
        <p>Email: {auth.user.email}</p>
      </DialogContent>
    </Dialog>
  );
}
