import React, { useState } from "react";

import { Grid } from "@mui/material";

import {
  SquarePaymentForm,
  CreditCardNumberInput,
  CreditCardExpirationDateInput,
  CreditCardPostalCodeInput,
  CreditCardCVVInput,
  CreditCardSubmitButton,
} from "react-square-payment-form";
import "react-square-payment-form/lib/default.css";
import ReactLoading from "react-loading";

import axios from "utils/axios";
import usePrices from "hooks/usePrices";
import useStorage from "hooks/useStorage";
import { useCart } from "react-use-cart";
import { useRouter } from "next/router";
import useAuth from "contexts/useAuth";
import { SERVER_URL } from "constant";

const MyPaymentForm = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { getItem, removeItem } = useStorage();
  const { getTotalPrice } = usePrices();
  const { items, emptyCart } = useCart();

  const vouchers = getItem("vouchers") || [];
  const shipping = getItem("shipping") || {};
  const billingInfo = getItem("billingInfo") || {};

  const [errorMessages, setErrorMessages] = useState([]);
  const [attemptingPayment, setAttemptingPayment] = useState(false);

  const cardNonceResponseReceived = async (
    errors,
    nonce,
    cardData,
    buyerVerificationToken
  ) => {
    setAttemptingPayment(true);

    if (errors) {
      console.log(errors);
      setErrorMessages(errors.map((error) => error.message));
      setAttemptingPayment(false);
      return;
    }

    setErrorMessages([]);
    console.info(
      "nonce created: " +
        nonce +
        ", buyerVerificationToken: " +
        buyerVerificationToken,
      cardData
    );

    // send payment attempt to backend
    let billing = getItem("billingInfo");
    let shipping = getItem("shipping");
    let vouchers = getItem("vouchers");

    // setup customizations
    let cart = [...items];
    try {
      // upload images for each customization
      for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        if (item.customizations) {
          for (let j = 0; j < item.customizations.length; j++) {
            let customization = item.customizations[j];
            if (
              customization.uploadedImage &&
              customization.uploadedImage.size &&
              customization.uploadedImage.size > 0
            ) {
              let data = await uploadImage(customization.uploadedImage);
              cart[i].customizations[j].image = data[0].id;
            }
            cart[i].customizations[j].area = customization.area.name;
            cart[i].customizations[j].content =
              customization.uploadedText || "";
          }
        }
      }

      // send oreder to backend
      const info = {
        cart: cart,
        billing: billing,
        // delivery: deliveryDate,
        card: { nonce },
        shippingOptions: shipping,
        vouchers: vouchers,
      };

      let res = await axios.post("/orders", info);
      emptyCart();
      removeItem("vouchers");
      if (user) router.push(`/orders/${res.data.id}?pid=${res.data.sessionID}`);
      else router.push(`/guest-order/${res.data.id}?pid=${res.data.sessionID}`);
    } catch (error) {
      console.log(error);
    }

    setAttemptingPayment(false);
  };

  const uploadImage = async (file, reference, refID) => {
    const formData = new FormData();

    formData.append("files", file);
    formData.append("field", "image");

    let res = await axios.post(SERVER_URL + "/upload", formData);
    return res.data;
  };

  const createVerificationDetails = () => {
    return {
      amount: getTotalPrice(items, shipping.cost, vouchers).toFixed(2),
      currencyCode: "GBP",
      intent: "CHARGE",
      billingContact: {
        familyName: billingInfo?.billing_surname,
        givenName: billingInfo?.billing_name,
        email: billingInfo?.billing_email,
        country: "GB",
        // city: "London",
        addressLines: [
          billingInfo?.billing_address1,
          billingInfo?.billing_address2,
        ],
        postalCode: billingInfo?.billing_zip,
        phone: billingInfo?.billing_contact,
      },
    };
  };

  return (
    <Grid container justifyContent={"center"}>
      {attemptingPayment && <ReactLoading type={"bars"} color="#D23F57" />}
      {!attemptingPayment && (
        <>
          <SquarePaymentForm
            sandbox={true}
            applicationId={"sandbox-sq0idb-nRtZJlB3dQXlZ2EjanCA0g"}
            locationId={"L6N861BSAHXWF"}
            cardNonceResponseReceived={cardNonceResponseReceived}
            createVerificationDetails={createVerificationDetails}
          >
            <fieldset className="sq-fieldset">
              <CreditCardNumberInput />
              <div className="sq-form-third">
                <CreditCardExpirationDateInput />
              </div>

              <div className="sq-form-third">
                <CreditCardPostalCodeInput />
              </div>

              <div className="sq-form-third">
                <CreditCardCVVInput />
              </div>
            </fieldset>

            <style>
              {`
            .sq-creditcard {
                background: #D23F57;
            }`}
            </style>
            <CreditCardSubmitButton>
              Pay £{getTotalPrice(items, shipping.cost, vouchers).toFixed(2)}
            </CreditCardSubmitButton>
          </SquarePaymentForm>

          <div className="sq-error-message">
            {errorMessages &&
              errorMessages.length > 0 &&
              errorMessages.map((errorMessage) => (
                <li key={`sq-error-${errorMessage}`}>{errorMessage}</li>
              ))}
          </div>
        </>
      )}
    </Grid>
  );
};

export default MyPaymentForm;
