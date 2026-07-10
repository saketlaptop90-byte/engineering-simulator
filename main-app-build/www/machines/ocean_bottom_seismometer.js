import { materials } from '../utils/materials.js';

export function createOceanBottomSeismometer(THREE) {
    const group = new THREE.Group();
    group.name = "OBS";
    const animationClips = [];

    const frameGeo = new THREE.CylinderGeometry(1.2, 1.5, 0.2, 6);
    const frameMat = materials.darkMetal || new THREE.MeshStandardMaterial({color: 0x222222});
    const frame = new THREE.Mesh(frameGeo, frameMat);
    group.add(frame);

    const sphereGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const sphereMat = materials.glass || new THREE.MeshPhysicalMaterial({transmission: 0.9, opacity: 1, transparent: true});
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.y = 0.5;
    group.add(sphere);

    const sensorGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const sensorMat = materials.primary || new THREE.MeshStandardMaterial({color: 0xaa0000});
    const sensor = new THREE.Mesh(sensorGeo, sensorMat);
    sensor.position.y = 0.4;
    group.add(sensor);
    
    const beaconGroup = new THREE.Group();
    beaconGroup.position.y = 1.2;
    group.add(beaconGroup);

    const beaconGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.3);
    const beacon = new THREE.Mesh(beaconGeo, materials.metal || new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
    beaconGroup.add(beacon);

    const lightGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const light = new THREE.Mesh(lightGeo, materials.highlight || new THREE.MeshBasicMaterial({color: 0xffff00}));
    light.position.y = 0.2;
    light.name = "OBS_Light";
    beaconGroup.add(light);

    // Animation
    const times = [0, 0.1, 0.2, 0.3, 0.4, 1.0];
    const pos = [0, 0, 0,  0.02, 0, 0,  -0.02, 0, 0.02,  0, 0.02, -0.02,  0, 0, 0,  0, 0, 0];
    const vibTrack = new THREE.VectorKeyframeTrack('OBS.position', times, pos);

    const scaleTrack = new THREE.VectorKeyframeTrack('OBS_Light.scale', [0, 0.5, 1], [1, 1, 1, 2, 2, 2, 1, 1, 1]);

    animationClips.push(new THREE.AnimationClip('DetectQuake', 1, [vibTrack, scaleTrack]));

    return { group, animationClips };
}
