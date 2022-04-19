import { Schema, model } from "mongoose";

interface IDevice {
  id: number,
  name: string,
  func: string,
  status: number,
	open?: boolean,
	openStartTime?: number,
	timeout: number,
	partnerId: number
}

const deviceSchema = new Schema<IDevice>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  func: { type: String, required: true },
  status: { type: Number, required: true },
	open: Boolean,
	openStartTime: Number,
  timeout: { type: Number, required: true },
  partnerId: { type: Number, required: true },
});

const Device = model<IDevice>('Device', deviceSchema, 'device');
export default Device;