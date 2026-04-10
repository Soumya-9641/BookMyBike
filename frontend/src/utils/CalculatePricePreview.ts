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

    rentalAmount = Math.round(hours * hourlyRate);
    totalDays = 1;
    priceType = "hourly";
  } else {
    if (!dailyRate) return null;

    totalDays = Math.ceil(hours / 24);
    rentalAmount = Math.round(totalDays * dailyRate);
    priceType = "daily";
  }

  const deposit = Math.round(depositAmount);
  const totalToPay = rentalAmount + deposit;

  return {
    priceType,
    hours,
    totalDays,
    rentalAmount,
    deposit,
    totalToPay,
  };
};