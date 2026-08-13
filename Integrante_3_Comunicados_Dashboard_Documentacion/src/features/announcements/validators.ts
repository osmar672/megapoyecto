import { announcementAudiences, type AnnouncementAudience } from './authorization';

export interface AnnouncementInput {
  title: string;
  body: string;
  audience: AnnouncementAudience;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  value?: AnnouncementInput;
}

const titleMinLength = 3;
const titleMaxLength = 120;
const bodyMinLength = 10;
const bodyMaxLength = 4000;

export function validateAnnouncementInput(input: AnnouncementInput): ValidationResult {
  const title = input.title.trim();
  const body = input.body.trim();
  const errors: string[] = [];

  if (title.length < titleMinLength) {
    errors.push(`El título debe contener al menos ${titleMinLength} caracteres.`);
  }

  if (title.length > titleMaxLength) {
    errors.push(`El título no puede superar ${titleMaxLength} caracteres.`);
  }

  if (body.length < bodyMinLength) {
    errors.push(`El cuerpo debe contener al menos ${bodyMinLength} caracteres.`);
  }

  if (body.length > bodyMaxLength) {
    errors.push(`El cuerpo no puede superar ${bodyMaxLength} caracteres.`);
  }

  if (!announcementAudiences.includes(input.audience)) {
    errors.push('La audiencia seleccionada no es válida.');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    value: {
      title,
      body,
      audience: input.audience,
    },
  };
}
