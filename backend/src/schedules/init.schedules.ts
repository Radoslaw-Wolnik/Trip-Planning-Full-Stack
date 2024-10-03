import cron from 'node-cron';
import { cronSchedules } from './cron-schedules';

export const initializeSchedules = () => {
  cronSchedules.forEach(({ name, schedule, job }) => {
    cron.schedule(schedule, async () => {
      console.log(`Starting scheduled job: ${name}`);
      await job();
      console.log(`Completed scheduled job: ${name}`);
    });
    console.log(`Scheduled job: ${name} - ${schedule}`);
  });
};