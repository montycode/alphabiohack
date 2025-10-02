import { Resend } from "resend";
// Ensure bundler resolves optional peer for Resend's dynamic import
import "@react-email/render";

export const resend = new Resend(process.env.RESEND_API_KEY!);
