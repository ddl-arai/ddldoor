import { Schema, model } from "mongoose";

interface IHoliday {
  date: string,
  remark?: string,
}

const holidaySchema = new Schema<IHoliday>({
  date: { type: String, required: true },
  remark: String,
});

const Holiday = model<IHoliday>('Holiday', holidaySchema, 'holiday');
export default Holiday;