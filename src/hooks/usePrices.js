import { useOrders } from "contexts/OrdersContext";

const usePrices = () => {
  const { taxes } = useOrders();

  const getSubTotal = (items) => {
    let total = items.reduce(
      (accumulator, item) =>
        accumulator +
        item.quantity *
          ((item.discountedPrice ? item.discountedPrice : item.price) +
            getItemCustomizationsPrice(item)),
      0
    );

    return total;
  };

  const getItemCustomizationsPrice = (item) => {
    if (!item.customizations) return 0;
    let totalCustomizations = item.customizations.reduce(
      (acc, itm) => acc + itm.price,
      0
    );

    return totalCustomizations;
  };

  const getCustomizationsPrice = (item) => {
    let totalCustomizations = item
      .filter((i) => i.customizations && i.customizations.length > 0)
      .reduce(
        (accumulator, item) =>
          accumulator +
          item.customizations.reduce((acc, itm) => acc + itm.price, 0),
        0
      );

    return totalCustomizations;
  };

  const getTotalPrice = (items, shipping = 0, vouchers = []) => {
    let total = getSubTotal(items);

    let voucherDiscounts = vouchers.reduce(
      (accumulator, voucher) => accumulator + voucher.percentage,
      0
    );

    let beforeTaxes = total - (total * voucherDiscounts) / 100;
    let afterTaxes = beforeTaxes + (beforeTaxes * taxes.percentage) / 100;

    return afterTaxes + shipping;
  };

  const getTotalDiscount = (items, vouchers = []) => {
    let discounts = items.reduce(
      (accumulator, item) =>
        accumulator +
        (item.price * item.quantity - item.discountedPrice * item.quantity),
      0
    );

    let voucherDiscounts = vouchers.reduce(
      (accumulator, voucher) => accumulator + voucher.percentage,
      0
    );

    let totals = (getSubTotal(items) * voucherDiscounts) / 100;

    return Math.abs(totals + discounts);
  };

  return {
    getSubTotal,
    getTotalPrice,
    getItemCustomizationsPrice,
    getCustomizationsPrice,
    getTotalDiscount,
  };
};

export default usePrices;
