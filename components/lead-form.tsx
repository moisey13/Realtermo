"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Status = "idle" | "loading" | "success" | "error";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя, чтобы мы знали, как к вам обратиться."),
  phone: z
    .string()
    .trim()
    .refine((value) => value.replace(/\D/g, "").length === 11, "Введите телефон полностью."),
  message: z.string().trim().max(1000, "Сообщение должно быть короче 1000 символов.").optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

const submitButtonClass =
  "bg-[linear-gradient(135deg,#2563eb_0%,#0ea5e9_55%,#38bdf8_100%)] text-white shadow-[0_18px_42px_rgba(14,165,233,0.34)] ring-1 ring-sky-300/40 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_26px_56px_rgba(14,165,233,0.42)]";

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  const normalized = digits.startsWith("8")
    ? `7${digits.slice(1)}`
    : digits.startsWith("7")
      ? digits
      : digits
        ? `7${digits}`
        : "";
  const limited = normalized.slice(0, 11);
  const country = limited.slice(0, 1);
  const code = limited.slice(1, 4);
  const first = limited.slice(4, 7);
  const second = limited.slice(7, 9);
  const third = limited.slice(9, 11);

  if (!limited) {
    return "";
  }

  let formatted = `+${country}`;

  if (code) {
    formatted += ` (${code}`;
  }
  if (code.length === 3) {
    formatted += ")";
  }
  if (first) {
    formatted += ` ${first}`;
  }
  if (second) {
    formatted += ` ${second}`;
  }
  if (third) {
    formatted += `-${third}`;
  }

  return formatted;
}

export function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [notice, setNotice] = useState("");
  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      phone: "",
      message: "",
    },
  });

  async function handleSubmit(values: LeadFormValues) {
    setStatus("loading");
    setNotice("");

    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        phone: values.phone,
        message: values.message,
      }),
    });

    const result = (await response.json()) as { message?: string };

    if (response.ok) {
      setStatus("success");
      setNotice(result.message ?? "Заявка отправлена.");
      form.reset();
      return;
    }

    setStatus("error");
    setNotice(result.message ?? "Не удалось отправить заявку.");
  }

  return (
    <Form {...form}>
      <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя</FormLabel>
              <FormControl>
                <Input autoComplete="name" placeholder="Как к вам обращаться" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Телефон</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="+7 (900) 123 45-67"
                  {...field}
                  onChange={(event) => field.onChange(formatPhone(event.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Что нужно подобрать или уточнить</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Опишите подробнее, что вам нужно: товар, параметры, консультация по наличию или доставке"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className={`w-full sm:w-fit ${submitButtonClass}`} disabled={status === "loading"} size="lg" type="submit">
          <Send data-icon="inline-start" />
          {status === "loading" ? "Отправляем..." : "Оставить заявку"}
        </Button>
        {notice ? (
          <p className={status === "error" ? "text-sm text-destructive" : "text-sm text-muted-foreground"}>
            {notice}
          </p>
        ) : null}
      </form>
    </Form>
  );
}
