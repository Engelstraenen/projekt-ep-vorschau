(function () {
  try {
    const cur = JSON.parse(localStorage.getItem("ep-login") || "null");
    if (!cur || !cur.ma) {
      localStorage.setItem(
        "ep-login",
        JSON.stringify({
          rolle: "gf",
          ma: "ma17",
          name: "Markus B.",
          rollenname: "Geschäftsführung"
        })
      );
    }
  } catch (_) {}
})();
