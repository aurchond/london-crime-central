export const toTitleCase = (str: String): String => {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

export const PrettyPrintObject = (Object: any):String => {
  // trim the starting and ending braces after converting to string
  let objString = (JSON.stringify(Object)).slice(1,-1);

  // clean up the string
  return objString.replace(/\"/g, "")
                  .replace(/,/g, " | ")
                  .replace(/:/g, ": ")
                  .replace("deltaCrimeRate", "CrimeRateChange")

}