# Sistema de Internacionalização (i18n)

## Visão Geral

O projeto BPMN Designer agora inclui suporte completo para múltiplos idiomas usando React i18next. Atualmente suporta:

- 🇺🇸 **Inglês** (en) - idioma padrão
- 🇧🇷 **Português** (pt)

## Como Usar

### Alternando Idiomas

1. Na barra lateral esquerda, clique no botão "Idioma" (ícone de globo)
2. Selecione o idioma desejado no menu suspenso
3. A interface será atualizada automaticamente
4. A preferência de idioma será salva no navegador

### Adicionando Novos Idiomas

1. **Criar arquivo de tradução:**
   ```bash
   src/i18n/locales/[código_idioma].json
   ```

2. **Atualizar configuração:**
   ```typescript
   // src/i18n/index.ts
   import novoIdioma from './locales/novo_idioma.json';
   
   const resources = {
     en: { translation: en },
     pt: { translation: pt },
     [codigo]: { translation: novoIdioma }
   };
   ```

3. **Adicionar no seletor:**
   ```typescript
   // src/components/LanguageSelector.tsx
   // Adicionar nova opção no menu
   ```

### Estrutura das Traduções

As traduções estão organizadas por seções:

```json
{
  "app": {
    "title": "Título da aplicação",
    "welcome": "Mensagem de boas-vindas"
  },
  "sidebar": {
    "myDiagrams": "Meus Diagramas",
    "createDiagram": "Criar Diagrama"
  },
  "toolbar": {
    "elements": "Elementos",
    "save": "Salvar"
  }
}
```

### Usando Traduções no Código

```typescript
import { useTranslation } from 'react-i18next';

function MeuComponente() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('app.title')}</h1>
      <p>{t('app.welcome')}</p>
    </div>
  );
}
```

## Arquivos Modificados

- `src/i18n/index.ts` - Configuração do i18next
- `src/i18n/locales/en.json` - Traduções em inglês
- `src/i18n/locales/pt.json` - Traduções em português
- `src/components/LanguageSelector.tsx` - Componente seletor de idioma
- `src/components/Sidebar.tsx` - Atualizado com traduções
- `src/components/Toolbar.tsx` - Atualizado com traduções
- `src/components/About/AboutPage.tsx` - Atualizado com traduções
- `src/components/Help/HelpPage.tsx` - Atualizado com traduções
- `src/components/Canvas/Canvas.tsx` - Atualizado com traduções
- `src/App.tsx` - Integração do i18next
- `src/main.tsx` - Importação da configuração i18n

## Dependências Adicionadas

- `react-i18next` - Hook para React
- `i18next` - Biblioteca principal de internacionalização

## Funcionalidades

✅ **Implementado:**
- Seletor de idioma na sidebar
- Traduções para inglês e português
- Persistência da preferência no localStorage
- Traduções em todos os componentes principais

🔄 **Melhorias Futuras:**
- Detecção automática do idioma do navegador
- Mais idiomas (espanhol, francês, etc.)
- Formatação de datas por localização
- Números e moedas localizados

## Como Contribuir

Para adicionar traduções ou melhorar as existentes:

1. Edite os arquivos em `src/i18n/locales/`
2. Siga a estrutura hierárquica existente
3. Teste as mudanças alternando idiomas na interface
4. Mantenha as chaves consistentes entre idiomas
