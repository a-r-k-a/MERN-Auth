import { MailtrapClient } from "mailtrap";
import dotenv from 'dotenv';

dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;
export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});
export const sender = {
  email: "hello@demomailtrap.com",
  name: "Arkajyoti Das",
};
//the receipents will be dynamic
// const recipients = [
//   {
//     email: "arka02.das@gmail.com",
//   }
// ];
// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);