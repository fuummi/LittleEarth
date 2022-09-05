import { atom } from "recoil";

export const dateState = atom({
    key: "dateState",
    default: {
        y: 2022,
        m: 1,
        d: 1,
        h: 0,
        m: 0,
    },
});