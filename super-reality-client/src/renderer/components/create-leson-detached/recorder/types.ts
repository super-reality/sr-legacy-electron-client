/* eslint-disable camelcase */

export interface StepData {
  name: string; // "_x-820_y-98_time_00-00-01-431.jpeg"
  x_cordinate: number;
  y_cordinate: number;
  time_stamp: string; // "00:00:01:431"
}

export interface RecordingJson {
  step_data: StepData[];
}
