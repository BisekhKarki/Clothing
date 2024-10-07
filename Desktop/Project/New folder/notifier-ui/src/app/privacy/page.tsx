import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col md:px-24 px-5 gap-4 py-5">
      <h1 className="text-bold text-[50px]">Privacy Policy</h1>
      <p>Effective Date: February 18, 2024</p>
      <p>
        This Privacy Policy describes how Phishit (&quote;e&quote;,
        &quote;us&quote;, or &quote;our&quote;) collects, uses, and discloses
        your personal information when you use our website or mobile application
        (the &quote;Service&quote;).
      </p>
      <h2 className="font-bold text-3xl">Information We Collect</h2>
      <p>
        We collect the following types of information from and about you when
        you use the Service:
      </p>
      <ul className="flex flex-col gap-2">
        <li>
          <b>Personal Information:</b> This includes information that can
          identify you, such as your name, email address, phone number, billing
          address, and payment information.
        </li>
        <li>
          <b>Demographic Information:</b> This includes information about your
          age, gender, country, and preferred language.
        </li>
        <li>
          <b>Usage Information:</b> This includes information about how you use
          the Service, such as your search queries, bookings, and browsing
          history.
        </li>
        <li>
          <b>Device Information:</b> This includes information about the device
          you use to access the Service, such as your IP address, device type,
          operating system, and browser type.
        </li>
      </ul>
      <h2 className="text-3xl font-bold">How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul className=" list-disc flex flex-col gap-2">
        <li>Provide and operate the Service</li>
        <li>Process and fulfill your bookings</li>
        <li>Respond to your inquiries and requests</li>
        <li>
          Send you promotional emails and communications (with your consent)
        </li>
        <li>Analyze how you use the Service to improve it</li>
        <li>Detect and prevent fraud and other illegal activities</li>
      </ul>
      <h2 className="text-3xl font-bold">Sharing Your Information</h2>
      <p>We may share your information with the following third-parties:</p>
      <ul className="flex list-disc flex-col gap-2">
        <li>
          Service providers who help us operate the Service, such as payment
          processors and data analytics providers.
        </li>
        <li>
          Government authorities or law enforcement officials as required by
          law.
        </li>
        <li>Other third-parties with your consent.</li>
      </ul>
      <h2 className="text-3xl font-bold">Data Retention</h2>
      <p>
        We will retain your information for as long as necessary to fulfill the
        purposes outlined in this Privacy Policy, unless a longer retention
        period is required or permitted by law.
      </p>
      <h2 className="font-bold text-3xl">Your Choices</h2>
      <p>You have the following choices regarding your information:</p>
      <ul className="flex flex-col gap-2 list-disc">
        <li>Access and update your information</li>
        <li>Request deletion of your information</li>
        <li>Opt out of receiving promotional emails</li>
      </ul>
      <h2 className="font-bold text-3xl">Security</h2>
      <p>
        We take reasonable measures to protect your information from
        unauthorized access, use, disclosure, alteration, or destruction.
        However, no method of transmission or electronic storage is 100% secure.
      </p>
      <h2 className="text-3xl font-bold">Children&apos;s Privacy</h2>
      <p>
        Our Service is not intended for children under the age of 13. We do not
        knowingly collect or solicit personal information from children under
        13. If you are a parent or guardian and you believe your child has
        provided us with personal information, please contact us.
      </p>
      <h2 className="text-3xl font-bold">Changes to this Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you
        of any changes by posting the new Privacy Policy on the Service. You are
        advised to review this Privacy Policy periodically for any changes.
      </p>
      <h2 className="text-3xl font-bold">Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us:
      </p>
      <ul>
        <li>By email: contact@vuldesk.com</li>
        <li>By phone number: 9863299610</li>
      </ul>
    </div>
  );
};

export default PrivacyPolicy;
