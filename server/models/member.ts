import { Schema, model } from "mongoose";

interface IMember {
  id: number,
  name: string,
  lastname: string,
  firstname: string,
  company: string,
  enable: boolean,
  status: number
}

const memberSchema = new Schema<IMember>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  firstname: { type: String, required: true },
  company: { type: String, required: true },
  enable: { type: Boolean, required: true },
  status: { type: Number, required: true },
});

const Member = model<IMember>('Member', memberSchema, 'member');
export default Member;