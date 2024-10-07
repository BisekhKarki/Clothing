"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useStore from "@/states/authStore";
import { Turnstile } from "@marsidev/react-turnstile";
import { COSMOS_API_SLUG, config } from "@/constant/constant";

interface FormData {
  fullName: string;
  email: string;
  type: string;
  message: string;
  turnstileCaptcha: string;
}

function FeedbackForm() {
  const turnstileRef = useRef<any>(null);
  const { isAuthenticated, user } = useStore((state) => state);

  const [formData, setFormData] = useState<FormData>({
    fullName: isAuthenticated && user ? `${user.username}` : "",
    email: isAuthenticated && user ? user.email : "",
    type: "",
    message: "",
    turnstileCaptcha: "",
  });

  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => {
        return {
          ...prev,
          fullName: `${user.username}`,
          email: user.email,
        };
      });
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedType: string) => {
    const capitalizedType = selectedType.toUpperCase();

    setFormData((prevState) => ({
      ...prevState,
      type: capitalizedType,
    }));
  };

  const handleVerify = (token: string) => {
    setFormData((prevState) => ({
      ...prevState,
      turnstileCaptcha: token,
    }));
  };

  const handleFeedbackSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!formData) {
      setMessage("formData is null or undefined");
      return;
    }

    if (!turnstileRef.current || !turnstileRef.current.getResponse) {
      setMessage("Error: Turnstile reference not available");
      return;
    }
    const captchaToken = await turnstileRef.current.getResponsePromise();
    setFormData((prevState) => ({
      ...prevState,
      turnstileCaptcha: captchaToken,
    }));

    try {
      const response = await fetch(
        `https://main-cosmos-api-tf-api.trilok.tech/api/projects/${COSMOS_API_SLUG}/feedbacks`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorBody = await response.json();
        let errorMessage = "";
        if (errorBody && errorBody.errors && errorBody.errors.length > 0) {
          errorMessage = errorBody.errors
            .map((error: any) => error.msg)
            .join(", ");
        } else {
          errorMessage = "An unknown error occurred.";
        }
        setMessage(`Error: ${errorMessage}`);
      } else {
        setMessage("Feedback submitted successfully!");
        setFormData({
          fullName: "",
          email: "",
          type: "",
          message: "",
          turnstileCaptcha: "",
        });
        turnstileRef.current.reset();
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        style={{
          backgroundColor: "white",
          color: "black",
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
        }}
      >
        Feedback
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle
            style={{
              color: "#0E0E0E",
              fontSize: "1.2rem",
              fontWeight: "semibold",
            }}
          >
            Feedback Form
          </DialogTitle>
          <DialogDescription>
            We value your feedback! Please let us know your thoughts.
          </DialogDescription>
        </DialogHeader>
        {message && (
          <div className="text-black bg-red-100 p-2 rounded-md mb-4">
            {message}
          </div>
        )}
        <form id="feedbackForm" onSubmit={handleFeedbackSubmit}>
          <div className="mb-4 text-black">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Full Name
            </label>
            <Input
              type="text"
              required
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4 text-black">
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Email
            </label>
            <Input
              type="email"
              required
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4 text-black">
            <label
              htmlFor="type"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Type
            </label>
            <Select
              required
              onValueChange={(selectedType) => handleSelectChange(selectedType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Feedback Type</SelectLabel>
                  <SelectItem value="bug">BUG</SelectItem>
                  <SelectItem value="feature">FEATURE</SelectItem>
                  <SelectItem value="suggestion">SUGGESTION</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4 text-black">
            <label
              htmlFor="message"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Message
            </label>
            <Textarea
              required
              id="message"
              name="message"
              value={formData.message}
              onChange={handleTextareaChange}
            />
          </div>
          <div>
            <Turnstile
              className="mb-4"
              ref={turnstileRef}
              siteKey={config.TURNSTILE_SITE_KEY}
              onSuccess={handleVerify}
            />
          </div>
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default FeedbackForm;
