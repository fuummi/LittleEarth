import React, { useState, useEffect } from "react";
import "./DatePicker.less";
import { Select, DatePicker, Button } from "@arco-design/web-react";
import { useRecoilState } from "recoil";
import { dateState } from "../../utils/Recoil";

export default function DatePickerC() {
    const defaultValue = new Date();
    const [value, setValue] = useState(defaultValue);
    const [utcOffset, setUtcOffset] = useState(0);
    const [timezone, setTimezone] = useState("Asia/Shanghai");
    const zoneList = ["America/Los_Angeles", "Europe/London", "Africa/Cairo", "Asia/Shanghai"];
    const [date, setDate] = useRecoilState(dateState);
    const [dateobj, setDateobj] = useState({
        y: defaultValue.getFullYear(),
        M: defaultValue.getMonth() + 1,
        d: defaultValue.getDay(),
        h: defaultValue.getHours(),
        m: defaultValue.getMinutes(),
    });

    useEffect(() => {
        setDate({
            y: defaultValue.getFullYear(),
            M: defaultValue.getMonth() + 1,
            d: defaultValue.getDay(),
            h: defaultValue.getHours(),
            m: defaultValue.getMinutes(),
        });
    }, []);

    function timeChange(v, vd) {
        setValue(vd && vd.toDate());
        setDateobj(vd);
    }
    function passDate() {
        if (dateobj.$M !== undefined) {
            const { $Y, $M, $D, $H, $m } = dateobj;
            setDate({
                y: $Y,
                M: $M,
                d: $D,
                h: $H,
                m: $m,
            });
        } else {
            setDate(dateobj);
        }
    }
    return (
        <>
            <div className="timezonepicker">
                <Select
                    defaultValue={timezone}
                    options={zoneList}
                    onChange={(tz) => setTimezone(tz)}
                    triggerProps={{
                        autoAlignPopupWidth: true,
                        position: "bl",
                    }}
                />
            </div>
            <div className="datepicker">
                <DatePicker showTime value={value} timezone={timezone} onChange={timeChange} />
                <Button type="primary" onClick={passDate}>
                    该时间状态
                </Button>
            </div>
        </>
    );
}
