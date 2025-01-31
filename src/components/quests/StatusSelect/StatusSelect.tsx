import {
  Badge,
  type BadgeProps,
  Button,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  Tooltip,
  TooltipTrigger,
} from "@/components/common";
import { STATUS, type Status } from "@convex/constants";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { Selection } from "react-aria-components";
import { tv } from "tailwind-variants";

interface StatusBadgeProps extends Omit<BadgeProps, "children"> {
  status: Status;
  condensed?: boolean;
}

const badgeStyles = tv({
  base: "flex items-center transition-colors rounded-full",
  variants: {
    condensed: {
      true: "size-5 p-0 lg:size-6",
      false: "pr-2",
    },
  },
});

export function StatusBadge({ status, condensed, ...props }: StatusBadgeProps) {
  if (status === undefined) return null;

  const { label, icon, variant } = STATUS[status];

  const InnerBadge = (
    <Badge
      icon={icon}
      variant={variant}
      {...props}
      className={badgeStyles({ condensed })}
    >
      {!condensed && label}
    </Badge>
  );

  if (!condensed) return InnerBadge;

  return (
    <TooltipTrigger>
      {InnerBadge}
      <Tooltip>{label}</Tooltip>
    </TooltipTrigger>
  );
}

interface StatusSelectProps {
  status: Status;
  isCore?: boolean;
  onChange: (status: Status) => void;
}

export function StatusSelect({ status, isCore, onChange }: StatusSelectProps) {
  const [selectedStatus, setSelectedStatus] = useState<Selection>(
    new Set([status]),
  );

  const handleSelectionChange = (status: Selection) => {
    onChange([...status][0] as Status);
    setSelectedStatus(status);
  };

  return (
    <MenuTrigger>
      <Button variant="ghost" className="px-2 gap-1" endIcon={ChevronDown}>
        <StatusBadge status={status} size="lg" />
      </Button>
      <Menu
        placement="bottom end"
        selectionMode="single"
        selectedKeys={selectedStatus}
        disallowEmptySelection
        onSelectionChange={handleSelectionChange}
      >
        <MenuSection title="Status">
          {Object.entries(STATUS).map(([status, details]) => {
            if (!isCore && details.isCoreOnly) return null;
            return (
              <MenuItem
                key={status}
                id={status}
                aria-label={details.label}
                className="h-9"
              >
                <StatusBadge status={status as Status} size="lg" />
              </MenuItem>
            );
          })}
        </MenuSection>
      </Menu>
    </MenuTrigger>
  );
}
