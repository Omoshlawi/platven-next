"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import useSessionContext from "@/hooks/useSessionContext";
import { Contact } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

import React, { FC } from "react";

interface Props {
  message: Contact;
}
const MessageAction: FC<Props> = ({ message }) => {
  const { user } = useSessionContext();
  const router = useRouter();
  const { toast } = useToast();
  const handleToggle = async () => {
    const response = await fetch(`/api/contact/${message.id}`, {
      method: "PUT",
      body: JSON.stringify({
        subject: message.subject,
        email: message.email,
        phoneNumber: message.phoneNumber,
        message: message.message,
        name: message.name,
        isAddressed: !message.isAddressed,
      }),
    });
    if (response.ok) {
      router.refresh();
      toast({
        title: "Success!",
        description: "Message addresed status updated successfully!",
      });
    }
  };

  const handleDelete = async () => {
    const response = await fetch(`/api/contact/${message.id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      router.refresh();
      toast({
        title: "Success!",
        description: "Property deleted successfully!",
      });
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() =>
            window.open(
              `mailto:${message.email}?subject=${message.subject}`,
              "popup",
            )
          }
        >
          Reply
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleToggle}>
          {message.isAddressed ? "Mark Un addressed" : "Mark as Addressed"}
        </DropdownMenuItem>
        {user?.isStaff && (
          <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MessageAction;
