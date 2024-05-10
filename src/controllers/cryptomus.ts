import Elysia from "elysia";
import postgres from "postgres";
import { moneyToCredits } from "../utils/convert";

const sql = postgres({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

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
      if (status === "paid" || status === "paid_over") {
        const credits = moneyToCredits(payment_amount_usd);
        console.log(`Payment for order ${order_id} is successful!`);
        await sql`INSERT INTO invoices(code, amount) VALUES(${order_id}, ${credits})`;
        set.status = 200;
        return { message: "Payment successful" };
      } else {
        console.log(`Payment for order ${order_id} failed!`);
        set.status = 400;
        return { message: "Payment failed" };
      }
    },
  );

  return Promise.resolve(app);
};
