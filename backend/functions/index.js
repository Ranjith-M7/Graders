const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const crypto = require("crypto");
const cors = require("cors")({ origin: true });
const Razorpay = require("razorpay");

admin.initializeApp();

exports.razorpayWebhook = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const secret = "123456";
      const paymentLink = req.body.paymentLink;
      const additionalParams = req.body.additionalParams;
      const receivedSignature = req.headers["x-razorpay-signature"];
      const requestBody = JSON.stringify(req.body);

      console.log("Payment link:", paymentLink);
      console.log("Additional params:", additionalParams);

      // Validate the webhook signature
      const shasum = crypto.createHmac("sha256", secret);
      shasum.update(requestBody);
      const computedSignature = shasum.digest("hex");
      console.log("computedSignature:", computedSignature);

      if (computedSignature === receivedSignature) {
        // Signature is valid, process the webhook event
        const eventType = req.body.event;
        const eventData = req.body.payload;
        console.log("eventtype:", eventType);
        console.log("eventData", eventData);

        let paymentDetails = null;
        let paymentId;
        let orderId;
        let amount;
        let currency;
        let method;
        let paymentStatus;
        let email;
        let contact;

        switch (eventType) {
          case "payment.captured":
            paymentId = eventData.payment.entity.id;
            orderId = eventData.payment.entity.order_id;
            amount = eventData.payment.entity.amount;
            currency = eventData.payment.entity.currency;
            method = eventData.payment.entity.method;
            paymentStatus = eventData.payment.entity.status;
            email = eventData.payment.entity.email;
            contact = eventData.payment.entity.contact;

            // Example: Save payment details to Firebase Realtime Database
            await admin.database().ref(`payments/${paymentId}`).set({
              orderId,
              amount,
              currency,
              contact,
              email,
              method,
              status: paymentStatus,
              timestamp: admin.database.ServerValue.TIMESTAMP,
            });

            console.log("Payment captured:", eventData.payment.entity);

            paymentDetails = {
              paymentId,
              orderId,
              amount,
              currency,
              paymentStatus,
              email,
              contact,
              method,
            };
            break;

          case "payment.failed":
            // Payment failed
            console.log("Payment failed:", eventData.payment.entity);
            break;

          default:
            console.log("Unhandled event type:", eventType);
        }

        res.status(200).json({
          paymentDetails: paymentDetails,
        });
      } else {
        // Signature verification failed
        console.error("Invalid signature.");
        res.status(400).send("Invalid signature.");
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).send("Internal server error.");
    }
  });
});

let amount = 0;
let description = "";

exports.createRazorpayPaymentLink = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { categoryName } = req.query;

      console.log("Category Name:", categoryName);
      const razorpay = new Razorpay({
        key_id: "rzp_test_ZYdrAriZ7HQFvR",
        key_secret: "9Vl4wcwjfDoDkAFC3yPjhkUL",
      });

      if (categoryName === "Junior Suite") {
        amount = 200000;
        description = "Payment for Category 1";
      } else if (categoryName === "Executive Suite") {
        amount = 400000;
        description = "Payment for Category 2";
      } else if (categoryName === "Super Deluxe") {
        amount = 800000;
        description = "Payment for Category 2";
      } else {
        throw new Error("Invalid category Name");
      }

      const paymentLink = await razorpay.paymentLink.create({
        amount: amount,
        currency: "INR",
        accept_partial: true,
        first_min_partial_amount: 100,
        description: description,
        customer: {
          name: "Kavin",
          email: "kavin@example.com",
          contact: "+919000090000",
        },
        notify: {
          sms: true,
          email: true,
        },
        reminder_enable: true,
        notes: {
          policy_name: "HotelR_1",
        },
        callback_url: "https://hotel-bfbe3.web.app/payment",
        callback_method: "get",
      });

      console.log("Payment link created:", paymentLink);
      res.status(200).json({ paymentLink });
    } catch (error) {
      console.error("Error creating payment link:", error);
      res.status(500).json({ error: "Error creating payment link" });
    }
  });
});
