import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { supabase } from "@/lib/supabaseClient";

function formatPrice(value?: number | string | null) {
  const numberValue = Number(value || 0);

  return numberValue.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

function formatDate(value?: string) {
  if (!value) return "";

  return new Date(value).toLocaleDateString("fr-FR", {
    dateStyle: "medium",
  });
}

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const params = await context.params;
    const orderId = String(params.id || "").trim();

    if (!orderId) {
      return NextResponse.json(
        { error: "Commande introuvable." },
        { status: 404 }
      );
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();

    if (orderError) {
      console.error("Erreur lecture commande PDF :", orderError);

      return NextResponse.json(
        {
          error: "Erreur Supabase lors de la lecture de la commande.",
          details: orderError.message,
        },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json(
        {
          error: "Commande non trouvée.",
          searchedId: orderId,
        },
        { status: 404 }
      );
    }

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (itemsError) {
      console.error("Erreur lecture lignes PDF :", itemsError);

      return NextResponse.json(
        {
          error: "Impossible de charger les lignes de commande.",
          details: itemsError.message,
        },
        { status: 500 }
      );
    }

    const doc = new jsPDF({
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 210;
    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("THE WINE WATCHERS", 15, y);

    y += 10;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Devis / Confirmation de commande", 15, y);

    y += 8;

    doc.text(`Commande : ${order.id}`, 15, y);

    y += 6;

    doc.text(`Date : ${formatDate(order.created_at)}`, 15, y);

    y += 14;

    doc.setFont("helvetica", "bold");
    doc.text("Client", 15, y);

    y += 7;

    doc.setFont("helvetica", "normal");
    doc.text(`${order.customer_first_name} ${order.customer_last_name}`, 15, y);

    y += 6;

    if (order.customer_email) {
      doc.text(order.customer_email, 15, y);
      y += 6;
    }

    if (order.customer_phone) {
      doc.text(order.customer_phone, 15, y);
      y += 6;
    }

    if (order.customer_address) {
      doc.text(order.customer_address, 15, y);
      y += 6;
    }

    const cityLine = [
      order.customer_postal_code || "",
      order.customer_city || "",
      order.customer_country || "",
    ]
      .filter(Boolean)
      .join(" ");

    if (cityLine) {
      doc.text(cityLine, 15, y);
      y += 10;
    }

    doc.setFont("helvetica", "bold");
    doc.text("Vins commandés", 15, y);

    y += 10;

    doc.setFont("helvetica", "normal");

    (items || []).forEach((item: any, index: number) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.text(`${index + 1}. ${item.wine_name}`, 15, y);

      y += 6;

      doc.setFont("helvetica", "normal");

      const details = [
        item.producer,
        item.appellation,
        item.vintage ? `Millésime ${item.vintage}` : null,
        item.bottle_size,
        item.packaging,
      ]
        .filter(Boolean)
        .join(" • ");

      if (details) {
        const detailLines = doc.splitTextToSize(details, pageWidth - 35);
        doc.text(detailLines, 20, y);
        y += detailLines.length * 6;
      }

      doc.text(`Quantité : ${item.quantity}`, 20, y);
      y += 6;

      doc.text(`Prix unitaire HT : ${formatPrice(item.unit_price)}`, 20, y);
      y += 6;

      doc.text(`Total ligne HT : ${formatPrice(item.total_price)}`, 20, y);
      y += 10;
    });

    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    y += 5;

    doc.setFont("helvetica", "bold");
    doc.text("Totaux", 15, y);

    y += 8;

    doc.setFont("helvetica", "normal");

    doc.text(`Total HT : ${formatPrice(order.total_excl_vat)}`, 15, y);
    y += 7;

    doc.text(`TVA : ${formatPrice(order.vat_amount)}`, 15, y);
    y += 7;

    doc.setFont("helvetica", "bold");
    doc.text(
      `Total TTC à payer : ${formatPrice(
        order.total_incl_vat || order.total_amount
      )}`,
      15,
      y
    );

    y += 12;

    doc.setFont("helvetica", "normal");

    if (order.vat_note) {
      const vatLines = doc.splitTextToSize(
        `Régime TVA : ${order.vat_note}`,
        pageWidth - 30
      );

      doc.text(vatLines, 15, y);
      y += vatLines.length * 6 + 4;
    }

    if (order.customer_comment) {
      const commentLines = doc.splitTextToSize(
        `Commentaire / livraison : ${order.customer_comment}`,
        pageWidth - 30
      );

      doc.text(commentLines, 15, y);
      y += commentLines.length * 6 + 4;
    }

    if (order.payment_method === "bank_transfer") {
      if (y > 210) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.text("Paiement par virement bancaire", 15, y);

      y += 8;

      doc.setFont("helvetica", "normal");

      const bankLines = doc.splitTextToSize(
        order.bank_transfer_instructions ||
          "Les coordonnées bancaires seront communiquées séparément.",
        pageWidth - 30
      );

      doc.text(bankLines, 15, y);
      y += bankLines.length * 6 + 4;
    }

    if (y > 250) {
      doc.addPage();
    }

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");

    doc.text(
      "Document généré automatiquement par The Wine Watchers. Ce document constitue une confirmation/devis et ne remplace pas une facture officielle numérotée.",
      15,
      280,
      { maxWidth: 180 }
    );

    const pdfArrayBuffer = doc.output("arraybuffer");

    return new NextResponse(pdfArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="devis-${order.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Erreur génération PDF commande :", error);

    return NextResponse.json(
      {
        error: "Erreur serveur lors de la génération du PDF.",
      },
      { status: 500 }
    );
  }
}