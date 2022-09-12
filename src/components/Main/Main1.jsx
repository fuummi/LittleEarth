import React, { useEffect, useRef, useState, useCallback } from "react";
import datemanger, { time, lunartime } from "../../utils/datemanger";
import "./Main.less";
import * as THREE from "three";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { AxesHelper } from "three/src/helpers/AxesHelper.js";

const width = window.innerWidth;
const height = window.innerHeight;
const k = width / height;
const s = 200;

export default function Main1() {
    const datepicker = useRef();
    const lineControl = useRef();
    const cameraControl = useRef();
    const spinControl = useRef();
    const btn2 = useRef();
    const btn3 = useRef();
    const body = useRef();
    const raf = useRef();
    const ambient = useRef(new THREE.AmbientLight(0x3333333)).current;
    const point = useRef(new THREE.DirectionalLight(0xdddddd, 2)).current;
    // const axes = useRef(new AxesHelper(500)).current;
    const renderer = useRef(new THREE.WebGLRenderer()).current;
    const scene = useRef(new THREE.Scene()).current;
    const camera = useRef(new THREE.PerspectiveCamera()).current;
    const controls = useRef(new OrbitControls(camera, renderer.domElement)).current;
    const allGroup = useRef(new THREE.Group()).current;
    const lineGroup = useRef(new THREE.Group()).current;
    const meshArr = useRef([]);

    const terminatorGeometry = useRef();
    const directPointGeometry = useRef();
    const helperlineGeometry = useRef();
    const trackrArcPoint = useRef();
    const earth = useRef();
    const moon = useRef();
    const mixer = useRef();
    const AnimationAction = useRef();
    const clip = useRef();

    let deg = useRef(0).current;

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

    const up = () => {
        point.position.y += speedObj.speed * 400;
        terminatorGeometry.current.rotateZ(speedObj.speed);
        directPointGeometry.current.rotateZ(speedObj.speed);
        deg += speedObj.speed;
        if (obj.follow) {
            helperlineGeometry.current.rotateY(speedObj.speed * 1455.7);
            earth.current.rotateY(speedObj.speed * 1455.7);
        } else {
            helperlineGeometry.current.rotateY(speedObj.rotae);
            earth.current.rotateY(speedObj.rotae);
        }
    };
    const down = () => {
        point.position.y -= speedObj.speed * 400;
        terminatorGeometry.current.rotateZ(-speedObj.speed);
        directPointGeometry.current.rotateZ(-speedObj.speed);
        deg -= speedObj.speed;
        if (obj.follow) {
            helperlineGeometry.current.rotateY(speedObj.speed * 1440.4);
            earth.current.rotateY(speedObj.speed * 1440.4);
        } else {
            helperlineGeometry.current.rotateY(speedObj.rotae);
            earth.current.rotateY(speedObj.rotae);
        }
    };
    function cameraUp() {
        camera.position.y = deg * 400;
        camera.lookAt(0, 0, 0);
    }

    function cameraDown() {
        camera.position.y = deg * 400;
        camera.lookAt(0, 0, 0);
    }

    let nowFn = [up];

    let T0 = new Date();
    var clock = new THREE.Clock();
    let i = 0;
    const render = () => {
        renderer.render(scene, camera);
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
        raf.current = requestAnimationFrame(() => render(t));
        if (mixer.current && moon.current.geometry !== undefined) {
            mixer.current.update(clock.getDelta());
        }
    };

    const init = () => {
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 1);
        camera.aspect = width / height;
        camera.fov = 60;
        camera.near = 1;
        camera.far = 5000;
        camera.position.set(0, 2000, 0);
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
    };

    const createEarth = () => {
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
        earth.current = new THREE.Mesh(earthGeometry, earthMaterial);
        earth.current.rotateY(15.15);
        scene.add(earth.current);

        helperlineGeometry.current = new THREE.BoxGeometry(0, 0, 10);
        var helperlineMaterial = new THREE.LineBasicMaterial({
            color: 0xff0000,
            visible:false
        });
        var helperline = new THREE.Line(helperlineGeometry.current, helperlineMaterial);
        helperline.name = "helperline";
        helperlineGeometry.current.translate(0, 0, 5);
        scene.add(helperline);

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
        scene.add(equator);

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
        scene.add(northTropic);

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
        scene.add(southTropic);

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
        scene.add(northPolar);

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
        scene.add(southPolar);

        //晨昏线
        terminatorGeometry.current = new THREE.BufferGeometry();
        const terminatorArc = new THREE.ArcCurve(0, 0, 101, 0, 2 * Math.PI, true);
        const terminatorPoints = terminatorArc.getPoints(100);
        terminatorGeometry.current.setFromPoints(terminatorPoints);
        const terminatorMaterial = new THREE.LineBasicMaterial({
            linewidth: 10,
            color: 0xffffff,
        });
        terminatorGeometry.current.rotateX(Math.PI);
        terminatorGeometry.current.rotateY(Math.PI / 2);
        const terminator = new THREE.Line(terminatorGeometry.current, terminatorMaterial);
        scene.add(terminator);

        //直射点
        var shape = new THREE.Shape();
        shape.absarc(0, 0, 1, 0, Math.PI * 2, true);
        directPointGeometry.current = new THREE.ExtrudeGeometry(shape, { steps: 300, depth: 100 });
        directPointGeometry.current.rotateY(Math.PI / 2);
        const directPointMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
        });
        const directPoint = new THREE.Line(directPointGeometry.current, directPointMaterial);
        scene.add(directPoint);

        //星星
        var starGeometry = new THREE.BufferGeometry();
        let tempArr1 = [];
        let tempArr2 = [];
        let flag = true;
        for (let i = 0; i < 900; i++) {
            let position = flag ? Math.random() * 3000 : Math.random() * 3000 * -1;
            tempArr1.push(position);
            tempArr2.push(1);
            flag = parseInt(Math.random() * 100, 10) % 2 == 0;
        }
        var starVertices = new Float32Array(tempArr1);
        var starColors = new Float32Array(tempArr2);
        var starAttribue = new THREE.BufferAttribute(starVertices, 3);
        starGeometry.attributes.position = starAttribue;
        starGeometry.attributes.color = new THREE.BufferAttribute(starColors, 3);
        var starMaterial = new THREE.PointsMaterial({
            vertexColors: THREE.VertexColors,
            size: 2,
        });
        var starPoints = new THREE.Points(starGeometry, starMaterial);
        scene.add(starPoints);

        //月球主体
        const moonGeometry = new THREE.SphereGeometry(27.273, 40, 40);
        const textureLoader2 = new THREE.TextureLoader();
        const moonMap = textureLoader.load("/src/assets/moon.png");
        const moonMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: moonMap,
        });
        moon.current = new THREE.Mesh(moonGeometry, moonMaterial);
        // moonGeometry.translate(0, 0, 109.7);
        scene.add(moon.current);

        //月球轨道
        const trackGeometry = new THREE.BufferGeometry();
        const trackrArc = new THREE.EllipseCurve(0, 0, 1000, 998.439, 0, 2 * Math.PI, false, 0);
        const tempArr3 = trackrArc.getPoints(100);
        const tempArr4 = [];
        let y = 0;
        for (let i = 0; i <= 100; i++) {
            if (i <= 50) {
                y += 3.5578;
            } else {
                y -= 3.5578;
            }
            tempArr4.push(new THREE.Vector3(tempArr3[i].x, 0, tempArr3[i].y));
        }
        const tracka = new THREE.CatmullRomCurve3(tempArr4);
        trackrArcPoint.current = tracka.getPoints(100);
        trackGeometry.setFromPoints(trackrArcPoint.current);
        const trackMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
        });
        const track = new THREE.Line(trackGeometry, trackMaterial);
        scene.add(track);

        meshArr.current = [
            directPoint,
            lineGroup,
            earth.current,
            helperline,
            equator,
            northTropic,
            southTropic,
            northPolar,
            southPolar,
            terminator,
            starPoints,
            moon.current,
            track,
        ];
        const lineGui = new GUI({
            name: "辅助线设置",
            width: 200,
            autoPlace: false,
            open: false,
            title: "辅助线设置",
        });
        const lineobj = {
            visible: true,
        };
        var lineGroupController = lineGui.add(lineobj, "visible").name("显示辅助线");
        lineGroupController.onFinishChange(function (value) {
            meshArr.current.forEach((el) => {
                if (el.type == "Line" && el.name !== "helperline") {
                    el.visible = value;
                }
            });
        });
        function createControl(name, geometry, dash) {
            const lineFolder = lineGui.addFolder(`${name}`);
            console.log(geometry.material);
            lineFolder.addColor(geometry.material, "color").name("颜色");
            lineFolder.add(geometry.material, "visible").name("显示");
        }
        createControl("赤道", equator, false);
        createControl("北回归线", northTropic, true);
        createControl("南回归线", southTropic, true);
        createControl("北极圈", northPolar, true);
        createControl("南极圈", southPolar, true);
        createControl("晨昏线", terminator, false);
        createControl("月球轨道", track, false);

        const cameraGui = new GUI({
            name: "相机设置",
            width: 200,
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
                camera.position.set(0, 2000, 0);
                camera.lookAt(0, 0, 0);
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
                    camera.lookAt(0, 0, 0);
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
            width: 200,
            autoPlace: false,
            open: false,
            title: "速度调整",
        });

        spinGui.add(obj, "speed", 0.0000001, 0.5).name("昼夜更替速度"); //用gui改变了转速，在回调里设置状态
        spinGui.onFinishChange(function (value) {
            if (value.property == "speed") {
                speedObj.speed = (Math.PI / 360) * (23 / (40 / value.value));
                AnimationAction.current.timeScale = value.value * 260;
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
        lineControl.current.appendChild(lineGui.domElement);
        cameraControl.current.appendChild(cameraGui.domElement);
        spinControl.current.appendChild(spinGui.domElement);
    };

    const createLights = () => {
        point.position.set(400, 0, 0);
        scene.add(point);
        scene.add(ambient);
        // scene.add(axes);
    };

    let progress = 0;
    const moonMove = useCallback(() => {
        let arr = [];
        var posArr = [];
        var rotateArr = [];
        const oneDeg = Math.PI / 50;
        for (let i = 0; i < 101; i++) {
            arr.push(i);
            rotateArr.push(i * oneDeg);
        }
        var times = new Float32Array(arr);
        moon.current.name = "moon";
        trackrArcPoint.current.forEach((elem, index) => {
            posArr.unshift(elem.x, elem.y, elem.z);
        });
        var values = new Float32Array(posArr);
        var values2 = new Float32Array(rotateArr);
        var posTrack = new THREE.KeyframeTrack(".position", times, values);
        var rotae = new THREE.KeyframeTrack(".rotation[y]", times, values2);
        let duration = 100;
        clip.current = new THREE.AnimationClip("default", duration, [posTrack, rotae]);
        mixer.current = new THREE.AnimationMixer(moon.current);
        AnimationAction.current = mixer.current.clipAction(clip.current);
        AnimationAction.current.timeScale = 0.26;
        AnimationAction.current.setLoop(THREE.LoopRepeat,Infinity)
        AnimationAction.current.play();
    }, [speedObj.speed]);

    function remove(item) {
        if (item.type == "Group") {
            item.children.forEach((item) => {
                remove(item);
            });
        } else {
            scene.remove(item);
            item.geometry.dispose();
            item.material.dispose();
        }
    }

    useEffect(() => {
        body.current.append(renderer.domElement);
        init();
        createEarth();
        createLights();
        render();
        moonMove();
        btn2.current.disabled = true;
        btn3.current.disabled = true;
        return () => {
            meshArr.current.forEach((item) => {
                remove(item);
            });
            cancelAnimationFrame(raf.current);
            renderer.dispose();
            scene.remove(point);
            scene.remove(ambient);
            // scene.remove(axes);
            lineControl.current.innerHTML = "";
            cameraControl.current.innerHTML = "";
            spinControl.current.innerHTML = "";
        };
    }, []);
    let lastTime;
    let preFn;
    function getTime() {
        const value = datepicker.current.value;
        if (lastTime == value || value == "") {
            alert("时间不能为空或与上次相同");
            return;
        }
        const date = {
            year: value.substring(0, 4),
            month: value.substring(5, 7),
            day: value.substring(8, 10),
            hour: value.substring(11, 13),
            minute: value.substring(14),
        };
        let angle = datemanger(date);
        preFn = nowFn;
        nowFn = [];
        const one = Math.PI / 180;
        point.position.set(400, 0, 0);
        point.position.y += Math.sin(one * angle) * 400;
        const { x: dx, y: dy } = directPointGeometry.current.boundingSphere.center;
        const needDeg = Math.atan(dy / dx);
        terminatorGeometry.current.rotateZ(one * angle - needDeg);
        directPointGeometry.current.rotateZ(one * angle - needDeg);

        let earthdeg = time(date) * one;
        const { x, z } = helperlineGeometry.current.boundingSphere.center;
        const deg = Math.atan(x / z);

        if (x > 0 && z > 0) {
            helperlineGeometry.current.rotateY(-deg);
            earth.current.rotateY(-deg);
        } else if (x > 0 && z < 0) {
            helperlineGeometry.current.rotateY(-(Math.PI / 2 + (Math.PI / 2 + deg)));
            earth.current.rotateY(-(Math.PI / 2 + (Math.PI / 2 + deg)));
        } else if (x < 0 && z < 0) {
            helperlineGeometry.current.rotateY(-(deg + Math.PI));
            earth.current.rotateY(-(deg + Math.PI));
        } else if (x > 0 && z > 0) {
            helperlineGeometry.current.rotateY(-deg);
            earth.current.rotateY(-deg);
        }
        earth.current.rotateY(earthdeg);
        helperlineGeometry.current.rotateY(earthdeg);

        const lunar = lunartime(date);
        AnimationAction.current.paused = true;
        AnimationAction.current.time = parseInt(100 * (lunar / 30), 10);
        clip.current.duration = AnimationAction.time;
        camera.position.set(400, 0, 400);
        camera.lookAt(0, 0, 0);
        btn2.current.disabled = false;
        btn3.current.disabled = false;
        lastTime = value;
        nowFn = [
            (t) => {
                earth.current.rotateY((0.00000072722633943 * t) / 100);
            },
        ];
    }

    function lookMoon() {
        const value = datepicker.current.value;
        const date = {
            year: value.substring(0, 4),
            month: value.substring(5, 7),
            day: value.substring(8, 10),
            hour: value.substring(11, 13),
            minute: value.substring(14),
        };
        const lunar = lunartime(date);
        const deg = Math.PI * 2 * (lunar / 30);
        console.log(110 * Math.sin(deg), 0, 110 * Math.cos(deg));
        camera.position.set(110 * Math.sin(deg), 0, 110 * Math.cos(deg));
        camera.lookAt(moon.current.position);
        camera.updateProjectionMatrix();
    }

    function disablebtn() {
        btn2.current.disabled = true;
    }
    function resetSetting() {
        btn2.current.disabled = true;
        btn3.current.disabled = true;
        AnimationAction.current.paused = false;
        nowFn = preFn;
    }

    return (
        <>
            <div ref={body}></div>
            <div ref={cameraControl} className="cameraControl"></div>
            <div ref={lineControl} className="lineControl"></div>
            <div ref={spinControl} className="spinControl"></div>
            <div className="right">
                <input
                    type="datetime-local"
                    className="datepicker"
                    ref={datepicker}
                    onChange={disablebtn}></input>
                <button className="btn" onClick={getTime}>
                    该时间状态
                </button>
                <button className="btn2" ref={btn2} onClick={lookMoon}>
                    该时间月相
                </button>
                <button className="btn3" ref={btn3} onClick={resetSetting}>
                    速度恢复自由
                </button>
            </div>
        </>
    );
}
