import moment from "moment";

export async function getRequestField(
  name: string,
  request: Request,
  options: {
    stringified: boolean;
  } = {
    stringified: true,
  }
) {
  // clone the request to get a copy because we have error when trying read the same
  // request twice and to not modify the original request
  const requestClone = request.clone();
  const formData = await requestClone.formData();

  const _action = formData.get(name)?.toString() ?? "";
  // parse the _action from the form data, parsing is needed because the form data is stringified
  return options.stringified ? JSON.parse(_action) : _action;
}

export function formatUtc(initialDateStr: Date) {
  // Initial date string
  const date = moment.utc(initialDateStr);

  // Get the local timezone offset in minutes
  const offsetMinutes = new Date().getTimezoneOffset();

  // Convert offset from minutes to hours
  const offsetHours = offsetMinutes / 60;

  // Adjust the date based on the local timezone offset
  date.add(-offsetHours, "hours");
  return date.startOf("day").toDate();
}