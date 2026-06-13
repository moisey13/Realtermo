import { z } from "zod";

export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  if (digits.startsWith("8")) {
    return `7${digits.slice(1, 11)}`;
  }

  if (digits.startsWith("7")) {
    return digits.slice(0, 11);
  }

  return `7${digits.slice(0, 10)}`;
}

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя, чтобы мы понимали, как к вам обратиться."),
  phone: z
    .string()
    .trim()
    .transform(normalizePhone)
    .refine((value) => /^7\d{10}$/.test(value), "Введите телефон в формате +7 (900) 123 45-67."),
  message: z.string().trim().max(1000, "Сообщение должно быть короче 1000 символов.").optional(),
  consent: z.boolean().refine((value) => value === true, {
    message: "Нужно подтвердить согласие на обработку персональных данных.",
  }),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type LeadFormValues = z.input<typeof leadSchema>;
export type LeadPayload = z.output<typeof leadSchema>;
