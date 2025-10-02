"use client";

import { toast } from "sonner";
import { useTranslations } from "next-intl";

type SuccessOpt<T> = string | ((data: T) => string);
type ErrorOpt = string | ((err: unknown) => string);

export function useAppToast() {
  const tErrors = useTranslations("ApiErrors");

  function success(message: string) {
    toast.success(message);
  }

  function error(message: string) {
    toast.error(message);
  }

  function errorCode(code: string) {
    toast.error(tErrors(code));
  }

  function info(message: string) {
    toast(message);
  }

  function warning(message: string) {
    toast.warning(message);
  }

  function promise<T>(
    promise: Promise<T>,
    opts: {
      loading?: string;
      success?: SuccessOpt<T>;
      error?: ErrorOpt;
      extractErrorCode?: (err: unknown) => string | undefined;
    } = {}
  ) {
    return toast.promise(promise, {
      loading: opts.loading || "Loading...",
      success: (data) => {
        const s = opts.success;
        return typeof s === "function" ? s(data) : s || "Success";
      },
      error: (err) => {
        const code = opts.extractErrorCode?.(err);
        if (code) return tErrors(code);
        const e = opts.error;
        return typeof e === "function" ?
            e(err)
          : e || tErrors("internal_error");
      },
    });
  }

  return { success, error, errorCode, info, warning, promise };
}
