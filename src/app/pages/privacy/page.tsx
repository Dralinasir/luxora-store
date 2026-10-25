
import { InfoPage } from "@/components/info-page";

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="LUXORA respects your privacy and aims to handle your personal information responsibly."
      sections={[
        {
          heading: "Information We Collect",
          text: "When you use our store, we may collect information such as your name, email address, delivery address, contact details, account information, and order history when needed to provide our services.",
        },
        {
          heading: "How We Use Your Information",
          text: "Information may be used to process orders, arrange deliveries, provide customer support, maintain accounts, prevent fraud, and meet legal obligations.",
        },
        {
          heading: "Sharing Information",
          text: "Information may be shared with service providers, such as delivery companies and payment processors, only as necessary to operate the store or where legally required.",
        },
        {
          heading: "Security and Retention",
          text: "We should use appropriate safeguards to protect customer information and retain it only for as long as necessary for the purposes described in our final privacy policy.",
        },
        {
          heading: "Your Privacy Choices",
          text: "Customers may contact LUXORA to ask about their personal information or request applicable privacy rights under relevant law. Official contact details must be provided before launch.",
        },
        {
          heading: "Policy Updates",
          text: "Any changes to this policy should be published on this page with an updated effective date.",
        },
      ]}
    />
  );
}
