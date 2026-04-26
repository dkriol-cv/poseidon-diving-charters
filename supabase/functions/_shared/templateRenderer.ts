export const getLanguageText = (enText: string, ptText: string, language: string = 'en') => {
  return language === 'pt' ? ptText : enText;
};

export const validateRequiredVariables = (variables: Record<string, any>, requiredList: string[]) => {
  const missing = requiredList.filter(key => variables[key] === undefined || variables[key] === null || variables[key] === '');
  if (missing.length > 0) {
    throw new Error(`Missing required variables: ${missing.join(', ')}`);
  }
};

export const renderTemplate = (template: string, variables: Record<string, any>) => {
  let rendered = template;
  
  // Replace simple {{key}} patterns
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    rendered = rendered.replace(regex, String(value ?? '')); 
  }

  return rendered;
};