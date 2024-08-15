import { reservationModel } from "../../../DB/models/Reservation.model.js";
import { httpStatus } from "../../../utils/httpStatus.js";
import { getAllRecordsInRedis } from "../../../utils/redisHandler.js";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getReservations = async (req, res, next) => {
  try {
    const reservations = await getAllRecordsInRedis(
      "reservations",
      reservationModel
    );
    console.log("reservations: ", reservations);

    const findReservationsBasedOnDueDate = (params) => {
      const { from_due_date, to_due_date } = params;

      return reservations.filter((reservation) => {
        if (!reservation) {
          return false;
        }
        const fromDueDate = from_due_date
          ? new Date(reservation.due_date) >= new Date(from_due_date)
          : true;

        const toDueDate = to_due_date
          ? new Date(reservation.due_date) <= new Date(to_due_date)
          : true;
        console.log("from_due_date: ", fromDueDate);
        console.log("to_due_date: ", toDueDate);
        return fromDueDate && toDueDate;
      });
    };

    if (req.query.export == "excel") {
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      // res.setHeader("Content-Disposition", "attachment; filename=" + "reservations.xlsx");
      // const filePath = path.join(__dirname, 'reservations.xlsx');
      // return res.download(filePath, 'reservations.xlsx', (err) => {
      //   if (err) {
      //     console.error('Error downloading the file:', err);
      //     res.status(500).send('Error downloading the file');
      //   }
      // });
      const filePath = await exportFilteredReservations(
        findReservationsBasedOnDueDate(req.query)
      ); 
      
      res.setHeader('Content-Disposition', 'attachment; filename="reservations.xlsx"');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      
       return res.download(filePath, "reservations.xlsx", (err) => {
        if (err) {
          console.log(err);
          next(err);
        }
      });
    }

    return res.status(httpStatus.OK.code).json({
      message: httpStatus.OK.message,
      data: reservations ?? [],
    });
  } catch (err) {
    console.error(err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR.code)
      .json({
        message: httpStatus.INTERNAL_SERVER_ERROR.message,
        error: err?.message,
      });
  }
};

async function exportFilteredReservations(filteredReservations) {
  try {
    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reservations");

    // Define columns
    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Book ID", key: "book_id", width: 10 },
      { header: "Borrower ID", key: "borrower_id", width: 10 },
      { header: "Due Date", key: "due_date", width: 32 },
    ];

    // Add filtered reservations to the worksheet
    filteredReservations.forEach((reservation) => {
      worksheet.addRow(reservation);
    });

    // Define the path where you want to save the file
    const publicDir = path.join(__dirname, "../../../../public");
    if (!fs.existsSync(publicDir)) {
      console.log("Directory does not exist ", publicDir);
      fs.mkdirSync(publicDir);
    }
    // Change ownership and permissions of the public folder
    //  const uid = os.userInfo().uid;
    //  const gid = os.userInfo().gid;
    //  fs.chownSync(publicDir, uid, gid);
    //  fs.chmodSync(publicDir, 0o755); // Read and write permissions

    const filePath = path.join(publicDir, "reservations.xlsx");

    // Write the workbook to the specified file path
    await workbook.xlsx.writeFile(filePath);

    console.log(`File saved to ${filePath}`);
    return filePath;
    // return workbook;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}
