import { cn } from "@/lib/utils";

export function getCardSpan(index: number, total: number) {
  const isLast = index === total - 1;
  const oddIn2Col = total % 2 !== 0;
  const lonelyIn3Col = total % 3 === 1;
  return cn(
    isLast && oddIn2Col && "sm:col-span-2",
    isLast && oddIn2Col && !lonelyIn3Col && "xl:col-span-1",
    isLast && lonelyIn3Col && "xl:col-span-3",
  );
}
