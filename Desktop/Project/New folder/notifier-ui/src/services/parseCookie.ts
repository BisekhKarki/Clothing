//only return string

 

function parseCookie(
  cookie: string | undefined
): Record<string, string> | undefined {
  if (!cookie) return undefined;
  return cookie.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    return { ...acc, [key.trim()]: value };
  }, {});
}

export default parseCookie;
