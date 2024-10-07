import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RiInboxArchiveFill, RiInboxUnarchiveFill } from "react-icons/ri";

import React, { Dispatch, SetStateAction, useState } from "react";
import { BASE_URL } from "@/constant/constant";
import useStore from "@/states/authStore";
import { Alert } from "../../global";

function HandleArchive({
  status,
  alertId,
  setAlerts,
  setAlertCount,
  accessToken,
}: {
  status: "OPEN" | "TRIGGERED" | "ARCHIVED";
  alertId: string;
  setAlerts: Dispatch<SetStateAction<Alert[]>>;
  setAlertCount: Dispatch<SetStateAction<number>>;
  accessToken: string;
}) {
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function manageArchive() {
    const response = await fetch(`${BASE_URL}/api/alerts/${alertId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        status: status !== "ARCHIVED" ? "ARCHIVED" : "OPEN",
      }),
    });
    if (!response.ok) {
      if (response.status === 401) {
        setFieldError("Unauthorized");
        return;
      } else if (response.status === 400) {
        setFieldError("Invalid data");
        return;
      } else if (response.status === 429) {
        setFieldError("Too many requests");
        return;
      }

      return;
    }
    const data = await response.json();
    setAlerts((alerts) => {
      return alerts.filter((alert) => {
        return alert._id !== alertId;
      });
    });
    setAlertCount((count) => count - 1);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {status === "ARCHIVED" ? (
          <RiInboxUnarchiveFill className="text-xl" />
        ) : (
          <RiInboxArchiveFill className="text-xl" />
        )}
      </DialogTrigger>
      <DialogContent className="text-black">
        <DialogHeader>
          <DialogTitle>
            {status === "ARCHIVED" ? "Undone Archived" : "Archive Alert"}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to archive this alert?
          </DialogDescription>
        </DialogHeader>
        {fieldError && <p className="text-red-500">{fieldError}</p>}

        <button
          onClick={manageArchive}
          className="px-5 py-2 bg-red-500 text-white rounded-xl"
        >
          {status === "ARCHIVED" ? "Unarchive" : "Archive"}
        </button>
        <DialogClose className="px-5 py-2 bg-black text-white rounded-xl">
          Cancel
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default HandleArchive;
