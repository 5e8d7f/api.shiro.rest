import Elysia from "elysia";
import postgres from "postgres";
import { codeRegex, moneyToCredits } from "../utils/convert";

const sql = postgres(process.env.DATABASE_URL!);

export const CryptomusController = (app: Elysia) => {
  app.post(
    "/callback",
    async ({
      set,
      body: { order_id, status, payment_amount_usd },
    }: {
      set: { status: number };
      body: { order_id: string; status: string; payment_amount_usd: string };
    }) => {
      if (!codeRegex.test(order_id)) {
        set.status = 400;
        return { message: "Invalid order id" };
      }
      if (status === "PAID" || status === "PAID_OVER") {
        const credits = moneyToCredits(payment_amount_usd);
        console.log(`Payment for order ${order_id} is successful!`);
        await sql`INSERT INTO invoices(receipt_id, amount) VALUES(${order_id}, ${credits})`;
        set.status = 200;
        return { message: "Payment successful" };
      } else {
        set.status = 400;
        return { message: "Payment failed" };
      }
    },
  );

  return Promise.resolve(app);
};
