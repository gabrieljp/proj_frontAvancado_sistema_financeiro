export const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );
export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
export const date = (value: string) =>
  new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR");
export const message = (e: unknown) =>
  e instanceof Error ? e.message : "Ocorreu um erro. Tente novamente.";
