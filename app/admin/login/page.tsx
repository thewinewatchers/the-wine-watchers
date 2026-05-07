"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function seConnecter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("Connexion impossible. Vérifie l’email et le mot de passe.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #16080b, #2b0f16)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: "Georgia, serif",
        color: "#fffaf3",
      }}
    >
      <form
        onSubmit={seConnecter}
        style={{
          width: "100%",
          maxWidth: 460,
          background: "#fffaf3",
          color: "#1f1a17",
          borderRadius: 32,
          padding: 34,
          display: "grid",
          gap: 18,
        }}
      >
        <p
          style={{
            letterSpacing: 5,
            textTransform: "uppercase",
            color: "#9b6a24",
            fontSize: 13,
            margin: 0,
          }}
        >
          Accès sécurisé
        </p>

        <h1 style={{ margin: 0, fontSize: 42 }}>Admin</h1>

        <input
          type="email"
          required
          placeholder="Email admin"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          required
          placeholder="Mot de passe"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          style={inputStyle}
        />

        {message && (
          <p style={{ color: "#8b0000", lineHeight: 1.5 }}>{message}</p>
        )}

        <button
          type="submit"
          style={{
            padding: "15px 24px",
            borderRadius: 999,
            border: "none",
            background: "#1f1a17",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Se connecter
        </button>
      </form>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 16,
  border: "1px solid #d8cbbb",
  fontFamily: "Georgia, serif",
  fontSize: 16,
};