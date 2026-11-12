interface BrandHeaderProps {
  compact?: boolean;
}

export default function BrandHeader({ compact = false }: BrandHeaderProps) {
  return (
    <header className={compact ? 'py-5' : 'py-8'}>
      <p
        className="text-center text-[11px] tracking-[0.5em] text-neutral-500 uppercase"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        Fashion Game
      </p>
      <h1
        className="text-center leading-none mt-2"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        <span
          className={`block text-neutral-900 ${compact ? 'text-3xl' : 'text-5xl'} tracking-[0.08em] font-semibold`}
        >
          MEDIA&nbsp;VOGUE
        </span>
        <span
          className={`block ${compact ? 'text-[10px]' : 'text-xs'} tracking-[0.65em] text-neutral-500 mt-2 uppercase`}
          style={{ fontFamily: "'Jost', sans-serif" }}
        >
          The Fitting Room
        </span>
      </h1>
    </header>
  );
}
