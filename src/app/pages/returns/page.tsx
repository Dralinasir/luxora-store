
import { InfoPage } from "@/components/info-page";

export default function ReturnsPage() {
  return (
    <InfoPage
      eyebrow="Customer Care"
      title="Returns & Exchanges"
      intro="We want you to shop with confidence. Please contact our customer support team if you have a concern about an order."
      sections={[
        {
          heading: "Return Eligibility",
          text: "Products must meet the eligibility conditions in LUXORA's confirmed return policy. Any exclusions and condition requirements should be published before launch.",
        },
        {
          heading: "How to Request a Return",
          text: "Contact customer support with your order number, the product details, and the reason for your request. Wait for return instructions before sending an item back.",
        },
        {
          heading: "Refunds",
          text: "Refund approval, available refund methods, and processing times will depend on the final published policy and payment method.",
        },
      ]}
    />
  );
}
