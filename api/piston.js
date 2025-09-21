import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { language, code } = req.body;
    if (!language || !code) {
      return res.status(400).json({ error: "Missing language or code" });
    }

    const pistonRes = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, source: code }),
    });

    const data = await pistonRes.json();

    // Make sure we return the actual output
    const output = data?.run?.stdout ?? data?.run?.output ?? "No output returned";

    res.status(200).json({ output });

  } catch (err) {
    console.error("Piston API error:", err);
    res.status(500).json({ output: "PYCODE: Error executing code" });
  }
}
