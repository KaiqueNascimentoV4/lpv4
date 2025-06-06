// Funções para gerenciar dados no localStorage

// Função genérica para obter dados do localStorage
export function getStorageData<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") {
    return defaultValue
  }

  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Erro ao obter dados do localStorage (${key}):`, error)
    return defaultValue
  }
}

// Função genérica para salvar dados no localStorage
export function setStorageData<T>(key: string, value: T): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Erro ao salvar dados no localStorage (${key}):`, error)
  }
}

// Funções específicas para cada tipo de dado
export function getEmails(): string[] {
  return getStorageData<string[]>("v4_emails", [
    "pedro.rondina@v4company.com",
    "kaique.nascimento@v4company.com",
    "lara.spinardi@v4company.com",
    "luana.secler@v4company.com",
    "lucas.jose@v4company.com",
    "murillo.spagola@v4company.com",
    "raquel.hailer@v4company.com",
    "renan.garcia@v4company.com",
    "renan.zamforlim@v4company.com",
    "vinicius.cestaro@v4company.com",
    "anajulia.leme@v4company.com",
  ])
}

export function setEmails(emails: string[]): void {
  setStorageData("v4_emails", emails)
}

export function getClients(): string[] {
  return getStorageData<string[]>("v4_clients", [
    "TESTE",
    "FREI CANECA",
    "SUPER CABO",
    "PASTA NOBRE",
    "BOM PASTOR",
    "TYAR",
    "MERHY",
    "JNET",
    "YEGRIN",
    "SOLUÇÃO COSMÉTICOS",
    "MUD REVESTIMENTOS",
    "KZ TECNOLOGIA",
    "BLUECHIP",
    "GALPÃO DOS ESTOFADOS",
    "ARTERIA",
    "PER POCHI",
    "PARAÍBA AREIA E BRITA",
    "EVAMAX",
    "GROWDECK",
    "CORTIARTE",
    "DIDATICA NET",
    "BOMBONATO",
    "MIRARE",
    "ARENA ARTERIA",
    "NOVOS VELHOS TEMPOS",
    "MERHY HOME",
    "RENATO (FORMAÇÃO DE VENDEDORES)",
    "MULTIDIESEL",
    "LOCADIESEL",
    "MULTISERVICE",
    "Pizzaria Lima's",
    "Faneca",
    "La Vie Jalecos",
    "CEO Sofware",
    "Hidrolimpa",
  ])
}

export function setClients(clients: string[]): void {
  setStorageData("v4_clients", clients)
}

export function getCreativeTypes(): string[] {
  return getStorageData<string[]>("v4_creative_types", [
    "Estático",
    "Carrossel",
    "Edição de vídeo",
    "Criação de vídeo",
    "Animação de vídeo",
    "PMAX",
  ])
}

export function setCreativeTypes(types: string[]): void {
  setStorageData("v4_creative_types", types)
}

export function getCompetitiveDifferentials(): string[] {
  return getStorageData<string[]>("v4_differentials", [
    "Qualidade",
    "Preço competitivo",
    "Exclusividade",
    "Facilidade de uso",
    "Sustentabilidade",
    "Atendimento ao cliente/suporte",
    "Inovação tecnológica",
    "Garantia e confiabilidade",
    "Condição de pagamento",
    "Rapidez e agilidade da entrega",
    "Personalização/feito para você",
    "Credibilidade",
    "Resultado comprovado",
  ])
}

export function setCompetitiveDifferentials(differentials: string[]): void {
  setStorageData("v4_differentials", differentials)
}

export function getTriggers(): string[] {
  return getStorageData<string[]>("v4_triggers", [
    "Escassez",
    "Urgência",
    "Prova Social",
    "Autoridade",
    "Antecipação",
    "Reciprocidade",
    "Transformação",
    "Comunidade",
    "Curiosidade",
    "Dor e Solução",
    "Benefício",
    "Novidade",
    "Comparação",
  ])
}

export function setTriggers(triggers: string[]): void {
  setStorageData("v4_triggers", triggers)
}

export function getIntentions(): string[] {
  return getStorageData<string[]>("v4_intentions", ["Aumento de vendas", "Captação de Leads", "Reforço de marca"])
}

export function setIntentions(intentions: string[]): void {
  setStorageData("v4_intentions", intentions)
}

export function getToneOfVoices(): string[] {
  return getStorageData<string[]>("v4_tone_of_voices", [
    "Profissional: Formal, objetivo, técnico.",
    "Conversacional: Informal, amigável, próximo.",
    "Inspirador: Motivador, aspiracional, otimista.",
    "Divertido: Humorístico, leve, irreverente.",
    "Educacional: Informativo, didático, confiável.",
    "Urgente: Direto, objetivo, chamando para ação imediata.",
    "Empático: Sensível, acolhedor, solidário.",
    "Exclusivo: Sofisticado, premium, seletivo.",
    "Rebelde: Desafiador, ousado, provocador.",
    "Neutro: Equilibrado, claro, acessível.",
  ])
}

export function setToneOfVoices(tones: string[]): void {
  setStorageData("v4_tone_of_voices", tones)
}

export function getAwarenessLevels(): string[] {
  return getStorageData<string[]>("v4_awareness_levels", [
    "Totalmente consciente.",
    "Consciente da solução.",
    "Consciente do problema.",
    "Não consciente.",
  ])
}

export function setAwarenessLevels(levels: string[]): void {
  setStorageData("v4_awareness_levels", levels)
}
