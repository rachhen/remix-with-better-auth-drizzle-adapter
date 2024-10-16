import { MobileIcon } from "@radix-ui/react-icons";
import { useNavigate } from "@remix-run/react";
import { Laptop, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import UAParser from "ua-parser-js";

import { authClient } from "~/lib/auth-client";
import { Session } from "~/types/auth";

type Props = {
  session: Session | null;
  activeSessions: Session["session"][];
};

export function ActiveSessions(props: Props) {
  const [isTerminating, setIsTerminating] = useState<string>();
  const navigate = useNavigate();

  return (
    <div className="border-l-2 px-2 w-max gap-1 flex flex-col">
      <p className="text-xs font-medium ">Active Sessions</p>
      {props.activeSessions
        .filter((session) => session.userAgent)
        .map((session) => {
          return (
            <div key={session.id}>
              <div className="flex items-center gap-2 text-sm  text-black font-medium dark:text-white">
                {new UAParser(session.userAgent).getDevice().type ===
                "mobile" ? (
                  <MobileIcon />
                ) : (
                  <Laptop size={16} />
                )}
                {new UAParser(session.userAgent).getOS().name},{" "}
                {new UAParser(session.userAgent).getBrowser().name}
                <button
                  className="text-red-500 opacity-80  cursor-pointer text-xs border-muted-foreground border-red-600  underline "
                  onClick={async () => {
                    setIsTerminating(session.id);
                    const res = await authClient.user.revokeSession({
                      id: session.id,
                    });

                    if (res.error) {
                      toast.error(res.error.message);
                    } else {
                      toast.success("Session terminated successfully");
                    }
                    navigate(0);
                    setIsTerminating(undefined);
                  }}
                >
                  {isTerminating === session.id ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : session.id === props.session?.session.id ? (
                    "Sign Out"
                  ) : (
                    "Terminate"
                  )}
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
}
