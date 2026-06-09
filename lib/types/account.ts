export type Account = {
  id: string;
  name: string;
  type: "CHECKING" | "SAVING" | "CREDIT_CARD" | "CASH";
  balance: number;
};
