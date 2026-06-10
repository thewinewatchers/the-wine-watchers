"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setMessage("Merci d’indiquer une adresse e-mail valide.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          source: "home",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Erreur lors de l’inscription. Merci de réessayer.");
      } else {
        setEmail("");
        setMessage("Merci, votre inscription est bien enregistrée. Un email de bienvenue vient de vous être envoyé.");
      }
    } catch {
      setMessage("Erreur lors de l’inscription. Merci de réessayer.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 28 }}>
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          type="email"
          placeholder="Votre adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            minWidth: 280,
            padding: "16px 18px",
            borderRadius: 999,
            border: "1px solid rgba(214,179,106,0.7)",
            fontSize: 16,
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "16px 28px",
            borderRadius: 999,
            border: "none",
            background: "#d6b36a",
            color: "#1f1a17",
            fontWeight: "bold",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          {loading ? "Inscription..." : "S’inscrire"}
        </button>
      </div>

      {message && (
        <p style={{ marginTop: 16, color: "#fffaf3", fontSize: 15 }}>
          {message}
        </p>
      )}
    </form>
  );
}