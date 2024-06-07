import { Request, Response } from "express-serve-static-core";
import { boldPath, errorHandler, normalPath } from "../util";
import z from "zod";
import { SummarySchema } from "../validator";
import PDFDocument from "pdfkit-table";
import fs from "fs";
import path from "path";
import dayjs from "dayjs";
type IUserAuthBody = z.infer<typeof SummarySchema>;
export function pdfGenerator(
  req: Request<{}, {}, IUserAuthBody>,
  res: Response
) {
  try {
    SummarySchema.parse(req.body);
    console.log(req.body);
    const doc = new PDFDocument({
      font: normalPath,
      info: { Title: "Reserve Receipt", Author: "github.com/434huzaifa" },
      size: "A4",
      margins: { top: 72, left: 54, right: 54, bottom: 54 },
    });
    let maxWidth = doc.page.width / 2 - 5 - 50;
    doc.x = doc.page.margins.left;
    doc.y = doc.page.margins.top;
    doc.pipe(fs.createWriteStream(`output.pdf`));
    doc.image(path.join(__dirname, "..", "..", "public", "sport.png"), {
      width: 80,
    });
    doc.fontSize(10);
    doc.text(
      "CH Car Place inc \n162 Bergen st \nBrooklyn, NY 11213\nPH#",
      doc.x + 80 + 20
    );
    let t_y = doc.y;
    doc.text(
      "Monday 9:00 AM-6:00 PM\nTuesday 9:00 AM-6:00 PM\nWednesday 9:00 AM-6:00 \nPM\nThursday 9:00 AM-6:00 PM\nFriday 9:00 AM-6:00 PM\nSaturday 9:00 AM-6:00 PM\nSunday 9:00 AM-6:00 PM",
      doc.x,
      doc.y + 10
    );
    doc.font(boldPath);
    doc.text("RENTER INFO", doc.x - 80 - 20, t_y + 20).moveDown(0.5);
    doc.font(normalPath);
    doc
      .text(
        `${req.body.personalInfo.FirstName} ${req.body.personalInfo.LastName}\n${req.body.personalInfo.email}\nPH: ${req.body.personalInfo.phoneNumber}`
      )
      .moveDown(3.5);
    doc.font(boldPath);
    doc.text("ADDITIONAL AUTHORIZED DRIVER (s)").moveDown(1);
    doc.text("UNIT DETAILS").moveDown(0.5);
    doc.font(normalPath);
    doc
      .text(
        `Unit: ${req.body.carInfo.type}\nMake & Model: ${req.body.carInfo.make} ${req.body.carInfo.model} ${req.body.carInfo.year}`
      )
      .moveDown(1);
    doc.font(boldPath);
    doc.text("BILL TO:").moveDown(0.5);
    doc.font(normalPath);
    doc.text("Payment Type: Unpaid\nAUTH: $0.00").moveDown(1.5);
    t_y = doc.y;
    let t_x = doc.x;
    doc
      .text(
        "Referral:\nNOTICE: Collision Insurance (CDW) - $7 per day Limits liability of damages to one's own vehicle up to $1000 in event of an accident, by waiving this coverage renter agrees to be hold liable for damages up to the entire value of the vehicle.",
        { width: maxWidth, lineBreak: true }
      )
      .moveDown(1);
    doc
      .text("Accept", doc.x + maxWidth / 4 - 20, doc.y, {
        width: maxWidth,
        continued: true,
      })
      .text("Reject", doc.x + 70, doc.y, { width: maxWidth })
      .moveDown(1);
    doc.text(
      "Rental service may be refused anyone when done in the best interest of the renting company or customer - Rates do not include gasoline. - Reserves the right to collect deposit covering estimated rental charges.",
      t_x,
      doc.y,
      { width: maxWidth, lineBreak: true }
    );
    doc.x = maxWidth + 11 + 50;
    doc.y = doc.page.margins.top;
    doc.font(boldPath);
    doc.fontSize(14).text("Reservation").moveDown(0.1);
    doc.fontSize(12).text(`${req.body.reservationId}`).moveDown(0.1);
    doc.font(normalPath);
    doc.fontSize(14);
    doc.text("REPAIR ORDER:").moveDown(0.1);
    doc.text("CLAIM:").moveDown(0.1);
    doc.fontSize(12);
    doc.text(`Date/Time Out: ${req.body.pickupdate}`).moveDown(0.1);
    doc.text(`Date/Time In: ${req.body.returndate}`).moveDown(0.7);
    const summaryData = req.body.summary.map((item) => {
      if (item.Charge == "Discount") {
        return {
          Charge: { label: item.Charge.toString() + "(%)" },
          Unit: { label: item.Unit ? item.Unit.toFixed(2).toString() : "" },
          Rate: { label: item.Rate ? item.Rate.toFixed(2).toString() : "" },
          Total: {
            label: item.Total ? "-" + item.Total.toFixed(2).toString() : "",
          },
        };
      } else if (item.Charge == "Return Tax") {
        return {
          Charge: { label: item.Charge.toString() + "(%)" },
          Unit: { label: item.Unit ? item.Unit.toFixed(2).toString() : "" },
          Rate: { label: item.Rate ? item.Rate.toFixed(2).toString() : "" },
          Total: {
            label: item.Total ? "+" + item.Total.toFixed(2).toString() : "",
          },
        };
      } else {
        return {
          Charge: { label: item.Charge.toString() },
          Unit: { label: item.Unit ? item.Unit.toFixed(2).toString() : "" },
          Rate: { label: item.Rate ? item.Rate.toFixed(2).toString() : "" },
          Total: {
            label: item.Total ? "$" + item.Total.toFixed(2).toString() : "",
          },
        };
      }
    });
    doc.font(normalPath);
    const table = {
      title: "CHARGE SUMMARY",
      headers: [
        { label: " ", property: "Charge", width: 80 },
        { label: "Unit", property: "Unit", width: 50 },
        { label: "Rate", property: "Rate", width: 50 },
        { label: "Total", property: "Total", width: 50 },
      ],
      datas: summaryData,
      options: {
        divider: {
          header: { disabled: true },
          horizontal: { disabled: true },
        },
      },
    };
    doc.table(table);
    doc.moveDown(2);
    doc.x = maxWidth + 11 + 50;
    doc
      .font(normalPath)
      .fontSize(11)
      .text(
        "Your rental agreement offers, for an additional charge, an optional waiver to cover all or a part of your responsibility for damage to or loss of the vehicle: Before deciding whether to purchase the walver, you may wish to determine whether your own automobile insurance or credit card agreement provides you coverage for rental vehicle damage or loss and determine the amount of the deductible under your own insurance coverage. The purchase of the waiver is not mandatory. The waiver is not Insurance. I acknowledge that I have received and read a copy of this."
      )
      .moveDown(1);
    doc.text("Renters Signature").moveDown(0.6);
    doc
      .opacity(1)
      .moveTo(doc.x, doc.y)
      .lineTo(doc.page.width - doc.page.margins.left, doc.y)
      .dash(5, { space: 5 })
      .stroke()
      .moveDown(2);
    doc.text("Additional Driver 1").moveDown(0.6);
    doc
      .moveTo(doc.x, doc.y)
      .lineTo(doc.page.width - doc.page.margins.left, doc.y)
      .dash(5, { space: 5 })
      .stroke();
    doc.end();
    res.send(200);
  } catch (error) {
    errorHandler(res, error);
  }
}
