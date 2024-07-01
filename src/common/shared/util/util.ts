export class Util {

  static objectMap(obj, fn) {
    Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));
  }

  replaceUrl(endpoint: string, replacements: Record<string, string>) {
    let url = `/${endpoint}`;
    for (const key in replacements) {
      url = url.replace(`{${key}}`, replacements[key]);
    }
    return url;
  }
}
