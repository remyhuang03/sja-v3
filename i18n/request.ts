import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const selected = (await cookies()).get("sja_locale")?.value;
  const locale = selected === "en" || selected === "ja" ? selected : "zh";
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: "UTC",
  };
});
