import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ error: "Envie o áudio como multipart/form-data." }, { status: 400 });
  }

  const form = await request.formData();
  const audio = form.get("audio");
  const questionId = String(form.get("questionId") || "");

  if (!(audio instanceof File)) {
    return NextResponse.json({ error: "Arquivo de áudio ausente." }, { status: 400 });
  }

  // Contrato pronto para conectar OpenAI/Whisper ou outro provedor no servidor.
  // Nenhuma chave deve ser exposta no cliente. O MVP retorna uma resposta simulada
  // para manter o fluxo navegável sem custo externo.
  return NextResponse.json({
    id: crypto.randomUUID(),
    linkedQuestionId: questionId || null,
    transcript: "A gente consegue umas 10 ou 12 avaliações por semana. Terça e quinta são os melhores dias.",
    speaker: "client",
    confidence: 0.96,
    source: "audio",
    confirmationStatus: "pending",
    provider: "mock",
  });
}
