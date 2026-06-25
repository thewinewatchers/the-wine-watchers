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

const EMAIL_FROM = "The Wine Watchers <contact@thewinewatchers.com>";
const ADMIN_EMAIL = "contact@thewinewatchers.com";

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

function getDeliveryFeeLabel({
  selectedDeliveryMethod,
  safeDeliveryNote,
}: {
  selectedDeliveryMethod: "pickup" | "delivery";
  safeDeliveryNote: string;
}) {
  if (selectedDeliveryMethod === "pickup") {
    return "Gratuit";
  }

  if (
    safeDeliveryNote.toLowerCase().includes("libération des vins") ||
    safeDeliveryNote.toLowerCase().includes("aucun frais de livraison")
  ) {
    return "0,00 € HT";
  }

  const match = safeDeliveryNote.match(/Frais de livraison HT\s*:\s*([^\n.]+)/i);

  if (match?.[1]) {
    return `${match[1].trim()} HT`;
  }

  return "Nous contacter";
}

function logResendResult(label: string, result: unknown) {
  console.log(`===== RESEND ${label} RESULT =====`);
  console.log(JSON.stringify(result, null, 2));
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
  const emailFrom = EMAIL_FROM;
  const adminEmail = ADMIN_EMAIL;

  const diagnostic: SendOrderEmailsDiagnostic = {
    started: true,
    hasResendApiKey: Boolean(process.env.RESEND_API_KEY),
    emailFrom,
    adminEmail,
    customerEmail,
    clientEmailSent: false,
    adminEmailSent: false,
  };

  console.log("===== SEND ORDER EMAILS START =====");
  console.log(
    JSON.stringify(
      {
        orderId,
        hasResendApiKey: diagnostic.hasResendApiKey,
        emailFrom,
        adminEmail,
        customerEmail,
      },
      null,
      2
    )
  );

  try {
    const winesTotalExclVat = items.reduce(
      (sum, item) => sum + Number(item.total_price || 0),
      0
    );

    const deliveryFeeLabel = getDeliveryFeeLabel({
      selectedDeliveryMethod,
      safeDeliveryNote,
    });

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
${formatPrice(winesTotalExclVat)}

Retrait / livraison :
${deliveryLabel}

${safeDeliveryNote}

Frais livraison :
${deliveryFeeLabel}

Total HT commande :
${formatPrice(totalExclVat)}

TVA :
${formatPrice(vatAmount)}

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
          <th style="padding:10px;border-bottom:2px solid #170606;text-align:left;">Vin</th>
          <th style="padding:10px;border-bottom:2px solid #170606;text-align:center;">Qté</th>
          <th style="padding:10px;border-bottom:2px solid #170606;text-align:right;">Prix HT</th>
          <th style="padding:10px;border-bottom:2px solid #170606;text-align:right;">Total HT</th>
        </tr>
      </thead>
      <tbody>
        ${htmlItems}
      </tbody>
    </table>

    <h2 style="font-size:18px;color:#170606;margin-top:28px;">Récapitulatif</h2>

    <p>
      <strong>Total HT vins :</strong> ${formatPrice(winesTotalExclVat)}<br />
      <strong>Retrait / livraison :</strong> ${escapeHtml(deliveryLabel)}<br />
      ${safeDeliveryNote ? `${nl2br(safeDeliveryNote)}<br />` : ""}
      <strong>Frais livraison :</strong> ${escapeHtml(deliveryFeeLabel)}<br />
      <strong>Total HT commande :</strong> ${formatPrice(totalExclVat)}<br />
      <strong>TVA :</strong> ${formatPrice(vatAmount)}<br />
      <strong>Total TTC :</strong> ${formatPrice(finalTotalToPay)}
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

  </div>
</div>`,
    });

    logResendResult("CLIENT", clientResult);

    diagnostic.clientResult = clientResult;
    diagnostic.clientEmailSent = !(clientResult as any)?.error;

    const adminResult = await resend.emails.send({
      from: emailFrom,
      to: adminEmail,
      subject: `Nouvelle commande reçue - ${orderId}`,
      text: `Nouvelle commande reçue sur The Wine Watchers.

Commande : ${orderId}

Client :
${customerFirstName} ${customerLastName}

Email :
${customerEmail}

Téléphone :
${customerPhone}

${formattedItems}

Livraison :
${deliveryLabel}

${safeDeliveryNote}

Frais livraison :
${deliveryFeeLabel}

Total HT commande :
${formatPrice(totalExclVat)}

TVA :
${formatPrice(vatAmount)}

Total TTC :
${formatPrice(finalTotalToPay)}
`,
    });

    logResendResult("ADMIN", adminResult);

    diagnostic.adminResult = adminResult;
    diagnostic.adminEmailSent = !(adminResult as any)?.error;

    if ((clientResult as any)?.error || (adminResult as any)?.error) {
      diagnostic.error = JSON.stringify(
        {
          client: (clientResult as any)?.error,
          admin: (adminResult as any)?.error,
        },
        null,
        2
      );

      console.error("===== RESEND ERROR =====");
      console.error(diagnostic.error);
    }

    console.log("===== SEND ORDER EMAILS END =====");
    console.log(JSON.stringify(diagnostic, null, 2));

    return diagnostic;
  } catch (error) {
    console.error("===== SEND ORDER EMAILS EXCEPTION =====");
    console.error(error);

    diagnostic.error =
      error instanceof Error ? error.message : String(error);

    return diagnostic;
  }
}