import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Session } from "~/types/auth";

type Props = {
  session: Session | null;
};
export function UserProfile({ session }: Props) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="hidden h-9 w-9 sm:flex ">
        <AvatarImage
          src={session?.user.image || "#"}
          alt="Avatar"
          className="object-cover"
        />
        <AvatarFallback>{session?.user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="grid gap-1">
        <p className="text-sm font-medium leading-none">{session?.user.name}</p>
        <p className="text-sm">{session?.user.email}</p>
      </div>
    </div>
  );
}
