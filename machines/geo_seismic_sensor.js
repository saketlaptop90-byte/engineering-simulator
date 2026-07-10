import { titanium, darkSteel, gold, glass } from '../utils/materials.js';

export function createSeismicTomographySensor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Body
    const bodyGeo = new THREE.CylinderGeometry(1, 1, 2, 32);
    const body = new THREE.Mesh(bodyGeo, titanium);
    body.position.y = 1;
    group.add(body);

    const antennaGeo = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
    const antenna = new THREE.Mesh(antennaGeo, darkSteel);
    antenna.position.y = 3.5;
    group.add(antenna);

    const bulbGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const bulb = new THREE.Mesh(bulbGeo, gold);
    bulb.position.y = 5;
    group.add(bulb);

    // Seismic Waves
    const waveGroup = new THREE.Group();
    waveGroup.name = "waveGroup";
    waveGroup.position.y = 5;
    group.add(waveGroup);

    const ringGeo1 = new THREE.TorusGeometry(1, 0.05, 8, 32);
    const wave1 = new THREE.Mesh(ringGeo1, glass);
    wave1.rotation.x = Math.PI / 2;
    waveGroup.add(wave1);
    
    const ringGeo2 = new THREE.TorusGeometry(1.5, 0.05, 8, 32);
    const wave2 = new THREE.Mesh(ringGeo2, glass);
    wave2.rotation.x = Math.PI / 2;
    waveGroup.add(wave2);

    // Animation: pulsing waves (scale expands and resets)
    const times = [0, 1, 2];
    const scaleValues = [
        0.5, 0.5, 0.5, 
        3.0, 3.0, 3.0, 
        0.5, 0.5, 0.5
    ];
    const scaleTrack = new THREE.VectorKeyframeTrack('waveGroup.scale', times, scaleValues);
    
    // Animate antenna rotating slightly
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/2);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI*1.5);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI*2);
    
    const rotTimes = [0, 0.5, 1.0, 1.5, 2.0];
    const rotValues = [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w,
        q4.x, q4.y, q4.z, q4.w
    ];
    antenna.name = "antenna";
    const rotTrack = new THREE.QuaternionKeyframeTrack('antenna.quaternion', rotTimes, rotValues);

    const clip = new THREE.AnimationClip('Pulse', 2, [scaleTrack, rotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
