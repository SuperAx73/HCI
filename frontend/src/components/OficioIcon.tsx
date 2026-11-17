import type { SVGProps } from 'react';
import type { Oficio } from '@oficios/shared';

type IconProps = SVGProps<SVGSVGElement>;

const base: IconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

function BoltIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

function DropIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2s7 7.5 7 12.5A7 7 0 0 1 5 14.5C5 9.5 12 2 12 2Z" />
    </svg>
  );
}

function RollerIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4" width="14" height="6" rx="1.5" />
      <path d="M8 10v4" />
      <rect x="6" y="14" width="4" height="7" rx="1" />
    </svg>
  );
}

function SparkleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v4M12 17v4M4 12H2M22 12h-2M6 6 4.5 4.5M19.5 19.5 18 18M18 6l1.5-1.5M4.5 19.5 6 18" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function WrenchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4L21 6l-3-3-3.3 3.3Z" />
    </svg>
  );
}

function TrowelIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 21 12 12" />
      <path d="M10 6c2-2 6-2 8 0s2 6 0 8l-4 4-8-8 4-4Z" />
    </svg>
  );
}

function LeafIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 4c-9 0-16 7-16 16 9 0 16-7 16-16Z" />
      <path d="M9 19C9 11 15 5 20 4" />
    </svg>
  );
}

function HammerIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m15 12 5.5 5.5a1.5 1.5 0 0 1-2 2L13 14" />
      <path d="M9 10 3 16l2 2 6-6" />
      <path d="M13 10l5-5 3 3-5 5-3-3Z" />
    </svg>
  );
}

function PlugIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 2v6M15 2v6" />
      <path d="M6 8h12v4a6 6 0 0 1-12 0V8Z" />
      <path d="M12 18v4" />
    </svg>
  );
}

function ToolsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20 15 9" />
      <path d="M13 4a3 3 0 0 0 4 4l-2 2-2-2 0-4Z" />
      <circle cx="6" cy="18" r="2" />
    </svg>
  );
}

const ICONS: Record<Oficio, (props: IconProps) => React.ReactElement> = {
  Electricidad: BoltIcon,
  Plomería: DropIcon,
  Pintura: RollerIcon,
  Limpieza: SparkleIcon,
  'Mecánica automotriz': WrenchIcon,
  Albañilería: TrowelIcon,
  Jardinería: LeafIcon,
  Carpintería: HammerIcon,
  Electrodomésticos: PlugIcon,
  Otro: ToolsIcon,
};

export function OficioIcon({ oficio, ...rest }: { oficio: string } & IconProps) {
  const Icon = ICONS[oficio as Oficio] ?? ToolsIcon;
  return <Icon {...rest} />;
}
