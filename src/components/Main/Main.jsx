import React, { useEffect, useRef } from "react";
import "./Main.less";

import * as THREE from "three";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { AxesHelper } from "three/src/helpers/AxesHelper.js";
export default function Main() {
    const lineControl = useRef();
    const cameraControl = useRef();
    const spinControl = useRef();

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

    // var earthgroup = new THREE.Group().add(earth);
    scene.add(earth);

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
    // var northPolargroup = new THREE.Group().add(northPolar);
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
    // var northPolargroup = new THREE.Group().add(northPolar);
    scene.add(southPolar);

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
    scene.add(terminator);

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
    point.position.set(200, 0, 0);
    scene.add(point);

    const ambient = new THREE.AmbientLight(0x222222);
    scene.add(ambient);

    const axes = new AxesHelper(500);
    scene.add(axes);

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000);
    camera.position.set(400, 0, 400);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 1);

    let speedObj = {
        speed: 0.1,
    };
    let deg = 0;
    const ondeDeg = (Math.PI / 360) * (23 / (40 / speedObj.speed));
    function up() {
        point.position.y += speedObj.speed;
        terminatorGeometry.rotateZ((Math.PI / 360) * (23 / (40 / speedObj.speed)));
        directPointGeometry.rotateZ((Math.PI / 360) * (23 / (40 / speedObj.speed)));
        deg += (Math.PI / 360) * (23 / (40 / speedObj.speed));
    }
    function down() {
        point.position.y -= speedObj.speed;
        terminatorGeometry.rotateZ(-(Math.PI / 360) * (23 / (40 / speedObj.speed)));
        directPointGeometry.rotateZ(-(Math.PI / 360) * (23 / (40 / speedObj.speed)));
        deg -= (Math.PI / 360) * (23 / (40 / speedObj.speed));
    }
    function cameraUp() {
        camera.position.y = deg * 400;
        camera.lookAt(0, 0, 0);
    }
    function cameraDown() {
        camera.position.y = deg * 400;
        camera.lookAt(0, 0, 0);
    }
    let nowFn = [up];
    let counter = 0;
    function render() {
        renderer.render(scene, camera);
        earth.rotateY(Math.PI / 2000);
        if (point.position.y <= -80) {
            if (nowFn.length == 1) nowFn = [up];
            else nowFn = [up, cameraUp];
        } else if (point.position.y >= 80) {
            if (nowFn.length == 1) nowFn = [down];
            else nowFn = [down, cameraDown];
        }
        nowFn.forEach((element) => {
            element();
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

    var lineGroup = new THREE.Group();
    lineGroup.add(equator, northTropic, southTropic, northPolar, southPolar, terminator);
    scene.add(lineGroup);

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
                if (index == 2) {
                    element.checked = true;
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
        name: "地球转速",
        width: 300,
        autoPlace: false,
        open: false,
        title: "地球转速",
    });

    spinGui.add(speedObj, "speed",0,1).name("地球转速");

    useEffect(() => {
        document.querySelector("#canvas").appendChild(renderer.domElement);
        lineControl.current.appendChild(lineGui.domElement);
        cameraControl.current.appendChild(cameraGui.domElement);
        spinControl.current.appendChild(spinGui.domElement);
    }, []);
    return (
        <>
            <div id="canvas"></div>
            <div ref={cameraControl} className="cameraControl"></div>
            <div ref={lineControl} className="lineControl"></div>
            <div ref={spinControl} className="spinControl"></div>
        </>
    );
}
