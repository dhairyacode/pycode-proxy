import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { language, code } = req.body;

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, source: code }),
      });
      const data = await response.json();
      res.status(200).json({ output: data?.run?.output });
    } catch (err) {
      res.status(500).json({ output: "PYCODE: Error executing code" });
    }
  } else {
    res.status(405).json({ output: "Method Not Allowed" });
  }
}
