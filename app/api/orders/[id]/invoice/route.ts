import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { supabase } from "@/lib/supabaseClient";
import fs from "fs";
import path from "path";

function formatPrice(value?: number | string | null) {
  const numberValue = Number(value || 0);

  return `${numberValue
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")} EUR`;
}

function formatDate(value?: string) {
  if (!value) return "";

  return new Date(value).toLocaleDateString("fr-FR", {
    dateStyle: "medium",
  });
}

function todayInvoicePrefix() {
  const now = new Date();
  return `F-${now.getFullYear()}`;
}

async function getOrCreateInvoice(order: any) {
  const { data: existingInvoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("order_id", order.id)
    .maybeSingle();

  if (existingInvoice) return existingInvoice;

  const prefix = todayInvoicePrefix();

  const { count } = await supabase
    .from("invoices")
    .select("id", { count: "exact", head: true });

  const nextNumber = String((count || 0) + 1).padStart(5, "0");
  const invoiceNumber = `${prefix}-${nextNumber}`;

  const { data: newInvoice, error } = await supabase
    .from("invoices")
    .insert({
      order_id: order.id,
      invoice_number: invoiceNumber,
      customer_email: order.customer_email,
      total_excl_vat: Number(order.total_excl_vat || 0),
      vat_amount: Number(order.vat_amount || 0),
      total_incl_vat: Number(order.total_incl_vat || order.total_amount || 0),
      status: "issued",
    })
    .select("*")
    .single();

  if (error) throw error;

  return newInvoice;
}

function addLogo(doc: jsPDF) {
  try {
    const pngPath = path.join(process.cwd(), "public", "logo.png");
    const jpgPath = path.join(process.cwd(), "public", "logo.jpg");

    if (fs.existsSync(pngPath)) {
      const logoBase64 = fs.readFileSync(pngPath).toString("base64");

      doc.addImage(
        `data:image/png;base64,${logoBase64}`,
        "PNG",
        15,
        10,
        55,
        16
      );

      return;
    }

    if (fs.existsSync(jpgPath)) {
      const logoBase64 = fs.readFileSync(jpgPath).toString("base64");

      doc.addImage(
        `data:image/jpeg;base64,${logoBase64}`,
        "JPEG",
        15,
        10,
        55,
        16
      );

      return;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("THE WINE WATCHERS", 15, 20);
  } catch (error) {
    console.error("Erreur logo facture :", error);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("THE WINE WATCHERS", 15, 20);
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
      return NextResponse.json(
        {
          error: "Impossible de charger les lignes de commande.",
          details: itemsError.message,
        },
        { status: 500 }
      );
    }

    const invoice = await getOrCreateInvoice(order);

    const doc = new jsPDF({
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 210;
    let y = 16;

    addLogo(doc);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("FACTURE", 150, y);

    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`N° facture : ${invoice.invoice_number}`, 150, y);

    y += 5;
    doc.text(`Date : ${formatDate(invoice.invoice_date)}`, 150, y);

    y = 38;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Commande liée", 15, y);

    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(order.id, 15, y);

    y += 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("The Wine Watchers SL", 15, y);

    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Société de négoce de grands vins", 15, y);

    y += 5;
    doc.text("Espagne", 15, y);

    y += 12;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Client", 15, y);

    y += 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`${order.customer_first_name} ${order.customer_last_name}`, 15, y);

    y += 5;

    if (order.customer_email) {
      doc.text(order.customer_email, 15, y);
      y += 5;
    }

    if (order.customer_phone) {
      doc.text(order.customer_phone, 15, y);
      y += 5;
    }

    if (order.customer_address) {
      doc.text(order.customer_address, 15, y);
      y += 5;
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
    doc.setFontSize(11);
    doc.text("Détail des vins facturés", 15, y);

    y += 8;

    doc.setFontSize(8);
    doc.text("Description", 15, y);
    doc.text("Qté", 118, y);
    doc.text("PU HT", 138, y);
    doc.text("Total HT", 170, y);

    y += 3;
    doc.line(15, y, 195, y);
    y += 6;

    (items || []).forEach((item: any) => {
      if (y > 245) {
        doc.addPage();
        y = 18;
      }

      const title = item.wine_name || "Vin sélectionné";

      const details = [
        item.producer,
        item.appellation,
        item.vintage ? `Millésime ${item.vintage}` : null,
        item.bottle_size,
        item.packaging,
      ]
        .filter(Boolean)
        .join(" • ");

      const description = details ? `${title} — ${details}` : title;
      const descriptionLines = doc.splitTextToSize(description, 95);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);

      doc.text(descriptionLines, 15, y);
      doc.text(String(item.quantity || 1), 118, y);
      doc.text(formatPrice(item.unit_price), 138, y);
      doc.text(formatPrice(item.total_price), 170, y);

      y += Math.max(descriptionLines.length * 4.5, 7);
    });

    y += 4;

    if (y > 225) {
      doc.addPage();
      y = 18;
    }

    doc.line(118, y, 195, y);
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text("Total HT", 125, y);
    doc.text(formatPrice(invoice.total_excl_vat), 170, y);

    y += 6;

    doc.text("TVA", 125, y);
    doc.text(formatPrice(invoice.vat_amount), 170, y);

    y += 6;

    doc.setFont("helvetica", "bold");
    doc.text("Total TTC", 125, y);
    doc.text(formatPrice(invoice.total_incl_vat), 170, y);

    y += 12;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);

    if (order.vat_note) {
      const vatLines = doc.splitTextToSize(
        `Régime TVA : ${order.vat_note}`,
        pageWidth - 30
      );

      doc.text(vatLines, 15, y);
      y += vatLines.length * 4.5 + 3;
    }

    const shortDeliveryNote =
      order.customer_comment &&
      String(order.customer_comment).includes("Mode retrait / livraison")
        ? "Livraison / retrait : voir conditions confirmées lors de la commande."
        : "";

    if (shortDeliveryNote) {
      const deliveryLines = doc.splitTextToSize(
        shortDeliveryNote,
        pageWidth - 30
      );

      doc.text(deliveryLines, 15, y);
      y += deliveryLines.length * 4.5 + 3;
    }

    if (order.payment_method === "bank_transfer") {
      const paymentLines = doc.splitTextToSize(
        "Mode de paiement : virement bancaire.",
        pageWidth - 30
      );

      doc.text(paymentLines, 15, y);
      y += paymentLines.length * 4.5 + 3;
    }

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");

    doc.text(
      "Facture générée automatiquement par The Wine Watchers. Merci de conserver ce document pour votre comptabilité.",
      15,
      280,
      { maxWidth: 180 }
    );

    const pdfArrayBuffer = doc.output("arraybuffer");

    return new NextResponse(pdfArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="facture-${invoice.invoice_number}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Erreur génération facture PDF :", error);

    return NextResponse.json(
      {
        error: "Erreur serveur lors de la génération de la facture PDF.",
      },
      { status: 500 }
    );
  }
}