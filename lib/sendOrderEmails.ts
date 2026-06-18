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

export type SendOrderEmailsDiagnostic = {
  started: boolean;
  hasResendApiKey: boolean;
  emailFrom: string | null;
  adminEmail: string | null;
  customerEmail: string | null;
  clientEmailSent: boolean;
  adminEmailSent: boolean;
  clientResult?: unknown;
  adminResult?: unknown;
  error?: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

function formatPrice(value: number) {
  return Number(value || 0).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

function escapeHtml(value: string | null | undefined) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function nl2br(value: string | null | undefined) {
  return escapeHtml(value).replaceAll("\n", "<br />");
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
}: SendOrderEmailsParams): Promise<SendOrderEmailsDiagnostic> {
  const emailFrom =
    process.env.EMAIL_FROM || "The Wine Watchers <onboarding@resend.dev>";

  const adminEmail = process.env.ADMIN_EMAIL || "millesimesunited@gmail.com";

  const diagnostic: SendOrderEmailsDiagnostic = {
    started: true,
    hasResendApiKey: Boolean(process.env.RESEND_API_KEY),
    emailFrom,
    adminEmail,
    customerEmail,
    clientEmailSent: false,
    adminEmailSent: false,
  };

  try {
    const formattedItems = items
      .map((item) => {
        return `- ${item.wine_name}
  Quantité : ${item.quantity}
  Prix unitaire HT : ${formatPrice(item.unit_price)}
  Total ligne HT : ${formatPrice(item.total_price)}`;
      })
      .join("\n\n");

    const htmlItems = items
      .map((item) => {
        return `
          <tr>
            <td style="padding:10px; border-bottom:1px solid #e5e5e5;">${escapeHtml(
              item.wine_name
            )}</td>
            <td style="padding:10px; border-bottom:1px solid #e5e5e5; text-align:center;">${
              item.quantity
            }</td>
            <td style="padding:10px; border-bottom:1px solid #e5e5e5; text-align:right;">${formatPrice(
              item.unit_price
            )}</td>
            <td style="padding:10px; border-bottom:1px solid #e5e5e5; text-align:right;">${formatPrice(
              item.total_price
            )}</td>
          </tr>`;
      })
      .join("");

    const paymentLabel =
      selectedPaymentMethod === "bank_transfer"
        ? "Virement bancaire"
        : "Carte bancaire";

    const deliveryFeeLabel =
      selectedDeliveryMethod === "pickup" ? "Gratuit" : "À confirmer";

    const clientResult = await resend.emails.send({
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
      html: `
<div style="font-family: Arial, sans-serif; background:#f7f3ee; padding:24px; color:#1f1f1f;">
  <div style="max-width:720px; margin:0 auto; background:#ffffff; padding:28px; border-radius:10px;">
    <div style="text-align:center; margin-bottom:28px;">
      <img
        src="https://www.thewinewatchers.com/images/logo-tww.jpg"
        alt="The Wine Watchers"
        style="max-width:180px; height:auto;"
      />
    </div>

    <h1 style="font-size:22px; text-align:center; color:#170606; margin-bottom:24px;">
      Confirmation de commande
    </h1>

    <p>Bonjour ${escapeHtml(customerFirstName)},</p>

    <p>Nous vous remercions pour votre commande chez <strong>The Wine Watchers</strong>.</p>

    <p><strong>Numéro de commande :</strong><br />${escapeHtml(orderId)}</p>

    <h2 style="font-size:18px; color:#170606; margin-top:28px;">Client</h2>
    <p>
      ${escapeHtml(customerFirstName)} ${escapeHtml(customerLastName)}<br />
      ${companyName ? `Société : ${escapeHtml(companyName)}<br />` : ""}
      ${vatNumber ? `N° TVA : ${escapeHtml(vatNumber)}<br />` : ""}
    </p>

    <h2 style="font-size:18px; color:#170606; margin-top:28px;">Vins commandés</h2>

    <table style="width:100%; border-collapse:collapse; font-size:14px;">
      <thead>
        <tr>
          <th style="padding:10px; border-bottom:2px solid #170606; text-align:left;">Vin</th>
          <th style="padding:10px; border-bottom:2px solid #170606; text-align:center;">Qté</th>
          <th style="padding:10px; border-bottom:2px solid #170606; text-align:right;">Prix HT</th>
          <th style="padding:10px; border-bottom:2px solid #170606; text-align:right;">Total HT</th>
        </tr>
      </thead>
      <tbody>
        ${htmlItems}
      </tbody>
    </table>

    <h2 style="font-size:18px; color:#170606; margin-top:28px;">Récapitulatif</h2>

    <p>
      <strong>Total HT vins :</strong> ${formatPrice(totalExclVat)}<br />
      <strong>TVA :</strong> ${formatPrice(vatAmount)}<br />
      <strong>Retrait / livraison :</strong> ${escapeHtml(deliveryLabel)}<br />
      ${safeDeliveryNote ? `${nl2br(safeDeliveryNote)}<br />` : ""}
      <strong>Frais livraison :</strong> ${escapeHtml(deliveryFeeLabel)}<br />
      <strong>Total TTC / Total à payer :</strong> ${formatPrice(finalTotalToPay)}
    </p>

    <p>
      <strong>Régime TVA :</strong><br />
      ${nl2br(vatNote)}
    </p>

    <p>
      <strong>Mode de paiement :</strong><br />
      ${escapeHtml(paymentLabel)}
    </p>

    ${
      bankTransferInstructions
        ? `<p><strong>Instructions de virement :</strong><br />${nl2br(
            bankTransferInstructions
          )}</p>`
        : ""
    }

    <p style="margin-top:28px;">
      Notre équipe reste à votre disposition pour toute question.
    </p>

    <p style="margin-top:28px;">
      Bien cordialement,<br />
      <strong>The Wine Watchers SL</strong>
    </p>
  </div>
</div>`,
    });

    diagnostic.clientResult = clientResult;
    diagnostic.clientEmailSent = !clientResult.error;

    const adminResult = await resend.emails.send({
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

    diagnostic.adminResult = adminResult;
    diagnostic.adminEmailSent = !adminResult.error;

    if (clientResult.error || adminResult.error) {
      diagnostic.error = JSON.stringify({
        clientError: clientResult.error || null,
        adminError: adminResult.error || null,
      });
    }

    return diagnostic;
  } catch (error) {
    diagnostic.error = error instanceof Error ? error.message : String(error);
    console.error("Erreur envoi emails commande Resend :", error);
    return diagnostic;
  }
}