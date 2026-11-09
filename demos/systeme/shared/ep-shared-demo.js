/*! PROJEKT EX · gemeinsamer Beispieldatenbestand für Systeme-Demos
 *  Alle Werte sind erfunden. beispieldaten: true. Keine echten Konten. */
(function (global) {
  const DEMO = {
    schema: "projekt-ex/systeme-demo/1",
    beispieldaten: true,
    label: "ENTWURF · BEISPIELDATEN",
    hinweis: "Alle Zahlen, Kommentare und Leads sind erfunden – so könnte dein System aussehen.",
    generated_at: "2026-11-09T03:56:00+01:00",
    brand: "PROJEKT EX",
    ranges: {
      "7": { label: "7 Tage", days: 7 },
      "30": { label: "30 Tage", days: 30 },
      "90": { label: "90 Tage", days: 90 }
    },
    systems: {
      paketstadt3d: {
        id: "paketstadt3d",
        name: "Paketstadt 3D",
        kind: "Versand & Ablauf",
        href: "../paketstadt3d/?style=A",
        kpi: { ordersToday: 186, inTransit: 42, delivered: 128, returns: 6 },
        meta: "Bestellungen wandern durch die Stadt"
      },
      shopRaum: {
        id: "shop-raum",
        name: "Shop-Raum",
        kind: "Umsatz-Dashboard",
        href: "../shop-raum/",
        kpi: { revenueToday: 12840, topProduct: "Keramikbecher", exceptions: 3 },
        meta: "Umsatz, Top-Produkte, Ausnahmen"
      },
      lager: {
        id: "paketstadt",
        name: "Lager & Bestände",
        kind: "Warenwirtschaft",
        href: "../paketstadt/",
        kpi: { skus: 248, lowStock: 11, reorder: 4 },
        meta: "Bestände und Nachbestellungen"
      },
      personal: {
        id: "personal",
        name: "Team & Dienstplan",
        kind: "Personal",
        href: "../personal/",
        kpi: { onDuty: 14, absent: 2, openShifts: 1 },
        meta: "Wer ist da, wer fehlt"
      },
      problemCenter: {
        id: "problem-center",
        name: "Problem-Center",
        kind: "Ausnahmen",
        href: "../problem-center/",
        kpi: { open: 7, critical: 2, resolvedToday: 5 },
        meta: "Was heute klemmt"
      },
      bots: {
        id: "bots",
        name: "Bots",
        kind: "Chat & Telefon",
        href: "../bots/",
        kpi: { chat: 134, phone: 92, handoff: 18 },
        meta: "Sofort-Meldungen und Übergaben"
      },
      chatbot: {
        id: "chatbot",
        name: "Website-Chat",
        kind: "Chatbot",
        href: "../chatbot/",
        kpi: { conversations: 134, leads: 27 },
        meta: "Fragen rund um die Uhr"
      },
      social: {
        id: "social",
        name: "Social Media",
        kind: "Kanäle & Ads",
        href: "../social/",
        kpi: { followers: 18420, reach: 96200, adSpend: 1280, leads: 38 },
        meta: "Kanäle & Ads im Kundensystem (Beispieldaten)"
      },
      dashboard: {
        id: "dashboard",
        name: "Systeme-Dashboard",
        kind: "Zentrale",
        href: "../dashboard/",
        kpi: { systems: 8, demoLinks: 9 },
        meta: "Alles auf einen Blick"
      }
    },
    socialLeads: [
      {
        id: "lead-ig-1042",
        channel: "instagram",
        name: "Mara L. (Beispiel)",
        interest: "Website + Terminbot",
        created_at: "2026-11-08T14:22:00+01:00",
        status: "neu",
        paketstadtOrderId: "ORD-78421",
        note: "Beispiel-Lead aus Instagram-Anzeige → Shop-Auftrag im Beispiel-Shop"
      },
      {
        id: "lead-tt-881",
        channel: "tiktok",
        name: "Jonas W. (Beispiel)",
        interest: "Shop-Anbindung",
        created_at: "2026-11-07T19:05:00+01:00",
        status: "in_arbeit",
        paketstadtOrderId: "ORD-78390",
        note: "Beispiel-Lead aus TikTok-Spark-Ad → Shop-Auftrag"
      },
      {
        id: "lead-yt-552",
        channel: "youtube",
        name: "Studio Nord (Beispiel)",
        interest: "Erklärvideo + Ads",
        created_at: "2026-11-06T11:40:00+01:00",
        status: "bestätigt",
        paketstadtOrderId: "ORD-78311",
        note: "Beispiel-Lead aus YouTube-Kampagne → Shop-Auftrag"
      },
      {
        id: "lead-gg-301",
        channel: "google",
        name: "Café Elster (Beispiel)",
        interest: "Lokale Suche + Landingpage",
        created_at: "2026-11-05T09:18:00+01:00",
        status: "abgeschlossen",
        paketstadtOrderId: "ORD-78255",
        note: "Beispiel-Lead aus Google Ads → Shop-Auftrag"
      }
    ],
    channels: {
      instagram: {
        id: "instagram",
        name: "Instagram",
        handle: "@projektex.beispiel",
        status: "nicht_verbunden",
        statusLabel: "Nicht verbunden – Beispieldaten",
        color: "#0071e3",
        organic: {
          "7":  { followers: 6120, reach: 18400, views: 22100, likes: 1480, comments: 126, shares: 94, growth: 1.4 },
          "30": { followers: 6120, reach: 68400, views: 81200, likes: 5420, comments: 418, shares: 310, growth: 4.8 },
          "90": { followers: 6120, reach: 186000, views: 224000, likes: 15200, comments: 1120, shares: 860, growth: 12.6 }
        },
        ads: {
          "7":  { spend: 180, impressions: 42000, clicks: 980, ctr: 2.33, cpc: 0.18, leads: 6, conversions: 4, roas: 3.1 },
          "30": { spend: 640, impressions: 168000, clicks: 3720, ctr: 2.21, cpc: 0.17, leads: 22, conversions: 15, roas: 2.9 },
          "90": { spend: 1680, impressions: 490000, clicks: 10400, ctr: 2.12, cpc: 0.16, leads: 58, conversions: 41, roas: 2.7 }
        },
        series: {
          "7":  [820, 910, 880, 1020, 1140, 980, 1210],
          "30": [18,19,20,21,22,21,23,24,25,26,27,28,29,30,31,30,32,33,34,35,36,38,37,39,40,41,42,43,44,45],
          "90": [12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102]
        },
        comments: [
          { id: "c-ig-1", author: "lena.beispiel", text: "Wie läuft die Terminbuchung bei euch?", likes: 12, at: "2026-11-08T16:10:00+01:00" },
          { id: "c-ig-2", author: "atelier.rhein", text: "Sieht klar und aufgeräumt aus.", likes: 8, at: "2026-11-07T12:44:00+01:00" },
          { id: "c-ig-3", author: "timo.demo", text: "Könnt ihr auch Ads + Website zusammen?", likes: 5, at: "2026-11-06T09:02:00+01:00" }
        ]
      },
      tiktok: {
        id: "tiktok",
        name: "TikTok",
        handle: "@projektex.beispiel",
        status: "nicht_verbunden",
        statusLabel: "Nicht verbunden – Beispieldaten",
        color: "#2b8cff",
        organic: {
          "7":  { followers: 4280, reach: 31200, views: 48600, likes: 3920, comments: 210, shares: 640, growth: 2.1 },
          "30": { followers: 4280, reach: 124000, views: 198000, likes: 15400, comments: 860, shares: 2400, growth: 7.4 },
          "90": { followers: 4280, reach: 310000, views: 520000, likes: 41000, comments: 2200, shares: 6100, growth: 18.2 }
        },
        ads: {
          "7":  { spend: 140, impressions: 58000, clicks: 1420, ctr: 2.45, cpc: 0.10, leads: 5, conversions: 3, roas: 2.6 },
          "30": { spend: 420, impressions: 210000, clicks: 5100, ctr: 2.43, cpc: 0.08, leads: 16, conversions: 11, roas: 2.8 },
          "90": { spend: 980, impressions: 620000, clicks: 14800, ctr: 2.39, cpc: 0.07, leads: 44, conversions: 29, roas: 2.5 }
        },
        series: {
          "7":  [4100, 5200, 4800, 6100, 7300, 6900, 8200],
          "30": [4,5,5,6,7,8,9,10,11,12,13,14,15,16,18,19,20,21,22,24,25,26,28,29,30,32,33,35,36,38],
          "90": [2,3,3,4,4,5,5,6,6,7,8,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,48,49,50,52,53,54,56,57,58,60,61,62,64,65,66,68,69,70,72,73,74,76,77,78,80,81,82,84,85,86,88,89,90,92,93,94,96,97,98,100,102]
        },
        comments: [
          { id: "c-tt-1", author: "mira.clip", text: "Der Hook am Anfang sitzt richtig gut.", likes: 44, at: "2026-11-08T20:11:00+01:00" },
          { id: "c-tt-2", author: "shop.pilot", text: "Braucht ihr das auch für lokale Shops?", likes: 19, at: "2026-11-07T18:30:00+01:00" },
          { id: "c-tt-3", author: "annika.beispiel", text: "Mehr Behind-the-Scenes bitte!", likes: 27, at: "2026-11-05T13:15:00+01:00" }
        ]
      },
      youtube: {
        id: "youtube",
        name: "YouTube",
        handle: "PROJEKT EX Beispiel",
        status: "nicht_verbunden",
        statusLabel: "Nicht verbunden – Beispieldaten",
        color: "#0a66d1",
        organic: {
          "7":  { followers: 5120, reach: 15600, views: 19200, likes: 860, comments: 74, shares: 52, growth: 0.9 },
          "30": { followers: 5120, reach: 62000, views: 78400, likes: 3200, comments: 290, shares: 180, growth: 3.2 },
          "90": { followers: 5120, reach: 178000, views: 226000, likes: 9100, comments: 780, shares: 520, growth: 9.1 }
        },
        ads: {
          "7":  { spend: 220, impressions: 36000, clicks: 720, ctr: 2.00, cpc: 0.31, leads: 4, conversions: 3, roas: 2.4 },
          "30": { spend: 780, impressions: 142000, clicks: 2680, ctr: 1.89, cpc: 0.29, leads: 14, conversions: 10, roas: 2.6 },
          "90": { spend: 2100, impressions: 410000, clicks: 7600, ctr: 1.85, cpc: 0.28, leads: 39, conversions: 28, roas: 2.5 }
        },
        series: {
          "7":  [2100, 2400, 2200, 2800, 3100, 2700, 3400],
          "30": [8,8,9,9,10,11,11,12,12,13,14,14,15,16,16,17,18,18,19,20,21,21,22,23,24,24,25,26,27,28],
          "90": [5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,30,30,31,31,32,32,33,33,34,34,35,35,36,36,37,37,38,38,39,39,40,40,41,41,42,42,43,43,44,44,45,45,46,46,47,47,48,48,49,50]
        },
        comments: [
          { id: "c-yt-1", author: "TechnikRaum", text: "Sehr verständlich erklärt – Danke!", likes: 31, at: "2026-11-08T10:05:00+01:00" },
          { id: "c-yt-2", author: "HandwerkDigital", text: "Könnt ihr denselben Ablauf für Handwerk zeigen?", likes: 17, at: "2026-11-06T21:40:00+01:00" },
          { id: "c-yt-3", author: "NinaBeispiel", text: "Timestamps wären hilfreich.", likes: 9, at: "2026-11-04T15:22:00+01:00" }
        ]
      },
      google: {
        id: "google",
        name: "Google",
        handle: "Google Ads · Beispielkonto",
        status: "nicht_verbunden",
        statusLabel: "Nicht verbunden – Beispieldaten",
        color: "#1a73e8",
        organic: {
          "7":  { followers: 2900, reach: 9800, views: 11200, likes: 0, comments: 18, shares: 0, growth: 0.6 },
          "30": { followers: 2900, reach: 38400, views: 44200, likes: 0, comments: 62, shares: 0, growth: 2.1 },
          "90": { followers: 2900, reach: 112000, views: 128000, likes: 0, comments: 180, shares: 0, growth: 5.4 }
        },
        ads: {
          "7":  { spend: 260, impressions: 48000, clicks: 1260, ctr: 2.63, cpc: 0.21, leads: 8, conversions: 6, roas: 3.4 },
          "30": { spend: 920, impressions: 186000, clicks: 4820, ctr: 2.59, cpc: 0.19, leads: 28, conversions: 21, roas: 3.2 },
          "90": { spend: 2480, impressions: 540000, clicks: 13600, ctr: 2.52, cpc: 0.18, leads: 76, conversions: 58, roas: 3.0 }
        },
        series: {
          "7":  [1100, 1280, 1190, 1420, 1510, 1380, 1640],
          "30": [9,10,10,11,12,12,13,14,14,15,16,16,17,18,18,19,20,20,21,22,22,23,24,24,25,26,26,27,28,29],
          "90": [4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,30,30,31,31,32,32,33,33,34,34,35,35,36,36,37,37,38,38,39,39,40,40,41,41,42,42,43,43,44,44,45,45,46,46,47,47,48,49]
        },
        comments: [
          { id: "c-gg-1", author: "Suchanzeige · Beispiel", text: "Bewertungen: „Schnelle Rückmeldung“ (Beispieltext)", likes: 0, at: "2026-11-08T08:40:00+01:00" },
          { id: "c-gg-2", author: "Suchanzeige · Beispiel", text: "Bewertungen: „Transparenter Ablauf“ (Beispieltext)", likes: 0, at: "2026-11-05T17:12:00+01:00" }
        ]
      }
    }
  };

  function sumOrganic(range) {
    const ids = Object.keys(DEMO.channels);
    const out = { followers: 0, reach: 0, views: 0, likes: 0, comments: 0, shares: 0, growth: 0 };
    ids.forEach((id) => {
      const o = DEMO.channels[id].organic[range];
      out.followers += o.followers;
      out.reach += o.reach;
      out.views += o.views;
      out.likes += o.likes;
      out.comments += o.comments;
      out.shares += o.shares;
      out.growth += o.growth;
    });
    out.growth = Math.round((out.growth / ids.length) * 10) / 10;
    return out;
  }

  function sumAds(range) {
    const ids = Object.keys(DEMO.channels);
    const out = { spend: 0, impressions: 0, clicks: 0, leads: 0, conversions: 0, ctr: 0, cpc: 0, roas: 0 };
    ids.forEach((id) => {
      const a = DEMO.channels[id].ads[range];
      out.spend += a.spend;
      out.impressions += a.impressions;
      out.clicks += a.clicks;
      out.leads += a.leads;
      out.conversions += a.conversions;
      out.roas += a.roas;
    });
    out.ctr = out.impressions ? Math.round((out.clicks / out.impressions) * 10000) / 100 : 0;
    out.cpc = out.clicks ? Math.round((out.spend / out.clicks) * 100) / 100 : 0;
    out.roas = Math.round((out.roas / ids.length) * 10) / 10;
    return out;
  }

  function formatNumber(n) {
    return new Intl.NumberFormat("de-DE").format(n);
  }

  function formatEuro(n) {
    const digits = Math.abs(n) < 10 && n % 1 !== 0 ? 2 : 0;
    return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
  }

  function formatPct(n) {
    return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(n) + " %";
  }

  function formatDate(iso) {
    try {
      return new Intl.DateTimeFormat("de-DE", {
        timeZone: "Europe/Berlin",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(iso));
    } catch (_) {
      return iso;
    }
  }

  global.EX_DEMO = DEMO;
  global.EX_DEMO_API = {
    get: () => DEMO,
    sumOrganic,
    sumAds,
    formatNumber,
    formatEuro,
    formatPct,
    formatDate,
    channelIds: () => Object.keys(DEMO.channels)
  };
})(typeof window !== "undefined" ? window : globalThis);
