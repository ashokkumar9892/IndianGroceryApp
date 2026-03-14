// Price is stored in paise (1 rupee = 100 paise)
export function formatPrice(paise: number): string {
  const rupees = paise / 100;
  return `₹${rupees.toFixed(2)}`;
}

export function formatPriceShort(paise: number): string {
  const rupees = paise / 100;
  if (rupees >= 1000) return `₹${(rupees / 1000).toFixed(1)}k`;
  return `₹${rupees % 1 === 0 ? rupees.toFixed(0) : rupees.toFixed(2)}`;
}

export function effectivePrice(price: number, discountPercent?: number): number {
  if (!discountPercent) return price;
  return Math.round(price * (1 - discountPercent / 100));
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

export function formatWeight(value: number, unit: string): string {
  return `${value}${unit}`;
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}
