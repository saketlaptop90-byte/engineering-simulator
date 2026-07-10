import { materials } from '../utils/materials.js';

export function createHeliconPlasmaSource(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const metalMat = materials?.metal || new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8, roughness: 0.3 });
    const glassMat = materials?.glass || new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 });
    const antennaMat = materials?.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.6, roughness: 0.4 });
    const plasmaMat = materials?.plasma_purple || new THREE.MeshBasicMaterial({ color: 0xcc00ff, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });

    // Quartz Tube
    const tubeGeo = new THREE.CylinderGeometry(1.5, 1.5, 8, 32, 1, true);
    const tube = new THREE.Mesh(tubeGeo, glassMat);
    tube.rotation.z = Math.PI / 2;
    group.add(tube);

    // Helicon Antenna (Half-twist)
    const antennaCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2, 1.6, 0),
        new THREE.Vector3(0, 0, 1.6),
        new THREE.Vector3(2, -1.6, 0)
    ]);
    const antennaGeo = new THREE.TubeGeometry(antennaCurve, 64, 0.1, 8, false);
    const antenna = new THREE.Mesh(antennaGeo, antennaMat);
    antenna.name = "rfAntenna";
    group.add(antenna);

    // Magnetic Coils
    const coilGeo = new THREE.TorusGeometry(2, 0.2, 16, 64);
    for (let i = -3; i <= 3; i += 3) {
        const coil = new THREE.Mesh(coilGeo, metalMat);
        coil.position.x = i;
        coil.rotation.y = Math.PI / 2;
        group.add(coil);
    }

    // Helicon Plasma Core
    const plasmaGeo = new THREE.CylinderGeometry(1, 1, 8, 32);
    const plasma = new THREE.Mesh(plasmaGeo, plasmaMat);
    plasma.rotation.z = Math.PI / 2;
    plasma.name = "heliconPlasma";
    group.add(plasma);

    // Animations
    const waveClip = new THREE.AnimationClip('WavePropagation', 1.5, [
        new THREE.VectorKeyframeTrack('heliconPlasma.scale', [0, 0.75, 1.5], [1, 0.8, 0.8,  1, 1.2, 1.2,  1, 0.8, 0.8]),
        new THREE.NumberKeyframeTrack('rfAntenna.rotation[x]', [0, 1.5], [0, Math.PI * 2])
    ]);
    animationClips.push(waveClip);

    return { group, animationClips };
}
