export default function (dateObj) {
    let data = 0;
    switch (dateObj.M) {
        case 1:
            data = -21.25;
            break;
        case 2:
            data = -13.5;
            break;
        case 3:
            data = -6.5;
            break;
        case 4:
            data = 1.25;
            break;
        case 5:
            data = 8.75;
            break;
        case 6:
            data = 16.5;
            break;
        case 7:
            data = 21.25;
            break;
        case 8:
            data = 13.75;
            break;
        case 9:
            data = 6;
            break;
        case 10:
            data = -2.25;
            break;
        case 11:
            data = -10;
            break;
        case 12:
            data = -17.5;
            break;
    }
    data += dateObj.d * 0.25;
    return data;
}

export function time(dateObj) {
    if (dateObj.$M !== undefined) {
        return (dateObj.$H * 60 + dateObj.$m - 360) / 4;
    }
    return (dateObj.h * 60 + dateObj.m - 360) / 4;
}
