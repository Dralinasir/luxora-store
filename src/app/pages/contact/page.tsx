
import { InfoPage } from "@/components/info-page";

export default function ContactPage() {
  return (
    <InfoPage
      eyebrow="Customer Care"
      title="Contact LUXORA"
      intro="We are here to help with your shopping experience, orders, and product questions."
      sections={[
        {
          heading: "Customer Support",
          text: "For assistance, use the customer support email published by LUXORA or the contact details provided with your order.",
        },
        {
          heading: "Order Enquiries",
          text: "When contacting support about an order, include your order number. Never send your password or payment card details.",
        },
        {
          heading: "Support Hours",
          text: "Our customer support hours and response times will be published here once confirmed.",
        },
      ]}
    />
  );
}
