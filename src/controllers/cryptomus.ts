import Elysia, { t } from "elysia";
import { Cryptomus } from "cryptomus-sdk";

const cryptomus = new Cryptomus(
  process.env.MERCHANT_ID!,
  process.env.PAYMENT_KEY!,
  process.env.PAYOUT_KEY!,
);

export const CryptomusController = (app: Elysia) => {
  app.get("/check/:code", async ({ params: { code } }) => {
    const checkPayment = await cryptomus.getPaymentInfo({
      order_id: code,
    });

    return {
      success:
        checkPayment.result.status === "PAID" ||
        checkPayment.result.status === "PAID_OVER",
    };
  });
  app.post(
    "/create/:amount",
    async ({ params: { amount } }: { params: { amount: string } }) => {
      const code = `SHIRO-${Math.random().toString(36).substr(2, 9)}-REST`;

      const createPayment = await cryptomus.createPayment({
        amount: amount.toString(),
        currency: "USD",
        order_id: code,
        additional_data: code,
        url_callback: "https://api.shiro.rest/callback",
        url_return: `https://www.shiro.rest/success/${code}`,
      });

      return {
        code,
        payment_url: createPayment.result.url,
      };
    },
  );

  app.post(
    "/callback",
    async ({
      body: { order_id, status },
    }: {
      body: { order_id: string; status: string };
    }) => {
      if (status === "PAID" || status === "PAID_OVER") {
        console.log(`Payment for order ${order_id} is successful!`);
      }

      return "ok";
    },
  );

  return Promise.resolve(app);
};
