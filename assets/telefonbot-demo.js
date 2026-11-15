import { Conversation } from "https://esm.sh/@elevenlabs/client";

const AGENT_ID = "agent_7601m7fppz6sfpeaxfcmnc63hvp9";
const btn = document.getElementById("pex-demo-btn");
const statusEl = document.getElementById("pex-demo-status");
let conv = null;

const setStatus = (t) => {
  if (statusEl) statusEl.textContent = t;
};

// Demo-Tools: werden vom Agenten aufgerufen, tun nichts Echtes.
const clientTools = {
  demo_termin_buchen: ({ name, zeitfenster }) =>
    JSON.stringify({
      status: "demo_gebucht",
      name,
      zeitfenster,
      hinweis: "Demo, kein echter Kalendereintrag",
    }),
  demo_weiterleitung: ({ grund }) =>
    JSON.stringify({ status: "demo_uebergabe_angekuendigt", grund }),
};

if (btn) {
  btn.addEventListener("click", async () => {
    if (conv) {
      await conv.endSession();
      return;
    }
    try {
      btn.disabled = true;
      setStatus("Mikrofon wird freigegeben …");
      await navigator.mediaDevices.getUserMedia({ audio: true });
      conv = await Conversation.startSession({
        agentId: AGENT_ID,
        connectionType: "webrtc",
        clientTools,
        onConnect: () => {
          btn.textContent = "Gespräch beenden";
          btn.disabled = false;
          setStatus("Verbunden – sprechen Sie einfach los.");
        },
        onModeChange: ({ mode }) =>
          setStatus(mode === "speaking" ? "Jonas spricht …" : "Jonas hört zu …"),
        onDisconnect: () => {
          conv = null;
          btn.textContent = "Jetzt testen";
          btn.disabled = false;
          setStatus("Gespräch beendet. Danke fürs Testen!");
        },
        onError: () =>
          setStatus(
            "Verbindung nicht möglich. Bitte später erneut versuchen (Tageslimit oder Netzwerk)."
          ),
      });
    } catch (e) {
      conv = null;
      btn.disabled = false;
      setStatus("Ohne Mikrofon-Freigabe ist kein Test möglich.");
    }
  });
}
