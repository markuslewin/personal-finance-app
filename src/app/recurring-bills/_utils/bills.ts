export const getIsPaid = (date: number, bill: { day: number }) => {
  return bill.day < date;
};

export const getIsDueSoon = (date: number, bill: { day: number }) => {
  return !getIsPaid(date, bill) && bill.day < date + 5;
};
