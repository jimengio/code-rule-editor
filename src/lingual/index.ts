import { zhCN } from "./zh-cn";
import { ILang } from "./interface";
import { enUS } from "./en-us";

// default locale is Chinese
export let lang: ILang = zhCN;

export function mesonUseZh() {
  lang = zhCN;
}

export function mesonUseEn() {
  lang = enUS;
}

export function formatString(template: string, data: { [k: string]: string }) {
  for (var key in data) {
    template = template.split(`{${key}}`).join(data[key]);
  }

  return template;
}
