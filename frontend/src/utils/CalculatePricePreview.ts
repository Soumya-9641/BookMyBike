interface PricePreviewInput {
  hours: number;
  hourlyRate?: number;
  dailyRate?: number;
  depositAmount: number;
}

export const calculatePricePreview = ({
  hours,
  hourlyRate,
  dailyRate,
  depositAmount,
}: PricePreviewInput) => {
  let rentalAmount = 0;
  let totalDays = 0;
  let priceType: "hourly" | "daily";

  if (hours < 24) {
    if (!hourlyRate) return null;
    rentalAmount = hours * hourlyRate;
    priceType = "hourly";
    totalDays = 1;
  } else {
    if (!dailyRate) return null;
    totalDays = Math.ceil(hours / 24);
    rentalAmount = totalDays * dailyRate;
    priceType = "daily";
  }

  const platformFee = rentalAmount * 0.18;        // 18%
  const vatAmount = platformFee * 0.20;           // 20% VAT on platform fee
  const platformFeeNet = platformFee - vatAmount; // admin net
  const listerPayout = rentalAmount - platformFee;

  const deposit = depositAmount;
  const totalToPay = rentalAmount + deposit;

  return {
    priceType,
    hours,
    totalDays,
    rentalAmount,
    deposit,
    totalToPay,

    platformFee,
    vatAmount,
    platformFeeNet,
    listerPayout,
  };
};