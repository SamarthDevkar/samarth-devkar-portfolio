import { Container } from "@/components/ui/section";

export function PageHeader({
  kicker,
  title,
  lede,
}: {
  kicker: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="border-line relative overflow-hidden border-b">
      <div
        aria-hidden
        className="grid-field pointer-events-none absolute inset-0 opacity-50"
      />
      <Container className="relative">
        <div className="max-w-3xl pt-32 pb-16 sm:pt-40 sm:pb-20">
          <p className="label flex items-center gap-3">
            <span aria-hidden className="bg-signal size-1.5 rounded-full" />
            {kicker}
          </p>
          <h1 className="font-display text-h1 text-ink mt-6 font-semibold">
            {title}
          </h1>
          {lede ? (
            <p className="text-ink-2 text-lead mt-6 max-w-2xl">{lede}</p>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
