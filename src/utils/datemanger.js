export default function (dateObj) {
    let data = 0;
    switch (dateObj.month) {
        case "01":
            data += -21.25;
            data += dateObj.day * 0.25;
            break;
        case "02":
            data += -13.5;
            data += dateObj.day * 0.25;
            break;
        case "03":
            data += -6.5;
            data += dateObj.day * 0.25;
            break;
        case "04":
            data += 1.25;
            data += dateObj.day * 0.25;
            break;
        case "05":
            data += 8.75;
            data += dateObj.day * 0.25;
            break;
        case "06":
            data += 16.5;
            if (parseInt(dateObj.day, 10)<=22) {
                data += dateObj.day * 0.25;
            }else{
                data -= dateObj.day * 0.25;
            }
            break;
        case "07":
            data += 21.25;
            data -= dateObj.day * 0.25;
            break;
        case "08":
            data += 13.75;
            data -= dateObj.day * 0.25;
            break;
        case "09":
            data += 6;
            data -= dateObj.day * 0.25;
            break;
        case "10":
            data += -2.25;
            data -= dateObj.day * 0.25;
            break;
        case "11":
            data += -10;
            data -= dateObj.day * 0.25;
            break;
        case "12":
            data += -17.5;
            if (parseInt(dateObj.day, 10)<=23) {
                data += dateObj.day * 0.25;
            }else{
                data -= dateObj.day * 0.25;
            }
            break;
    }
    return data;
}
export function time(dateObj) {
    return (parseInt(dateObj.hour, 10) * 60 + parseInt(dateObj.minute, 10) - 360) / 4;
}
