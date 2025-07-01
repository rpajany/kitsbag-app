import moment from 'moment';
import Swal from 'sweetalert2'
import { parse, format } from "date-fns";

// string :  value={safeValue(startData.description, "")}
// integer : value={safeValue(startData.order_qty, 0)}
export const safeValue = (val, fallback = "") => (val !== undefined && val !== null ? val : fallback);

export const DateFormat = (date, pattern = "yyyy-MM-dd") => {
  return date instanceof Date && !isNaN(date) ? format(date, pattern) : "";
};

export function date_strToObject(strDate) {
    const dateStr = strDate;
    const [day, month, year] = dateStr.split("-").map(Number); // Split the string and convert to numbers
    const dateObj = new Date(year, month - 1, day); // Month is zero-indexed in JS Date
    return dateObj;
}

export function date_strToFormat(strDate) {
    let objDate = date_strToObject(strDate);
    let localDate = moment(objDate).format('DD-MM-YYYY');

    return localDate;
}

export function date_objToFormat(objDate) {
    let localDate = moment(objDate).format('DD-MM-YYYY');

    return localDate;
}


export async function SweetAlert_Delete() {
    const result = await Swal.fire({
        title: 'Delete Data !, Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Delete !'
    });
    if (result.isConfirmed) {
        // console.log('confirmed', 'ok');
        return true;

    } else if (result.isDismissed) {
        console.log('dismiss', 'yes');
        return false;
    }
}

export function MoneyFormat(amount) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal', // Format as a regular number
        minimumFractionDigits: 2, // Optional: Ensures 2 decimal places
        maximumFractionDigits: 2,
    });

    return (formatter.format(amount)); // Output: "1,234,567.89"
}

