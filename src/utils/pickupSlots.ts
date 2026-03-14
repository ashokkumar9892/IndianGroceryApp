import type { PickupSlot, Store } from '../types';

export function generatePickupSlots(store: Store, existingOrders: { pickupSlot: PickupSlot }[]): PickupSlot[] {
  const slots: PickupSlot[] = [];
  const now = new Date();
  const daysAhead = 3;

  for (let d = 0; d <= daysAhead; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() + d);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }); // "Mon"
    const dateStr = date.toISOString().split('T')[0]; // "2026-03-13"

    const hours = store.hours.find(h => h.day === dayName);
    if (!hours || hours.isClosed) continue;

    const [openH, openM] = hours.open.split(':').map(Number);
    const [closeH, closeM] = hours.close.split(':').map(Number);

    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    for (let min = openMinutes; min + 30 <= closeMinutes; min += 30) {
      const slotStart = new Date(date);
      slotStart.setHours(Math.floor(min / 60), min % 60, 0, 0);

      // Skip past slots for today plus lead time
      if (d === 0 && slotStart.getTime() < now.getTime() + store.pickupLeadMinutes * 60 * 1000) {
        continue;
      }

      const endMin = min + 30;
      const startTime = `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
      const endTime = `${String(Math.floor(endMin / 60)).padStart(2, '0')}:${String(endMin % 60).padStart(2, '0')}`;

      const slotId = `${store.id}-${dateStr}-${startTime}`;

      // Check how many orders are already in this slot
      const ordersInSlot = existingOrders.filter(o => o.pickupSlot.id === slotId).length;

      const label = d === 0 ? `Today, ${formatTime(startTime)} – ${formatTime(endTime)}`
        : d === 1 ? `Tomorrow, ${formatTime(startTime)} – ${formatTime(endTime)}`
        : `${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}, ${formatTime(startTime)} – ${formatTime(endTime)}`;

      slots.push({
        id: slotId,
        date: dateStr,
        startTime,
        endTime,
        label,
      });

      // Allow up to 5 orders per slot
      if (ordersInSlot >= 5) {
        slots[slots.length - 1] = { ...slots[slots.length - 1], id: slotId + '-full' };
      }
    }
  }

  return slots;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}
