import React, { useEffect, useRef, useState } from "react";
import "./Main.less";
import { useDebounce } from "../../utils/useDebounce";
import { useRecoilValue } from "recoil";
import { dateState } from "../../utils/Recoil";
import datemanger, { time } from "../../utils/datemanger";
import { Select, DatePicker, Button } from "@arco-design/web-react";

import * as THREE from "three";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { AxesHelper } from "three/src/helpers/AxesHelper.js";
export default function Main() {
    const [speed, setSpeed] = useState({ value: 0.1 });
    const lineControl = useRef();
    const cameraControl = useRef();
    const spinControl = useRef();

    const defaultValue = new Date();
    const [value, setValue] = useState(defaultValue);
    const [date, setDate] = useState({
        y: defaultValue.getFullYear(),
        M: defaultValue.getMonth() + 1,
        d: defaultValue.getDate(),
        h: defaultValue.getHours(),
        m: defaultValue.getMinutes(),
    });
    const [flag, setFlag] = useState(true);
    // let value = defaultValue;
    let angle = 0;
    const [utcOffset, setUtcOffset] = useState(0);
    const [timezone, setTimezone] = useState("Asia/Shanghai");
    const zoneList = ["America/Los_Angeles", "Europe/London", "Africa/Cairo", "Asia/Shanghai"];

    const scene = new THREE.Scene();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const k = width / height;
    const s = 200;

    const earthGeometry = new THREE.SphereGeometry(100, 40, 40);
    const textureLoader = new THREE.TextureLoader();
    const map = textureLoader.load("/src/assets/Earth.jpg");
    const normal = textureLoader.load("/src/assets/normalMap1.png");
    const specular = textureLoader.load("/src/assets/specularMap.png");
    const earthMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        map: map,
        normalMap: normal,
        normalScale: new THREE.Vector2(3, 3),
        specularMap: specular,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.rotateY(15.3);
    // var earthgroup = new THREE.Group().add(earth);

    var helperlineGeometry = new THREE.BoxGeometry(0, 0, 10);
    var helperlineMaterial = new THREE.LineBasicMaterial({
        color: 0xff0000,
    });
    var helperline = new THREE.Line(helperlineGeometry, helperlineMaterial);
    helperlineGeometry.translate(0, 0, 5);

    //赤道
    const equatorGeometry = new THREE.BufferGeometry();
    const equatorArc = new THREE.ArcCurve(0, 0, 101, 0, 2 * Math.PI, true);
    const equatorPoints = equatorArc.getPoints(100);
    equatorGeometry.setFromPoints(equatorPoints);
    const equatorMaterial = new THREE.LineBasicMaterial({
        linewidth: 3,
        color: 0xff0000,
    });
    equatorGeometry.rotateX(Math.PI / 2);
    const equator = new THREE.Line(equatorGeometry, equatorMaterial);
    // var equatorgroup = new THREE.Group().add(equator);

    //回归线
    const tropicGeometry = new THREE.BufferGeometry();
    const tropicArc = new THREE.ArcCurve(0, 0, 92, 0, 2 * Math.PI, true);
    const tropicPoints = tropicArc.getPoints(100);
    tropicGeometry.setFromPoints(tropicPoints);
    const tropicMaterial = new THREE.LineDashedMaterial({
        color: 0xffff00,
        linewidth: 5,
        dashSize: 3,
        gapSize: 3,
    });
    tropicGeometry.rotateX(Math.PI / 2);
    tropicGeometry.translate(0, 39.768, 0);
    const northTropic = new THREE.Line(tropicGeometry, tropicMaterial);
    northTropic.computeLineDistances();

    const tropicGeometry2 = new THREE.BufferGeometry();
    const tropicArc2 = new THREE.ArcCurve(0, 0, 92, 0, 2 * Math.PI, true);
    const tropicPoints2 = tropicArc.getPoints(100);
    tropicGeometry2.setFromPoints(tropicPoints2);
    const tropicMaterial2 = new THREE.LineDashedMaterial({
        color: 0xffff00,
        linewidth: 3,
        dashSize: 3,
        gapSize: 3,
    });
    tropicGeometry2.rotateX(Math.PI / 2);
    tropicGeometry2.translate(0, -39.768, 0);
    const southTropic = new THREE.Line(tropicGeometry2, tropicMaterial2);
    southTropic.computeLineDistances();

    //极圈
    const polarGeometry = new THREE.BufferGeometry();
    const polarArc = new THREE.ArcCurve(0, 0, 40, 0, 2 * Math.PI, true);
    const polarPoints = polarArc.getPoints(100);
    polarGeometry.setFromPoints(polarPoints);
    const polarMaterial = new THREE.LineDashedMaterial({
        color: 0x00ffff,
        linewidth: 3,
        dashSize: 3,
        gapSize: 3,
    });
    const northPolar = new THREE.Line(polarGeometry, polarMaterial);
    polarGeometry.rotateX(Math.PI / 2);
    polarGeometry.translate(0, 91.752, 0);
    northPolar.computeLineDistances();

    const polarGeometry2 = new THREE.BufferGeometry();
    const polarArc2 = new THREE.ArcCurve(0, 0, 40, 0, 2 * Math.PI, true);
    const polarPoints2 = polarArc2.getPoints(100);
    polarGeometry2.setFromPoints(polarPoints2);
    const polarMaterial2 = new THREE.LineDashedMaterial({
        color: 0x00ffff,
        linewidth: 3,
        dashSize: 3,
        gapSize: 3,
    });
    const southPolar = new THREE.Line(polarGeometry2, polarMaterial2);
    polarGeometry2.rotateX(Math.PI / 2);
    polarGeometry2.translate(0, -91.752, 0);
    southPolar.computeLineDistances();

    //晨昏线
    const terminatorGeometry = new THREE.BufferGeometry();
    const terminatorArc = new THREE.ArcCurve(0, 0, 101, 0, 2 * Math.PI, true);
    const terminatorPoints = terminatorArc.getPoints(100);
    terminatorGeometry.setFromPoints(terminatorPoints);
    const terminatorMaterial = new THREE.LineBasicMaterial({
        linewidth: 10,
        color: 0xffffff,
    });
    terminatorGeometry.rotateX(Math.PI);
    terminatorGeometry.rotateY(Math.PI / 2);
    const terminator = new THREE.Line(terminatorGeometry, terminatorMaterial);

    //直射点
    var shape = new THREE.Shape();
    shape.absarc(0, 0, 1, 0, Math.PI * 2, true);
    var directPointGeometry = new THREE.ExtrudeGeometry(shape, { steps: 300, depth: 100 });
    directPointGeometry.rotateY(Math.PI / 2);
    const directPointMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
    });
    const directPoint = new THREE.Line(directPointGeometry, directPointMaterial);
    scene.add(directPoint);

    const point = new THREE.DirectionalLight(0xdddddd, 2);
    point.position.set(400, 0, 0);

    const ambient = new THREE.AmbientLight(0x222222);

    const axes = new AxesHelper(500);
    scene.add(axes);

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000);
    camera.position.set(400, 0, 400);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 1);

    let speedObj = {
        speed: (Math.PI / 360) * (23 / (40 / 0.001)),
        rotae: 0.001,
    };

    let obj = {
        speed: (Math.PI / 360) * (23 / (40 / 0.1)),
        rotae: 0.001,
        follow: true,
        flag: true,
    };

    let deg = 0;

    function up() {
        point.position.y += speedObj.speed * 400;
        terminatorGeometry.rotateZ(speedObj.speed);
        directPointGeometry.rotateZ(speedObj.speed);
        deg += speedObj.speed;
        if (obj.follow) {
            helperlineGeometry.rotateY(speedObj.speed * 1455.7);
            earth.rotateY(speedObj.speed * 1455.7);
        } else {
            helperlineGeometry.rotateY(speedObj.rotae);
            earth.rotateY(speedObj.rotae);
        }
    }
    function down() {
        point.position.y -= speedObj.speed * 400;
        terminatorGeometry.rotateZ(-speedObj.speed);
        directPointGeometry.rotateZ(-speedObj.speed);
        deg -= speedObj.speed;
        if (obj.follow) {
            helperlineGeometry.rotateY(speedObj.speed * 1440.4);
            earth.rotateY(speedObj.speed * 1440.4);
        } else {
            helperlineGeometry.rotateY(speedObj.rotae);
            earth.rotateY(speedObj.rotae);
        }
    }
    function cameraUp() {
        camera.position.y = deg * 400;
        camera.lookAt(0, 0, 0);
    }
    function cameraDown() {
        camera.position.y = deg * 400;
        camera.lookAt(0, 0, 0);
    }
    let nowFn = [];
    useEffect(() => {
        nowFn = [up];
    }, []);
    let counter = 0;
    let T0 = new Date();
    function render() {
        if (!flag) {
            return;
        }
        let T1 = new Date();
        let t = T1 - T0;
        T0 = T1;
        renderer.render(scene, camera);
        if (point.position.y <= -160) {
            if (nowFn.length == 1) nowFn = [up];
            else if (nowFn.length == 2) nowFn = [up, cameraUp];
        } else if (point.position.y >= 160) {
            if (nowFn.length == 1) nowFn = [down];
            else if (nowFn.length == 2) nowFn = [down, cameraDown];
        }
        nowFn.forEach((element) => {
            element(t * 100);
        });
        requestAnimationFrame(render);
    }
    render();
    const controls = new OrbitControls(camera, renderer.domElement);
    window.onresize = function () {
        window.onresize = function () {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        };
    };

    const lineGui = new GUI({
        name: "辅助线设置",
        width: 300,
        autoPlace: false,
        open: false,
        title: "辅助线设置",
    });
    const allGroup = new THREE.Group();
    var lineGroup = new THREE.Group();
    lineGroup.add(equator, northTropic, southTropic, northPolar, southPolar, terminator);

    allGroup.add(lineGroup, earth, directPoint, point, ambient, axes,helperline);
    useEffect(() => {
        scene.add(allGroup);
    }, []);

    const lineobj = {
        visible: true,
    };
    var lineGroupController = lineGui.add(lineobj, "visible").name("显示辅助线");
    lineGroupController.onFinishChange(function (value) {
        lineGroup.visible = lineobj.visible;
    });

    function createControl(name, geometry, dash) {
        const lineFolder = lineGui.addFolder(`${name}`);
        lineFolder.addColor(geometry.material, "color").name("颜色");
        lineFolder.add(geometry.material, "visible").name("显示");
    }
    createControl("赤道", equator, false);
    createControl("北回归线", northTropic, true);
    createControl("南回归线", southTropic, true);
    createControl("北极圈", northPolar, true);
    createControl("南极圈", southPolar, true);
    createControl("晨昏线", terminator, false);

    const cameraGui = new GUI({
        name: "相机设置",
        width: 300,
        autoPlace: false,
        open: false,
        title: "相机设置",
    });
    const cameraobj = {
        follow: false,
        fix: false,
        free: true,
        reset: function () {
            controls.reset();
            cameraControl.current.querySelectorAll("input").forEach((element, index) => {
                element.checked = false;
                controls.enabled = true;
                if (index == 2) {
                    element.checked = true;
                }
                if (nowFn[0] == up) {
                    nowFn = [up];
                } else {
                    nowFn = [down];
                }
            });
        },
    };
    cameraGui.add(cameraobj, "follow").name("跟随太阳直射点");
    cameraGui.add(cameraobj, "fix").name("固定");
    cameraGui.add(cameraobj, "free").name("自由");
    cameraGui.add(cameraobj, "reset").name("重置相机位置");
    cameraGui.onFinishChange(function (value) {
        if (value.property == "reset") return;
        switch (value.property) {
            case "follow":
                controls.enabled = false;
                camera.position.set(400, 0, 0);
                if (nowFn[0] == up) {
                    nowFn = [up, cameraUp];
                } else {
                    nowFn = [down, cameraDown];
                }
                break;
            case "fix":
                controls.enabled = false;
                if (nowFn.length != 1) nowFn.pop();
                break;
            case "free":
                controls.enabled = true;
                if (nowFn.length != 1) nowFn.pop();
                break;
        }

        let i = 0;
        for (let key in cameraobj) {
            cameraobj[key] = false;
            if (key == value.property) break;
            else i++;
        }
        cameraobj[value.property] = true;
        cameraControl.current.querySelectorAll("input").forEach((element, index) => {
            element.checked = false;
            if (i == index) {
                element.checked = true;
            }
        });
    });

    const spinGui = new GUI({
        name: "速度调整",
        width: 300,
        autoPlace: false,
        open: false,
        title: "速度调整",
    });

    spinGui.add(obj, "speed", 0.0000001, 0.5).name("太阳直射点变化速度"); //用gui改变了转速，在回调里设置状态
    spinGui.onFinishChange(function (value) {
        if (value.property == "speed") {
            speedObj.speed = (Math.PI / 360) * (23 / (40 / value.value));
        }
        if (value.property == "rotae") {
            speedObj.rotae = value.value;
        }
        if (value.property == "follow") {
            speedObj.rotae = value.value;
        }
    });

    spinGui.add(obj, "follow").name("地球转速跟随太阳直射点");
    spinGui.add(obj, "rotae", 0.0000001, 0.5).name("地球转速");

    useEffect(() => {
        document.querySelector("#canvas").appendChild(renderer.domElement);
        lineControl.current.appendChild(lineGui.domElement);
        cameraControl.current.appendChild(cameraGui.domElement);
        spinControl.current.appendChild(spinGui.domElement);
    }, []);

    useEffect(() => {
        angle = datemanger(date);
    }, []);
    let counter1 = 0;

    function timeChange(v, vd) {
        setValue(vd && vd.toDate());
        setDate(vd);
    }
    function passDate() {
        if (date.$M !== undefined) {
            const { $y, $M, $D, $H, $m } = date;
            angle = datemanger({
                y: $y,
                M: $M + 1,
                d: $D,
                h: $H,
                m: $m,
            });
            console.log(angle);
        } else {
            angle = datemanger(date);
        }
        console.log(nowFn);
        setFlag(false);
        nowFn = [];
        console.log(allGroup);
        const one = Math.PI / 180;
        point.position.set(400, 0, 0);
        point.position.y += Math.sin(one * angle) * 400;
        terminator.rotateZ(one * angle);
        directPoint.rotateZ(one * angle);
        let earthdeg = time(date) * one;
        debugger
        const { x, z } = helperlineGeometry.boundingSphere.center;
        const deg = Math.atan(x / z);
        if (x > 0 && z > 0) {
            helperline.rotateY(-deg);
            earth.rotateY(-deg);
        } else if (x > 0 && z < 0) {
            helperline.rotateY(-(Math.PI / 2 + (Math.PI / 2 + deg)));
            earth.rotateY(-(Math.PI / 2 + (Math.PI / 2 + deg)));
        } else if (x < 0 && z < 0) {
            helperline.rotateY(-(deg + Math.PI));
            earth.rotateY(-(deg + Math.PI));
        } else if (x > 0 && z > 0) {
            helperline.rotateY(-deg);
            earth.rotateY(-deg);
        }
        console.log(date);
        earth.rotateY(earthdeg);
    }

    return (
        <>
            <div id="canvas"></div>
            <div ref={cameraControl} className="cameraControl"></div>
            <div ref={lineControl} className="lineControl"></div>
            <div ref={spinControl} className="spinControl"></div>
            <div className="right">
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
                </div>
                <div className="btn">
                    <Button type="primary" onClick={passDate}>
                        该时间状态
                    </Button>
                </div>
            </div>
        </>
    );
}
