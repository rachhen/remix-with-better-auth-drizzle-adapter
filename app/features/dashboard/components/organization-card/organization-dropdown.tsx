import { ChevronDownIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { organization, useListOrganizations } from "~/lib/auth-client";
import { ActiveOrganization } from "~/types/auth";

type Props = {
  optimisticOrg: ActiveOrganization | null;
  setOptimisticOrg: (org: ActiveOrganization | null) => void;
};
export function OrganizationDropdown({
  optimisticOrg,
  setOptimisticOrg,
}: Props) {
  const organizations = useListOrganizations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer">
          <p className="text-sm">
            <span className="font-bold"></span>{" "}
            {optimisticOrg?.name || "Personal"}
          </p>

          <ChevronDownIcon />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          className=" py-1"
          onClick={() => {
            organization.setActive(null);
            setOptimisticOrg(null);
          }}
        >
          <p className="text-sm sm">Personal</p>
        </DropdownMenuItem>
        {organizations.data?.map((org) => (
          <DropdownMenuItem
            className=" py-1"
            key={org.id}
            onClick={() => {
              if (org.id === optimisticOrg?.id) {
                return;
              }
              organization.setActive(org.id);
              setOptimisticOrg({
                members: [],
                invitations: [],
                ...org,
              });
            }}
          >
            <p className="text-sm sm">{org.name}</p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
