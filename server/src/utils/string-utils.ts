import * as randomString from "randomized-string";
import slugify from "slugify";

export function randString(length: number = 6) {
  return randomString.generate({
    length,
    charset: "alphanumeric",
  });
}

type makeSlugOptions =
  | {
      replacement?: string;
      remove?: RegExp;
      lower?: boolean;
      strict?: boolean;
      locale?: string;
      trim?: boolean;
    }
  | string;

export function makeSlug(
  text: string,
  options: makeSlugOptions = { lower: true }
) {
  return slugify(text, options);
}
