/**
 * Validation rules for forms
 *
 * Note: Every validation line will check if val is empty.
 * This will prevent the rule to decline an empty value.
 */

import isEmpty from "validator/lib/isEmpty";
import isEmail from "validator/lib/isEmail";

export function required(val = "") {
  const message = "Dit veld is verplicht";
  if (typeof val === "string") return !isEmpty(val) || message;
  return +val !== 0 || message;
}

export function email(val = ""): true | string {
  return isEmpty(val) || isEmail(val) || "Vul een geldig e-mailadres in";
}

export const match =
  (regex: RegExp, message: string) =>
  (val = ""): true | string =>
    isEmpty(val) || !!val.match(regex) || message;
