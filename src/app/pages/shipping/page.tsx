
import { InfoPage } from "@/components/info-page";

export default function ShippingPage() {
  return (
    <InfoPage
      eyebrow="Customer Care"
      title="Shipping & Delivery"
      intro="LUXORA aims to provide a clear and reliable delivery experience for customers across Pakistan."
      sections={[
        {
          heading: "Delivery Areas",
          text: "Delivery availability will depend on the customer's city and the courier service covering that location."
        },
        {
          heading: "Delivery Time",
          text: "Estimated delivery times will be confirmed at checkout or by customer support. Delivery may take longer in remote areas or during busy periods."
        },
        {
          heading: "Shipping Charges",
          text: "Applicable delivery charges should be displayed before the customer confirms an order."
        },
        {
          heading: "Order Tracking",
          text: "Customers can contact LUXORA support with their order number to ask about delivery progress."
        },
        {
          heading: "Delayed or Damaged Orders",
          text: "Please contact customer support if your order is delayed, arrives damaged, or has missing items."
        }
      ]}
    />
  );
}
