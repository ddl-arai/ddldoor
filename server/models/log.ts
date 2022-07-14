import mongoose, { Schema, model } from "mongoose";
const autoIncrement = require('mongoose-sequence')(mongoose);

interface ILog {
  no: number,
  sec: number,
  idm?: string,
  id?: number,
  name?: string,
  devid: number,
  devName?: string,
  prevStat?: number,
  result: number
}

const logSchema = new Schema<ILog>({
  no: { type: Number, required: true },
  sec: { type: Number, required: true },
  idm: String,
  id: Number,
  name: String,
  devid: { type: Number, required: true },
  devName: String,
  prevStat: Number,
  result: { type: Number, required: true },
});

logSchema.plugin(autoIncrement, {inc_field: 'no'});

const Log = model<ILog>('Log', logSchema, 'log');
export default Log;