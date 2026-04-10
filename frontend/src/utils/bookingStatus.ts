export const getDisplayStatus = (status: string) => {
  switch (status) {
    case "upcoming":
    case "startRequested":
      return "upcoming";

    case "inprogress":
    case "completionRequested":
      return "inprogress";

    default:
      return status;
  }
};

export const formatStatusLabel = (status: string) =>
  status.replace("_", " ").toUpperCase();
