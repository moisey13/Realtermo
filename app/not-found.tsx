import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md rounded-[2rem] bg-white/82 p-8 text-center shadow-soft backdrop-blur-xl">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">Страница не найдена</h1>
        <p className="mt-3 text-muted-foreground">Вернитесь на главную страницу магазина «РеалТермо».</p>
        <Button asChild className="mt-6">
          <Link href="/">На главную</Link>
        </Button>
      </div>
    </main>
  );
}
