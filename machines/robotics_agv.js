import * as THREE from 'three';
import { yellowAccent, darkSteel, rubber, chrome, blueAccent } from '../utils/materials.js';

export function createAGV(THREE) {
    const group = new THREE.Group();
    const animationClips = [];
    
    const agvBody = new THREE.Group();
    agvBody.name = 'AGVBody';
    group.add(agvBody);

    const chassisGeo = new THREE.BoxGeometry(2.4, 0.4, 1.6);
    chassisGeo.translate(0, 0.4, 0);
    const chassis = new THREE.Mesh(chassisGeo, yellowAccent);
    agvBody.add(chassis);

    const topPlateGeo = new THREE.BoxGeometry(2.2, 0.1, 1.4);
    topPlateGeo.translate(0, 0.65, 0);
    const topPlate = new THREE.Mesh(topPlateGeo, darkSteel);
    topPlate.name = 'TopPlate';
    agvBody.add(topPlate);

    const lidarGroup = new THREE.Group();
    lidarGroup.name = 'LidarScanner';
    lidarGroup.position.set(1.0, 0.6, 0.6);
    agvBody.add(lidarGroup);

    const lidarBase = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16), darkSteel);
    lidarBase.position.y = 0.1;
    lidarGroup.add(lidarBase);

    const lidarTop = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.15, 16), blueAccent);
    lidarTop.position.y = 0.275;
    lidarGroup.add(lidarTop);

    const wheelGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.15, 32);
    wheelGeo.rotateX(Math.PI / 2);

    const wheelPositions = [
        [0.8, 0.25, 0.85], [0.8, 0.25, -0.85], [-0.8, 0.25, 0.85], [-0.8, 0.25, -0.85]
    ];

    const wheels = [];
    wheelPositions.forEach((pos, index) => {
        const wheel = new THREE.Mesh(wheelGeo, rubber);
        wheel.position.set(...pos);
        wheel.name = `Wheel${index}`;
        agvBody.add(wheel);
        wheels.push(wheel);
    });

    const times = [0, 1.25, 2.5, 3.75, 5];
    const bodyPosValues = [0, 0, 0, 3, 0, 0, 3, 0, 3, 0, 0, 3, 0, 0, 0];
    const bodyPosTrack = new THREE.VectorKeyframeTrack('AGVBody.position', times, bodyPosValues);

    const rotValues = [];
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    [[0, 0, 0], [0, 0, 0], [0, Math.PI/2, 0], [0, Math.PI, 0], [0, Math.PI*2, 0]].forEach(euler => {
        e.set(...euler); q.setFromEuler(e); rotValues.push(q.x, q.y, q.z, q.w);
    });
    const bodyRotTrack = new THREE.QuaternionKeyframeTrack('AGVBody.quaternion', times, rotValues);

    const lidarTrack = new THREE.NumberKeyframeTrack('LidarScanner.rotation[y]', [0, 5], [0, Math.PI * 20]);
    const liftTrack = new THREE.NumberKeyframeTrack('TopPlate.position[y]', times, [0.65, 0.65, 0.9, 0.9, 0.65]);
    
    const wheelTracks = wheels.map((w, i) => new THREE.NumberKeyframeTrack(`Wheel${i}.rotation[z]`, [0, 5], [0, -Math.PI * 10]));

    const clip = new THREE.AnimationClip('AGV_Motion', 5, [bodyPosTrack, bodyRotTrack, lidarTrack, liftTrack, ...wheelTracks]);
    animationClips.push(clip);

    return { group, animationClips };
}
