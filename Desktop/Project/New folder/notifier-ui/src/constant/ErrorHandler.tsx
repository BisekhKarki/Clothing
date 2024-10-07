import React from "react";

interface ErrorProps {
  error?: Error; 
  defaultMessage?: string;
}

const ErrorHandler: React.FC<ErrorProps> = ({ error, defaultMessage }) => {
  const errorMessage =
    error?.message || defaultMessage || "An unexpected error occurred.";

  return (
    <div className="text-black bg-red-100 p-2 rounded-md mb-4">
      {errorMessage}
    </div>
  );
};

export default ErrorHandler;
