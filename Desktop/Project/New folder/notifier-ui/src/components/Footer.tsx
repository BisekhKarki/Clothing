"use client";

import FeedbackForm from "./FeedbackForm";
function Footer() {
  return (
    <footer className="flex flex-col justify-center items-center py-4 bg-gray-800 text-gray-100">
      <div className="container px-6 py-8 mx-auto">
        <div className="flex flex-col items-center text-center">
          <a href="#">
            {/* <img className="w-auto h-7" src="https://merakiui.com/images/full-logo.svg" alt=""> */}
          </a>

          <p className="max-w-md mx-auto mt-4 text-gray-500 dark:text-gray-400">
            Encountering issues? Have Feedbacks? Submit our feedback form.
          </p>

          <div className="flex flex-col mt-4 sm:flex-row sm:items-center sm:justify-center">
            <FeedbackForm />
          </div>
        </div>

        <hr className="my-10 border-gray-200 dark:border-gray-700" />

        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <p className="text-sm text-gray-500">
            © 2024 Vuldesk Technologies Private Limited.
          </p>

          <div className="flex mt-3 -mx-2 sm:mt-0">
            <a
              href="/tos"
              className="mx-2 text-sm text-gray-500 transition-colors duration-300 hover:text-gray-500 dark:hover:text-gray-300"
              aria-label="Reddit"
            >
              {" "}
              Terms And Conditions{" "}
            </a>

            <a
              href="/privacy"
              className="mx-2 text-sm text-gray-500 transition-colors duration-300 hover:text-gray-500 dark:hover:text-gray-300"
              aria-label="Reddit"
            >
              {" "}
              Privacy{" "}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
