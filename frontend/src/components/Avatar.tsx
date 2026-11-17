export function Avatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  return (
    <span className="avatar" aria-hidden="true">
      {initial}
    </span>
  );
}
