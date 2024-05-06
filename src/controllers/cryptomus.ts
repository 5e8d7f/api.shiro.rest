import Elysia from "elysia";
import postgres from "postgres";
import { codeRegex } from "../utils/convert";

const sql = postgres(process.env.DATABASE_URL!);

export const CryptomusController = (app: Elysia) => {
  app.post(
    "/callback",
    async ({
      set,
      body: { order_id, status, additional_data },
    }: {
      set: { status: number };
      body: { order_id: string; status: string; additional_data: string };
    }) => {
      if (!codeRegex.test(order_id)) {
        set.status = 400;
        return { message: "Invalid order id" };
      }
      if (status === "PAID" || status === "PAID_OVER") {
        const credits = parseInt(additional_data);
        console.log(`Payment for order ${order_id} is successful!`);
        await sql`INSERT INTO invoices(receipt_id, amount) VALUES(${order_id}, ${credits})`;
        set.status = 200;
        return { message: "Payment successful" };
      } else {
        console.log(`Payment for order ${order_id} is failed!`);
        set.status = 400;
        return { message: "Payment failed" };
      }
    },
  );

  return Promise.resolve(app);
};
