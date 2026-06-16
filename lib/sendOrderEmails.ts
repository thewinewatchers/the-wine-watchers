import { Resend } from "resend";

type SendOrderEmailItem = {
  wine_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

type SendOrderEmailsParams = {
  orderId: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string | null;
  customerPostalCode?: string | null;
  customerCity?: string | null;
  customerCountry?: string | null;
  customerComment?: string | null;
  companyName?: string | null;
  vatNumber?: string | null;
  items: SendOrderEmailItem[];
  totalExclVat: number;
  vatAmount: number;
  finalTotalToPay: number;
  vatNote: string;
  deliveryLabel: string;
  safeDeliveryNote: string;
  selectedDeliveryMethod: "pickup" | "delivery";
  selectedPaymentMethod: "card" | "bank_transfer";
  bankTransferInstructions?: string | null;
};

function formatPrice(value: number) {
  return Number(value || 0).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

export async function sendOrderEmails({
  orderId,
  customerFirstName,
  customerLastName,
  customerEmail,
  customerPhone,
  customerAddress,
  customerPostalCode,
  customerCity,
  customerCountry,
  customerComment,
  companyName,
  vatNumber,
  items,
  totalExclVat,
  vatAmount,
  finalTotalToPay,
  vatNote,
  deliveryLabel,
  safeDeliveryNote,
  selectedDeliveryMethod,
  selectedPaymentMethod,
  bankTransferInstructions,
}: SendOrderEmailsParams) {
  console.log("SEND_ORDER_EMAILS_START:", orderId);

  const resendApiKey = process.env.RESEND_API_KEY;
  const emailFrom =
    process.env.EMAIL_FROM || "The Wine Watchers <onboarding@resend.dev>";
  const adminEmail = process.env.ADMIN_EMAIL || "millesimesunited@gmail.com";

  console.log("SEND_ORDER_EMAILS_ENV:", {
    hasResendApiKey: Boolean(resendApiKey),
    emailFrom,
    adminEmail,
  });

  if (!resendApiKey) {
    console.error("SEND_ORDER_EMAILS_ERROR: RESEND_API_KEY manquante");
    return;
  }

  const resend = new Resend(resendApiKey);

  const formattedItems = items
    .map((item) => {
      return `- ${item.wine_name}
  Quantité : ${item.quantity}
  Prix unitaire HT : ${formatPrice(item.unit_price)}
  Total ligne HT : ${formatPrice(item.total_price)}`;
    })
    .join("\n\n");

  const paymentLabel =
    selectedPaymentMethod === "bank_transfer"
      ? "Virement bancaire"
      : "Carte bancaire";

  const deliveryFeeLabel =
    selectedDeliveryMethod === "pickup" ? "Gratuit" : "À confirmer";

  const clientEmailResult = await resend.emails.send({
    from: emailFrom,
    to: customerEmail,
    subject: `Confirmation de commande - ${orderId}`,
    text: `Bonjour ${customerFirstName},

Nous vous remercions pour votre commande chez The Wine Watchers.

Numéro de commande :
${orderId}

Client :
${customerFirstName} ${customerLastName}
${companyName ? `Société : ${companyName}` : ""}
${vatNumber ? `N° TVA : ${vatNumber}` : ""}

Vins commandés :

${formattedItems}

Total HT vins :
${formatPrice(totalExclVat)}

TVA :
${formatPrice(vatAmount)}

Retrait / livraison :
${deliveryLabel}

${safeDeliveryNote}

Frais livraison :
${deliveryFeeLabel}

Total TTC / Total à payer :
${formatPrice(finalTotalToPay)}

Régime TVA :
${vatNote}

Mode de paiement :
${paymentLabel}

${
  bankTransferInstructions
    ? `Instructions de virement :

${bankTransferInstructions}`
    : ""
}

Notre équipe reste à votre disposition pour toute question.

The Wine Watchers SL`,
  });

  console.log("SEND_ORDER_EMAILS_CLIENT_RESULT:", clientEmailResult);

  const adminEmailResult = await resend.emails.send({
    from: emailFrom,
    to: adminEmail,
    subject: `Nouvelle commande reçue - ${orderId}`,
    text: `Nouvelle commande reçue sur The Wine Watchers.

Numéro de commande :
${orderId}

Client :
${customerFirstName} ${customerLastName}

Société :
${companyName || "-"}

N° TVA :
${vatNumber || "-"}

Email :
${customerEmail}

Téléphone :
${customerPhone}

Adresse :
${customerAddress || ""}
${customerPostalCode || ""} ${customerCity || ""}
${customerCountry || ""}

Commentaire :
${customerComment || "Aucun commentaire"}

Retrait / livraison :
${deliveryLabel}

${safeDeliveryNote}

Frais livraison :
${deliveryFeeLabel}

Total HT vins :
${formatPrice(totalExclVat)}

TVA :
${formatPrice(vatAmount)}

Total TTC / Total à payer :
${formatPrice(finalTotalToPay)}

Régime TVA :
${vatNote}

Mode de paiement :
${paymentLabel}

Vins commandés :

${formattedItems}`,
  });

  console.log("SEND_ORDER_EMAILS_ADMIN_RESULT:", adminEmailResult);

  console.log("SEND_ORDER_EMAILS_DONE:", orderId);
}