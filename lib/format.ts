const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number) {
  return currencyFormatter.format(amount);
}

const numberFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0,
});

/** Format a whole number with Indonesian thousands separators (e.g. 50000 -> "50.000"). */
export function formatNumber(amount: number) {
  return numberFormatter.format(amount);
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatDate(date: Date) {
  return dateFormatter.format(date);
}

export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 0) return "";

  if (digits.startsWith("62")) {
    const rest = digits.slice(2);
    if (rest.length <= 3) return `+62 ${rest}`;
    if (rest.length <= 7) return `+62 ${rest.slice(0, 3)} ${rest.slice(3)}`;
    return `+62 ${rest.slice(0, 3)} ${rest.slice(3, 7)} ${rest.slice(7, 12)}`;
  }

  if (digits.startsWith("0")) {
    const rest = digits.slice(1);
    if (rest.length <= 3) return `0${rest}`;
    if (rest.length <= 7) return `0${rest.slice(0, 3)} ${rest.slice(3)}`;
    return `0${rest.slice(0, 3)} ${rest.slice(3, 7)} ${rest.slice(7, 12)}`;
  }

  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7, 12)}`;
}

export function formatName(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhoneNumber(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("62")) {
    return digits.length >= 10 && digits.length <= 12;
  }
  if (digits.startsWith("0")) {
    return digits.length >= 10 && digits.length <= 11;
  }
  return digits.length >= 10;
}
