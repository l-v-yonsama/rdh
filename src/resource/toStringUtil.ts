import { ResultSetData, ToStringParam } from "../types";
import { CsvString } from "./string/CsvString";
import { HtmlString } from "./string/HtmlString";
import { MarkdownString } from "./string/MarkdownString";
import { PlainString } from "./string/PlainString";

type ContentType = "plain" | "html" | "markdown" | "csv";

export const toContentString = (
  rdh: ResultSetData,
  contentType: ContentType,
  params?: ToStringParam
): string => {
  switch (contentType) {
    case "plain":
      return new PlainString(rdh, params).toString();
    case "html":
      return new HtmlString(rdh, params).toString();
    case "markdown":
      return new MarkdownString(rdh, params).toString();
    case "csv":
      return new CsvString(rdh, params).toString();
  }
};
