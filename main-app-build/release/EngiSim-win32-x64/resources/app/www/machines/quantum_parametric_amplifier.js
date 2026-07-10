import { copper, gold, darkSteel, aluminum } from '../utils/materials.js';

export function createParametricAmplifier(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Casing
    const casingGeo = new THREE.BoxGeometry(1.5, 3, 1.5);
    const casing = new THREE.Mesh(casingGeo, copper);
    casing.position.y = 1.5;
    group.add(casing);

    // Connectors
    const connGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16);
    const connIn = new THREE.Mesh(connGeo, gold);
    connIn.position.set(-0.75, 1.5, 0);
    connIn.rotation.z = Math.PI / 2;
    group.add(connIn);

    const connOut = new THREE.Mesh(connGeo, gold);
    connOut.position.set(0.75, 1.5, 0);
    connOut.rotation.z = Math.PI / 2;
    group.add(connOut);

    // Pump port
    const connPump = new THREE.Mesh(connGeo, darkSteel);
    connPump.position.set(0, 3, 0);
    group.add(connPump);

    // Internal standing wave visualizer (placed outside casing for visibility, or make casing transparent)
    casing.material.transparent = true;
    casing.material.opacity = 0.4;

    const waveGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.8, 16);
    const waveMat = new THREE.MeshBasicMaterial({ color: 0xff8800, wireframe: true });
    const wave = new THREE.Mesh(waveGeo, waveMat);
    wave.name = 'AmplifierWave';
    wave.position.y = 1.5;
    group.add(wave);

    // Animation: Pump and signal amplification
    const wTimes = [0, 0.5, 1];
    const wScaleValues = [
        1, 1, 1,
        2, 1, 2, // Bulges out
        1, 1, 1
    ];
    const waveTrack = new THREE.VectorKeyframeTrack(`${wave.name}.scale`, wTimes, wScaleValues);
    
    const clip = new THREE.AnimationClip('AmplifySignal', 1, [waveTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
