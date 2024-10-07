import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BASE_URL } from "@/constant/constant";
import useStore from "@/states/authStore";
import { Dispatch, SetStateAction, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { Alert } from "../../../global";

function DeleteAlert({
  alertId,
  setAlerts,
  accessToken
}: {
  alertId: string;
    setAlerts: Dispatch<SetStateAction<Alert[]>>;
  accessToken: string;
}) {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  async function handleDelete() {
    const response = await fetch(`${BASE_URL}/api/alerts/${alertId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        setFormError("Unauthorized");
        return;
      } else if (response.status === 400) {
        setFormError("Invalid data");
        return;
      } else if (response.status === 429) {
        setFormError("Too many requests");
        return;
      }
      return;
    }

    setAlerts((alerts) => {
      return alerts.filter((alert) => {
        return alert._id !== alertId;
      });
    });
    setOpen(false);
    return;
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <MdDeleteOutline className="text-red-500 text-xl" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-black">
            Are you absolutely sure?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            alert.
          </DialogDescription>
          {formError && <p className="text-red-500">{formError}</p>}
          <button
            onClick={handleDelete}
            className="px-5 py-2 bg-red-500 text-white rounded-xl"
          >
            Delete
          </button>
          <DialogClose className="px-5 py-2 bg-black text-white rounded-xl">
            Cancel
          </DialogClose>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteAlert;
