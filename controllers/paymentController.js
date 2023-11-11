const YooMoney = require("yookassa");

const yooMoney = new YooMoney({
  shopId: "your_shop_id",
  secretKey: "test_wbWIHfjZHhE7DNMZ5hSJ EmrByg Mtk73embHkCNE3Hxs",
  isTest: true,
});
async function createPayment(req, res) {
  try {
    const { amount } = req.body;

    const payment = await yooMoney.createPayment({
      amount: {
        value: amount,
        currency: "RUB",
      },
      description,
      confirmation: {
        type: "redirect",
        return_url: "http://your_redirect_url.com",
      },
    });

    res.json({
      paymentConfirmationUrl: payment.confirmation.confirmation_url,
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ error: "Payment failed" });
  }
}

module.exports = { createPayment };
