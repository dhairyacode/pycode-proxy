import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ output: "Method Not Allowed" });
  }

  const { code } = req.body;

  if (!code) return res.status(400).json({ output: "No code provided" });

  try {
    // Wrap the code in a snippet to capture last expression
    const wrappedCode = `
import sys
import io
import builtins

_stdout = sys.stdout
sys.stdout = io.StringIO()

try:
    _result = eval(${JSON.stringify(code)}, globals())
except:
    _result = None

_output = sys.stdout.getvalue()
sys.stdout = _stdout

if _result is not None:
    print(_result)
`;

    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: "python3", source: wrappedCode }),
    });

    const data = await response.json();
    const output = data?.run?.output || "PYCODE: No output returned";

    res.status(200).json({ output });

  } catch (err) {
    console.error(err);
    res.status(500).json({ output: "PYCODE: Error executing code" });
  }
}
