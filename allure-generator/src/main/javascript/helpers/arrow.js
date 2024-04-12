import { SafeString } from "handlebars/runtime";

export default function(status = "unknown") {
  if (status === "failed") {
    return new SafeString(`<span class="fa fa-times fa-fw text_status_${status}"></span>`);
  } else {
    return new SafeString(`<span class="fa fa-chevron-right fa-fw text_status_${status}"></span>`);
  }
}
