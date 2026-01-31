/* eslint-disable import/no-duplicates */
import formatter from "date-fns/format";
import { nl } from "date-fns/locale";

const locales = { nl };

let curLocale = "nl";
const currency = "EUR";

/**
 * called from store/plugins/i18n when language is set
 * @param {*} locale
 */
export function setLocale(locale) {
  curLocale = locale;
}

export function formatMoney(value) {
  const NumberFormatter = new Intl.NumberFormat(curLocale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  });

  if (typeof value !== "number") {
    value = +value;
  }

  return NumberFormatter.format(value || 0);
}

// Thanks to this example: https://gist.github.com/zentala/1e6f72438796d74531803cc3833c039c

export function formatBytes(bytes) {
  if (+bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formatter = new Intl.NumberFormat(curLocale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(parseFloat(bytes / Math.pow(k, i))) + " " + sizes[i];
}

// https://date-fns.org/v2.29.3/docs/format
export function formatDate(value, format = "Pp") {
  if (value === null || value === undefined) {
    return "";
  }
  if (!(value instanceof Date)) {
    value = new Date(value);
  }

  try {
    return formatter(value, format, {
      locale: locales[curLocale],
    });
  } catch (e) {
    return value;
  }
}
