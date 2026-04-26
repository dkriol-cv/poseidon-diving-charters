# 📊 Relatório Técnico de Diagnóstico: Sistema de Reservas Poseidon

**Data do Relatório:** 17 de Fevereiro de 2026  
**Status do Sistema:** 🟡 Operacional com Riscos Identificados  
**Versão Analisada:** v1.0 (Poseidon Booking System)

---

## 1. Resumo Executivo

A análise ponta-a-ponta do sistema de reservas indica que a infraestrutura core para integração de `bookings` e `booking_blocks` está implementada corretamente no frontend. O hook `useAvailabilityMap` realiza o fetch de ambas as tabelas e combina os resultados. No entanto, foram identificadas **vulnerabilidades críticas de segurança (RLS)** e um **bug lógico de fuso horário** que pode causar desalinhamento de disponibilidade em certas regiões, fazendo com que dias livres pareçam ocupados ou vice-versa.

---

## 2. Análise de Código (Codebase Audit)

### 2.1. `src/hooks/useAvailabilityMap.js`
*   **Status:** ✅ Aprovado com ressalvas.
*   **Logs de Debug:** A instrumentação com `console.log('[DEBUG]...')` está presente e cobre todos os pontos críticos (início, fetch, contagem, deduplicação).
*   **Integração:** O código executa `Promise.all` (implícito ou sequencial) para buscar dados de `public.bookings` e `public.booking_blocks`.
*   **Resiliência:** Existe um bloco `try/catch` específico para `booking_blocks`, garantindo que falhas nesta tabela não derrubem o sistema inteiro (fallback funcional).
*   **Lógica de Combinação:** A concatenação `[...bookingDates, ...blockDates]` seguida de `new Set()` garante corretamente a unificação das datas ocupadas.

### 2.2. `src/lib/availabilityHelpers.js`
*   **Status:** ⚠️ **Risco Identificado (Bug de Timezone)**.
*   **Problema:** A função `getAvailabilityMap` itera datas usando `currentDate` (instanciado como Local Time via `new Date()`) mas gera as chaves do mapa usando `toISOString().split('T')[0]` (UTC).
*   **Impacto:** Para usuários em fusos horários a leste de Greenwich (ex: Europa Central UTC+1, Ásia), a conversão para UTC à meia-noite (00:00) resulta no dia anterior (23:00 do dia D-1).
*   **Sintoma:** O calendário pode mostrar a disponibilidade do dia 14 no dia 15.

### 2.3. `src/components/booking/CalendarGrid.jsx`
*   **Status:** ✅ Aprovado.
*   **Geração de Chaves:** Usa `date.toLocaleDateString('en-CA')` que gera `YYYY-MM-DD` baseado no horário local.
*   **Conflito:** O CalendarGrid pede a chave Local ('2026-02-15'), mas o Helper pode ter gerado a chave UTC ('2026-02-14'), causando "desencontro" de dados.

---

## 3. Análise de Dados e Schema (Supabase)

Baseado na análise do schema SQL fornecido:

### 3.1. Tabela `public.bookings`
*   **Estrutura:** Colunas `booking_date` (date), `status` (text) presentes.
*   **🚨 VULNERABILIDADE CRÍTICA (RLS):**
    *   **Policy:** `"Allow public read by ID or Session"`
    *   **Definição:** `USING (((id IS NOT NULL) OR (stripe_session_id IS NOT NULL)))`
    *   **Análise:** A condição `id IS NOT NULL` é *sempre verdadeira* para chaves primárias.
    *   **Consequência:** A tabela inteira é publicamente legível. Qualquer usuário anônimo pode baixar o banco de dados completo de reservas, incluindo nomes, emails e telefones de clientes.

### 3.2. Tabela `public.booking_blocks`
*   **Estrutura:** Coluna `booking_date` (date) e `status` (text) confirmadas.
*   **RLS:** Policy `"public_read_booking_blocks"` definida como `USING (true)`. Isso é aceitável para dados de bloqueio (que não contém PII), mas deve ser monitorado.

---

## 4. Teste de Fluxo Simulado (Cenário: 2026-02-26)

Simulação da execução do código com os dados atuais:

1.  **Fetch:** O sistema busca reservas para `2026-02-26`.
2.  **Dados:** Suponha que existe um bloqueio em `booking_blocks` para esta data.
3.  **Processamento:**
    *   `bookings`: 0 registros.
    *   `booking_blocks`: 1 registro (`date: '2026-02-26'`, `status: 'confirmed'`).
    *   `uniqueOccupiedDates`: `['2026-02-26']`.
4.  **Mapa de Disponibilidade (Helper):**
    *   O loop chega em 26/02.
    *   Se o usuário estiver em UTC+0 (Portugal/Inverno): Chave gerada `'2026-02-26'`.
    *   Lookup encontra o bloqueio.
    *   `availabilityMap['2026-02-26'].available` = `false`.
5.  **Renderização (CalendarGrid):**
    *   Célula de 26/02 verifica `availabilityMap['2026-02-26']`.
    *   Resultado: **BLOQUEADO (Correto)**.

**Cenário de Falha (Verão/Fuso UTC+1):**
*   Helper gera chave UTC para 00:00 Local: `'2026-02-25'` (23h do dia anterior).
*   CalendarGrid busca chave Local: `'2026-02-26'`.
*   Resultado: **DADOS NÃO ENCONTRADOS** ou disponibilidade incorreta.

---

## 5. Pontos de Falha Identificados

| ID | Componente | Severidade | Descrição |
|----|------------|------------|-----------|
| **F01** | `bookings` Table | **CRÍTICA** | RLS Policy permite leitura pública irrestrita de dados pessoais (PII). |
| **F02** | `availabilityHelpers` | **ALTA** | Uso de `toISOString()` em datas locais causa deslocamento de dia em fusos > UTC+0. |
| **F03** | `useAvailabilityMap` | MÉDIA | Dependência de `new Date()` (Local) para query no banco (que espera YYYY-MM-DD literal) pode gerar edge cases na virada do dia. |

---

## 6. Recomendações e Próximos Passos

Abaixo, as ações recomendadas em ordem de prioridade para a próxima iteração (Task 2):

1.  **🛡️ Segurança Imediata (Prioridade 0):**
    *   Alterar RLS da tabela `bookings` para permitir leitura pública **apenas** dos campos necessários (`booking_date`, `status`, `departure_time`) ou restringir totalmente e usar uma Edge Function segura para verificar disponibilidade.

2.  **🐛 Correção de Bug de Data (Prioridade 1):**
    *   Substituir `toISOString().split('T')[0]` por uma função que formate a data localmente (`YYYY-MM-DD`) sem conversão para UTC dentro de `src/lib/availabilityHelpers.js`.
    *   Exemplo seguro: `const dateStr = date.toLocaleDateString('en-CA');`

3.  **✅ Validação de Dados:**
    *   Adicionar filtro `.eq('active', true)` ou similar na query de `services` se aplicável, para evitar mostrar serviços descontinuados.

**Conclusão:** O sistema de diagnóstico está pronto. O código atual possui a lógica necessária para funcionar, mas o bug de timezone (F02) é uma "bomba-relógio" que deve ser corrigida antes do lançamento em produção, e a falha de segurança (F01) exige atenção imediata.