///<reference path="../typings/threejs/three.d.ts"/>
var Vector3 = THREE.Vector3;
var Quaternion = THREE.Quaternion;
var sin = Math.sin;
var cos = Math.cos;
var quaternion = new THREE.Quaternion();
var rotationVec = new THREE.Vector3();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 150;
camera.position.z = 500;
var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
var cube = createCube();
var plane = createPlane();
var light = createLight();
light.add(cube);
function createCube() {
    var boxGeometry = new THREE.BoxGeometry(200, 200, 200);
    for (var i = 0; i < boxGeometry.faces.length; i += 2) {
        var color = {
            h: (1 / (boxGeometry.faces.length)) * i,
            s: 0.5,
            l: 0.5
        };
        boxGeometry.faces[i].color.setHSL(color.h, color.s, color.l);
        boxGeometry.faces[i + 1].color.setHSL(color.h, color.s, color.l);
    }
    var cubeMaterial = new THREE.MeshBasicMaterial({
        vertexColors: THREE.FaceColors,
        overdraw: 0.5
    });
    cube = new THREE.Mesh(boxGeometry, cubeMaterial);
    cube.position.y = 200;
    return cube;
}
function createPlane() {
    var planeGeometry = new THREE.PlaneGeometry(200, 200);
    planeGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    var planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xe0e0e0,
        overdraw: 0.5
    });
    return new THREE.Mesh(planeGeometry, planeMaterial);
}
function createLight() {
    var light = new THREE.DirectionalLight();
    light.castShadow = true;
    light.position.set(5, 5, 5);
    return light;
}
function keyListener(e) {
    //console.log(e);
    var key = e.code.slice(3).toLowerCase();
    var one_deg = toRad(2);
    //console.log(key);
    var vec = new Vector3();
    switch (key) {
        case 'w':
            vec.x -= one_deg;
            break;
        case 's':
            vec.x += one_deg;
            break;
        case 'a':
            vec.y -= one_deg;
            break;
        case 'd':
            vec.y += one_deg;
            break;
        case 'q':
            vec.z -= one_deg;
            break;
        case 'e':
            vec.z += one_deg;
            break;
        default:
            return;
    }
    quaternion = eulerToQuaternion(vec);
    console.clear();
    console.table([
        vecToDeg(cube.rotation),
        getEuler(getMatrix(cube.quaternion, true)),
        vecToDeg(getYawPitchRow(getMatrix(cube.quaternion))),
    ]);
    var curQuaternion = cube.quaternion;
    curQuaternion.multiplyQuaternions(quaternion, curQuaternion);
    curQuaternion.normalize();
    cube.setRotationFromQuaternion(curQuaternion);
}
function getMatrix(q, big) {
    var x = q.x, y = q.y, z = q.z, w = q.w;
    if (big) {
        return [
            1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w), 0,
            2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w), 0,
            2 * (x * z - y * w), 2 * (y * z - x * w), 1 - 2 * (x * x + y * y), 0,
            0, 0, 0, 1,
        ];
    }
    return [
        1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w),
        2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w),
        2 * (x * z - y * w), 2 * (y * z - x * w), 1 - 2 * (x * x + y * y),
    ];
}
function getEuler(mat) {
    var C, D, trX, trY;
    var angle_x, angle_y, angle_z;
    /* Считаем ось Y */
    angle_y = -Math.asin(mat[2]);
    C = cos(angle_y);
    angle_y = toDeg(angle_y);
    /* ось зафиксирована? */
    if (Math.abs(C) > 0.005) {
        /* Нет, так что находим угол по X */
        trX = mat[10] / C;
        trY = -mat[6] / C;
        angle_x = toDeg(Math.atan2(trY, trX));
        /* находим угол по оси Z */
        trX = mat[0] / C;
        trY = -mat[1] / C;
        angle_z = toDeg(Math.atan2(trY, trX));
    }
    else {
        /* Устанавливаем угол по оси X на 0 */
        angle_x = 0;
        /* И считаем ось Z */
        trX = mat[5];
        trY = mat[4];
        angle_z = toDeg(Math.atan2(trY, trX));
    }
    //angle_x = clamp(angle_x, 0, 360);  /* Приводим углы к диапазону */
    //angle_y = clamp(angle_y, 0, 360);
    //angle_z = clamp(angle_z, 0, 360);
    return new Vector3(angle_x, angle_y, angle_z);
}
function getThreejsEuler(m) {
    var x, y, z;
    var m11 = m[0], m12 = m[4], m13 = m[8];
    var m21 = m[1], m22 = m[5], m23 = m[9];
    var m31 = m[2], m32 = m[6], m33 = m[10];
    y = Math.asin(clamp(m13, -1, 1));
    if (Math.abs(m13) < 0.99999) {
        x = Math.atan2(-m23, m33);
        z = Math.atan2(-m12, m11);
    }
    else {
        x = Math.atan2(m32, m22);
        z = 0;
    }
    return new Vector3(x, y, z);
}
/** @see http://planning.cs.uiuc.edu/node103.html */
function getYawPitchRow(m) {
    return new Vector3(Math.atan(m[7] / m[8]), Math.atan(m[6] / Math.sqrt(m[7] * m[7] + m[8] * m[8])), Math.atan(m[3] / m[0]));
}
function eulerToQuaternion(v) {
    var w = cos(v.x / 2) * cos(v.y / 2) * cos(v.z / 2);
    return new Quaternion(sin(v.x / 2), sin(v.y / 2), sin(v.z / 2), w);
}
function createMeshFaceMaterial() {
    var materials = [];
    materials.push(new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    materials.push(new THREE.MeshBasicMaterial({ color: 0xffff00 }));
    materials.push(new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
    materials.push(new THREE.MeshBasicMaterial({ color: 0x00ffff }));
    materials.push(new THREE.MeshBasicMaterial({ color: 0x0000ff }));
    materials.push(new THREE.MeshBasicMaterial({ color: 0xff00ff }));
    return new THREE.MeshFaceMaterial(materials);
}
function init() {
    document.body.addEventListener('keydown', keyListener);
    document.body.appendChild(renderer.domElement);
    scene.add(cube);
    scene.add(plane);
    scene.add(light);
    var render = function () {
        requestAnimationFrame(render);
        /*cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;*/
        renderer.render(scene, camera);
    };
    render();
}
window.setRotation = function (x, y, z) {
    cube.rotation.x = toRad(x);
    cube.rotation.y = toRad(y);
    cube.rotation.z = toRad(z);
};
window.onload = function () { return init(); };
function toRad(deg) {
    return deg * Math.PI / 180;
}
function toDeg(rad) {
    return rad * 180 / Math.PI;
}
function clamp(x, min, max) {
    return x < min ? min : (x > max ? max : x);
}
function vecToDeg(euler) {
    return new Vector3(toDeg(euler.x), toDeg(euler.y), toDeg(euler.z));
}
/*
Всем привет.

Нужно получить угол наклона по одной из осей из кватерниона.
Можно ли достать угол, который бы не зависил от других углов?

Вычисления делал так: кватернион -> матрица поворота -> углы Эйлера и yaw pitch row

Для наглядности сделал демо: http://yadro.github.io/projects/quaternion/
в консоли выводятся вычисления
1) расчеты движка threejs
2) углы эйлера
3) yaw pitch row
*/ 
//# sourceMappingURL=view.js.map