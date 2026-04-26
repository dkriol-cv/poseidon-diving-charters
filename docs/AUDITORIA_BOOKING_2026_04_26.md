
# AUDITORIA TÉCNICA - SISTEMA DE BOOKING/RESERVA
**Data:** 2026-04-26  
**Projeto:** Poseidon Diving Charters  
**Objectivo:** Identificar e documentar todos os ficheiros, rotas, tabelas e componentes relacionados com booking/reserva

---

## SEÇÃO 1: FICHEIROS RELACIONADOS COM BOOKING/RESERVA

### 1.1 Ficheiros Encontrados em src/pages/

| Caminho Completo | Status | Imports que Referenciam | Notas |
|-----------------|--------|------------------------|-------|
| `src/pages/BookingPage.jsx` | ❌ NÃO USADO | Nenhum import ativo encontrado | Ficheiro órfão - não importado em App.jsx |
| `src/pages/BookingConfirmationPage.jsx` | ❌ NÃO USADO | Nenhum import ativo encontrado | Ficheiro órfão - não importado em App.jsx |
| `src/pages/CheckoutPage.jsx` | ❌ NÃO USADO | Nenhum import ativo encontrado | Ficheiro órfão - não importado em App.jsx |

### 1.2 Ficheiros Encontrados em src/components/

| Caminho Completo | Status | Imports que Referenciam | Notas |
|-----------------|--------|------------------------|-------|
| `src/components/BookingContactModal.jsx` | ✅ USADO | src/App.jsx | Sistema NOVO de contacto global - MANTER |
| `src/components/AvailabilityCalendar.jsx` | ✅ USADO | Nenhum ainda (deve ser integrado) | Componente NOVO de calendário - MANTER |
| `src/components/booking/CartIcon.jsx` | ❌ NÃO USADO | Nenhum import encontrado | Ficheiro órfão do sistema antigo |
| `src/components/booking/CalendarGrid.jsx` | ❌ NÃO USADO | Nenhum import encontrado | Ficheiro órfão do sistema antigo |

### 1.3 Ficheiros Encontrados em src/pages/admin/

| Caminho Completo | Status | Imports que Referenciam | Notas |
|-----------------|--------|------------------------|-------|
| `src/pages/admin/Availability.jsx` | ❌ NÃO USADO | Referenciado em App.jsx rota /admin/availability | Ficheiro antigo - conflito com AvailabilityManagement.jsx |
| `src/pages/admin/AvailabilityManagement.jsx` | ✅ USADO | Deve ser adicionado ao menu admin | Sistema NOVO de gestão - MANTER |
| `src/pages/admin/Bookings.jsx` | ❌ NÃO USADO | Nenhum import encontrado | Ficheiro órfão do sistema antigo |
| `src/pages/admin/Calendar.jsx` | ❌ NÃO USADO | Referenciado em App.jsx e Sidebar.jsx | Usado no menu admin mas ficheiro legado |
| `src/pages/admin/Dashboard.jsx` | ✅ USADO | src/App.jsx | Sistema ativo - MANTER |

### 1.4 Ficheiros Encontrados em src/hooks/

| Caminho Completo | Status | Imports que Referenciam | Notas |
|-----------------|--------|------------------------|-------|
| `src/hooks/adminHooks.js` | ⚠️ PARCIALMENTE USADO | src/pages/admin/Dashboard.jsx (useAdminStats) | Contém hooks órfãos: useBookings, useTimeSlots, useContacts |
| `src/hooks/useAvailabilityMap.js` | ❌ NÃO USADO | Nenhum import encontrado | Ficheiro órfão do sistema antigo |

### 1.5 Ficheiros Encontrados em src/lib/

| Caminho Completo | Status | Imports que Referenciam | Notas |
|-----------------|--------|------------------------|-------|
| `src/lib/availabilityHelpers.js` | ❌ NÃO USADO | Nenhum import encontrado | Ficheiro órfão do sistema antigo |
| `src/lib/bookingSessionHelpers.js` | ❌ NÃO USADO | Nenhum import encontrado | Ficheiro órfão do sistema antigo |
| `src/lib/catalogHelpers.js` | ❌ NÃO USADO | Nenhum import encontrado | Ficheiro órfão do sistema antigo |

### 1.6 Ficheiros Encontrados em src/services/

| Caminho Completo | Status | Imports que Referenciam | Notas |
|-----------------|--------|------------------------|-------|
| `src/services/catalogService.js` | ❌ NÃO USADO | Nenhum import encontrado | Ficheiro órfão do sistema antigo |
| `src/services/adminService.js` | ⚠️ PARCIALMENTE USADO | src/hooks/adminHooks.js | Contém funções órfãs relacionadas com bookings antigos |

### 1.7 Ficheiros Encontrados em src/contexts/

| Caminho Completo | Status | Imports que Referenciam | Notas |
|-----------------|--------|------------------------|-------|
| `src/contexts/BookingModalContext.jsx` | ✅ USADO | src/App.jsx, todas as páginas de experiências | Sistema NOVO de modal global - MANTER |

### 1.8 Ficheiros Encontrados em src/config/

| Caminho Completo | Status | Imports que Referenciam | Notas |
|-----------------|--------|------------------------|-------|
| `src/config/bookingConfig.js` | ❌ NÃO USADO | Nenhum import encontrado | Ficheiro de configuração órfão |

---

## SEÇÃO 2: ROTAS RELACIONADAS COM BOOKING

### 2.1 Rotas Definidas em src/App.jsx

| Rota | Componente/Página | Status de Uso | Links que Apontam |
|------|------------------|---------------|-------------------|
| `/admin/availability` | `<AvailabilityManagement />` | ✅ ATIVA | src/components/admin/Sidebar.jsx |
| `/admin/calendar` | `<CalendarPage />` | ⚠️ LEGADA | src/components/admin/Sidebar.jsx (menu item "Bookings") |
| `/admin/bookings` | `<CalendarPage />` (alias) | ⚠️ LEGADA | src/components/admin/Sidebar.jsx |

**NOTA CRÍTICA:** Não foram encontradas rotas públicas `/booking`, `/checkout`, `/confirmation` em App.jsx (✅ BOM - já removidas)

### 2.2 Links de Navegação em src/components/Header.jsx

**Análise:** Nenhum link para booking/checkout encontrado no Header.jsx (✅ LIMPO)

### 2.3 Links de Navegação em src/components/Footer.jsx

**Análise:** Nenhum link para booking/checkout encontrado no Footer.jsx (✅ LIMPO)

---

## SEÇÃO 3: TABELAS SUPABASE USADAS

### 3.1 Tabelas Identificadas no Código

| Nome da Tabela | Onde é Usada | Tipo de Operação | Relacionada com Booking? |
|----------------|--------------|------------------|--------------------------|
| `availability` | src/components/AvailabilityCalendar.jsx | SELECT | ✅ SIM (sistema NOVO) |
| `availability` | src/pages/admin/AvailabilityManagement.jsx | SELECT, INSERT, UPDATE | ✅ SIM (sistema NOVO) |
| `services` | src/pages/admin/AvailabilityManagement.jsx | SELECT | ❌ NÃO (catálogo de experiências) |
| `bookings` | src/services/adminService.js (getBookings, updateBookingStatus) | SELECT, UPDATE | ✅ SIM (sistema ANTIGO) |
| `bookings` | src/hooks/adminHooks.js (useBookings) | SELECT | ✅ SIM (sistema ANTIGO) |
| `time_slots` | src/services/adminService.js (getTimeSlots, createTimeSlot, etc.) | SELECT, INSERT, UPDATE, DELETE | ✅ SIM (sistema ANTIGO) |
| `contact_submissions` | src/services/adminService.js (getContacts) | SELECT, UPDATE | ❌ NÃO (formulário de contacto) |
| `blog_posts` | Vários ficheiros de blog | SELECT, INSERT, UPDATE, DELETE | ❌ NÃO (sistema de blog) |

### 3.2 Estrutura da Tabela `availability` (Sistema NOVO)

**Verificado em:** Database schema fornecido

