import { reservationModel } from "../../../DB/models/Reservation.model.js";
import { httpStatus } from "../../../utils/httpStatus.js";
import { getAllRecordsInRedis } from "../../../utils/redisHandler.js";

export const getReservations = async (req, res, next) => {
  try {
    const reservations = await getAllRecordsInRedis(
      "reservations",
      reservationModel
    );
    const findReservationsBasedOnDueDate = (params) => {
      const { from_due_date, to_due_date } = params;
      return reservations.filter((reservation) => {
        if (!reservation) {
          return false;
        }
        const fromDueDate = reservation.due_date >= new Date(from_due_date);
        const toDueDate = reservation.due_date >= new Date(to_due_date);
        return fromDueDate && toDueDate;
      });
    };
    

    return res.status(httpStatus.OK.code).json({
      message: httpStatus.OK.message,
      data: reservations,
    });
  } catch (err) {
    console.error(err);

    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .json({ message: httpStatus.INTERNAL_SERVER_ERROR.message });
  }
};
