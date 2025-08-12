import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { prompt } = await req.json();

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createChatCompletion({
    model: "gpt-4-turbo",
    stream: true,
    messages: [
      {
        role: "user",
        content: `Du bist ein Assistent für die Erstellung von realistischen Trainingsszenarien für die taktische Verwundetenversorgung (TCCC). Deine Aufgabe ist es, ein kurzes, prägnantes Szenario zu erstellen, das den Zustand eines Verwundeten beschreibt.

Anweisungen:
- Ergänze den vom Benutzer gegebenen Anfang zu einem vollständigen Szenario.
- Das Szenario sollte die Verletzungen und den unmittelbaren Zustand des Verwundeten beschreiben.
- Integriere relevante Vitalparameter (z.B. Puls, Atmung, Bewusstseinszustand).
- Beschreibe mögliche Veränderungen im Zustand des Patienten im Laufe der Zeit (z.B. "wird zunehmend unruhiger", "Atmung wird flacher").
- Die Antwort sollte ein zusammenhängender Text sein.
- Die Gesamtlänge des von dir generierten Textes sollte zwischen 30 und 80 Wörtern liegen.
- Der Tonfall sollte direkt und sachlich sein, passend für eine militärische Übung.
- Gib keine Behandlungsschritte an. Konzentriere dich nur auf den Zustand des Verwundeten.

Beispiel für ein vollständiges Szenario:
"Soldat wurde mehrmals im Oberkörper getroffen und ist bewusstlos. Starke Blutung aus der rechten Schulter. Atmet schnell und flach (30/min), Puls ist schwach und schnell (140/min). Reagiert nicht auf Schmerzreize. Zustand verschlechtert sich zusehends."

Benutzereingabe (zu ergänzen): "${prompt}"

Deine Ergänzung:`,
      },
    ],
    max_tokens: 150,
    temperature: 0,
  });

  // Check for errors
  if (!response.ok) {
    return new Response(await response.text(), {
      status: response.status,
    });
  }

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
