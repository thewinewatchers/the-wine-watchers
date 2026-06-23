import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { existsSync, readFileSync } from "fs";
import path from "path";
import { supabase } from "@/lib/supabaseClient";

export const runtime = "nodejs";

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

function getInvoiceNumber(order: any) {
  const year = order?.created_at
    ? new Date(order.created_at).getFullYear()
    : new Date().getFullYear();

  return `TWW-${year}-${String(order?.id || "").slice(0, 8).toUpperCase()}`;
}

function getLogoData() {
  const possibleFiles = [
    "public/logo.png",
    "public/logo.jpg",
    "public/logo.jpeg",
    "public/images/logo.png",
    "public/images/logo.jpg",
    "public/images/logo.jpeg",
    "public/logo-tww.png",
    "public/favicon-tww.png",
  ];

  for (const file of possibleFiles) {
    const absolutePath = path.join(process.cwd(), file);

    if (existsSync(absolutePath)) {
      const extension = path.extname(file).toLowerCase();
      const mime =
        extension === ".jpg" || extension === ".jpeg"
          ? "image/jpeg"
          : "image/png";

      const base64 = readFileSync(absolutePath).toString("base64");

      return {
        dataUrl: `data:${mime};base64,${base64}`,
        format: mime === "image/jpeg" ? "JPEG" : "PNG",
      };
    }
  }

  return null;
}

function addFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();

  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      "The Wine Watchers SL - contact@thewinewatchers.com - www.thewinewatchers.com",
      15,
      282,
      { maxWidth: 180 }
    );
    doc.text(`Page ${page}/${pageCount}`, 180, 282);
  }
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

    const invoiceNumber = getInvoiceNumber(order);
    const logo = getLogoData();

    const doc = new jsPDF({
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 210;
    let y = 18;

    if (logo) {
      try {
        doc.addImage(logo.dataUrl, logo.format, 15, 12, 28, 28);
      } catch (error) {
        console.error("Logo PDF non ajouté :", error);
      }
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("FACTURE", 135, y);

    y += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Facture n° ${invoiceNumber}`, 135, y);

    y += 6;
    doc.text(`Date : ${formatDate(order.created_at)}`, 135, y);

    y = 45;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("The Wine Watchers SL", 15, y);

    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("www.thewinewatchers.com", 15, y);
    y += 5;
    doc.text("contact@thewinewatchers.com", 15, y);

    y += 12;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Client", 15, y);

    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`${order.customer_first_name || ""} ${order.customer_last_name || ""}`, 15, y);

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
      y += 8;
    }

    y += 4;

    doc.setFont("helvetica", "bold");
    doc.text("Référence commande", 15, y);

    y += 6;

    doc.setFont("helvetica", "normal");
    doc.text(order.id, 15, y);

    y += 12;

    doc.setDrawColor(220, 210, 195);
    doc.line(15, y, 195, y);

    y += 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Désignation", 15, y);
    doc.text("Qté", 126, y);
    doc.text("PU HT", 142, y);
    doc.text("Total HT", 168, y);

    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    (items || []).forEach((item: any, index: number) => {
      if (y > 245) {
        doc.addPage();
        y = 20;
      }

      const title = `${index + 1}. ${item.wine_name || "Vin"}`;

      const details = [
        item.producer,
        item.appellation,
        item.vintage ? `Millésime ${item.vintage}` : null,
        item.bottle_size,
        item.packaging,
      ]
        .filter(Boolean)
        .join(" • ");

      const designationLines = doc.splitTextToSize(
        details ? `${title}\n${details}` : title,
        105
      );

      doc.text(designationLines, 15, y);
      doc.text(String(item.quantity || 0), 126, y);
      doc.text(formatPrice(item.unit_price), 142, y);
      doc.text(formatPrice(item.total_price), 168, y);

      y += Math.max(12, designationLines.length * 5 + 4);
    });

    if (y > 225) {
      doc.addPage();
      y = 20;
    }

    y += 5;

    doc.setDrawColor(220, 210, 195);
    doc.line(15, y, 195, y);

    y += 10;

    const totalExclVat = order.total_excl_vat || order.total_amount || 0;
    const vatAmount = order.vat_amount || 0;
    const totalInclVat = order.total_incl_vat || order.total_amount || 0;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text("Total HT", 130, y);
    doc.text(formatPrice(totalExclVat), 168, y);

    y += 7;

    doc.text("TVA", 130, y);
    doc.text(formatPrice(vatAmount), 168, y);

    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Total TTC", 130, y);
    doc.text(formatPrice(totalInclVat), 168, y);

    y += 14;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    if (order.vat_note) {
      const vatLines = doc.splitTextToSize(
        `Régime TVA : ${order.vat_note}`,
        pageWidth - 30
      );

      doc.text(vatLines, 15, y);
      y += vatLines.length * 5 + 4;
    }

    if (order.payment_method === "bank_transfer") {
      if (y > 230) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.text("Paiement par virement bancaire", 15, y);

      y += 6;

      doc.setFont("helvetica", "normal");

      const bankLines = doc.splitTextToSize(
        order.bank_transfer_instructions ||
          "Les coordonnées bancaires seront communiquées séparément.",
        pageWidth - 30
      );

      doc.text(bankLines, 15, y);
      y += bankLines.length * 5 + 4;
    }

    if (order.customer_comment) {
      if (y > 235) {
        doc.addPage();
        y = 20;
      }

      const commentLines = doc.splitTextToSize(
        `Commentaire / livraison : ${order.customer_comment}`,
        pageWidth - 30
      );

      doc.text(commentLines, 15, y);
      y += commentLines.length * 5 + 4;
    }

    if (y > 245) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Facture générée automatiquement par The Wine Watchers. Merci de conserver ce document.",
      15,
      y + 8,
      { maxWidth: 180 }
    );

    addFooter(doc);

    const pdfArrayBuffer = doc.output("arraybuffer");

    return new NextResponse(pdfArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="facture-${invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Erreur génération PDF facture :", error);

    return NextResponse.json(
      {
        error: "Erreur serveur lors de la génération du PDF.",
      },
      { status: 500 }
    );
  }
}