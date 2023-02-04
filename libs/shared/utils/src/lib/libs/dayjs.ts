import { default as dayjs } from 'dayjs';
import { default as utc } from 'dayjs/plugin/utc';
dayjs.extend(utc);

export default dayjs;
