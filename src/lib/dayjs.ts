import dayjs from "dayjs";
import "dayjs/locale/es-mx";
import customParseFormat from "dayjs/plugin/customParseFormat";

// `customParseFormat` is required to parse the `YYYY-MM-DD` strings the date
// filters exchange with the API in strict mode.
dayjs.extend(customParseFormat);
dayjs.locale("es-mx");

export default dayjs;
