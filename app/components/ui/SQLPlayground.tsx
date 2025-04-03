"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { SQL_SCHEMA } from "@/lib/sqlSchema";

export default function SQLPlayground() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.2:3b",
          messages: [
            {
              role: "system",
              content: `You are a professional SQL Developer.  
Your task is to generate only a SINGLE SQL query with no additional explanation, formatting, or extra details.  
The query should be in **a simple, clear format** and should directly match the given schema and question.  
dont use inner join only use join everytime GIVE ANS WITHOUT ENCLOSING IT IN ANY QUOTES   

### **Schema:**  
${SQL_SCHEMA}  


### **Expected Output:**  
- **Only one SQL query**  
- **No explanation, headers, or formatting**  
- **Output should be consistent every time**  


`,
            },
            {
              role: "user",
              content: query,
            },
          ],
          stream: false,
        }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!data || !data.message || !data.message.content) {
        console.error("Unexpected API response:", data);
        setResult("Error: No SQL query generated.");
        return;
      }

      const generatedQuery = data.message.content
        .replace(/```sql|```/g, "")
        .trim();
      console.log(generatedQuery);
      setResult(generatedQuery);

      const sqlResponse = await fetch("/api/sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: generatedQuery }),
      });

      const sqlData = await sqlResponse.json();
      setOutput(JSON.stringify(sqlData.results, null, 2));
    } catch (error) {
      console.error("Error executing query:", error);
      setResult("Error: Failed to fetch SQL query.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>SQL Playground</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Enter your SQL query here"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full"
            />
            <Button
              type="submit"
              disabled={loading}
              className={`transition-all px-4 py-2 rounded-md ${
                loading ? "opacity-50 cursor-not-allowed" : "active:scale-95"
              }`}
            >
              {loading ? "Generating..." : "Generate SQL Query"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Generated SQL Query</CardTitle>
          </CardHeader>
          <CardContent>
            <SyntaxHighlighter language="sql" style={atomDark}>
              {result}
            </SyntaxHighlighter>
          </CardContent>
        </Card>
      )}

      {output && (
        <Card>
          <CardHeader>
            <CardTitle>Query Output</CardTitle>
          </CardHeader>
          <CardContent>
            <SyntaxHighlighter language="json" style={atomDark}>
              {output}
            </SyntaxHighlighter>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
