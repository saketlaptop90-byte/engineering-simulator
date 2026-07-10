import * as materials from '../utils/materials.js';

export function createSeafloorSeismometer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base structure (anchor)
    const baseGeometry = new THREE.CylinderGeometry(1.5, 2, 0.5, 6);
    const base = new THREE.Mesh(baseGeometry, materials.metal);
    base.position.y = 0.25;
    group.add(base);

    // Glass sphere housing
    const housingGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const housingMaterial = new THREE.MeshPhysicalMaterial({ transmission: 0.9, opacity: 1, metalness: 0, roughness: 0, ior: 1.5, color: 0xffffaa });
    const housing = new THREE.Mesh(housingGeometry, housingMaterial);
    housing.position.y = 1.3;
    group.add(housing);

    // Inner sensors
    const innerSensorGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const innerSensor = new THREE.Mesh(innerSensorGeometry, materials.accent);
    innerSensor.position.y = 1.3;
    group.add(innerSensor);

    // Acoustic release mechanism
    const releaseGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.6);
    const release = new THREE.Mesh(releaseGeometry, materials.composite);
    release.position.y = 2.4;
    group.add(release);

    // Antenna/Transducer
    const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1);
    const antenna = new THREE.Mesh(antennaGeometry, materials.metal);
    antenna.position.y = 3.2;
    group.add(antenna);

    // Earthquake vibration animation
    const times = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 2.0];
    const valuesPos = [
        0, 1.3, 0,
        0.05, 1.3, 0.05,
        -0.05, 1.3, -0.05,
        0.05, 1.3, -0.05,
        -0.05, 1.3, 0.05,
        0.02, 1.3, 0.02,
        0, 1.3, 0,
        0, 1.3, 0
    ];
    
    const vibTrack = new THREE.VectorKeyframeTrack(`${innerSensor.uuid}.position`, times, valuesPos);
    
    // Blinking light
    const lightGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const lightMat = new THREE.MeshBasicMaterial({color: 0xff0000});
    const light = new THREE.Mesh(lightGeometry, lightMat);
    light.position.y = 3.8;
    group.add(light);
    
    const lightTimes = [0, 0.5, 1, 1.5];
    const lightScale = [1, 1, 1, 0.01, 0.01, 0.01, 1, 1, 1, 0.01, 0.01, 0.01];
    const lightTrack = new THREE.VectorKeyframeTrack(`${light.uuid}.scale`, lightTimes, lightScale);

    const clip = new THREE.AnimationClip('SeismicEvent', 2, [vibTrack, lightTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
