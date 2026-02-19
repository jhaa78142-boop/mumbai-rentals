export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function onlyDigits(value: string) {
  return value.replace(/\D+/g, "");
}
