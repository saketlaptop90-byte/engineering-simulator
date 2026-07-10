import { copper, darkSteel, gold, aluminum } from '../utils/materials.js';

export function createHeliconThruster(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Quartz tube (Dielectric plasma containment)
    const tubeGeo = new THREE.CylinderGeometry(1.5, 1.5, 6, 32);
    const tubeMat = new THREE.MeshPhysicalMaterial({ transmission: 0.9, opacity: 1, metalness: 0, roughness: 0, ior: 1.5 });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.rotation.z = Math.PI / 2;
    group.add(tube);

    // Gas inlet base
    const baseGeo = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
    const base = new THREE.Mesh(baseGeo, aluminum);
    base.rotation.z = Math.PI / 2;
    base.position.x = -3.5;
    group.add(base);

    // Helicon Antenna (RF coil)
    const antennaGeo = new THREE.TorusKnotGeometry(1.6, 0.1, 100, 16, 2, 3);
    const antenna = new THREE.Mesh(antennaGeo, copper);
    antenna.name = 'Antenna';
    antenna.rotation.y = Math.PI / 2;
    group.add(antenna);

    // Magnetic Nozzle Coils
    for (let i = 0; i < 3; i++) {
        const coilGeo = new THREE.TorusGeometry(2, 0.3, 16, 32);
        const coil = new THREE.Mesh(coilGeo, darkSteel);
        coil.position.set(2 + i * 1.5, 0, 0);
        coil.rotation.y = Math.PI / 2;
        group.add(coil);
    }

    // Plasma Plume
    const plumeGeo = new THREE.ConeGeometry(3, 10, 32);
    const plumeMat = new THREE.MeshBasicMaterial({ color: 0x0055ff, transparent: true, opacity: 0.6 });
    const plume = new THREE.Mesh(plumeGeo, plumeMat);
    plume.name = 'Plume';
    plume.position.set(7, 0, 0);
    plume.rotation.z = -Math.PI / 2;
    group.add(plume);

    // Animation: Plasma plume flickering and antenna rotation
    const times = [0, 0.5, 1];
    const scales = [1, 1, 1, 1.2, 1, 1.2, 1, 1, 1]; // x, y, z scale factors
    const plumeTrack = new THREE.VectorKeyframeTrack('Plume.scale', times, scales);
    
    // Quaternion track for smooth antenna rotation
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI, 0, 0));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI * 2, 0, 0));
    const quats = [q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w, q3.x, q3.y, q3.z, q3.w];
    const antennaTrack = new THREE.QuaternionKeyframeTrack('Antenna.quaternion', times, quats);
    
    const clip = new THREE.AnimationClip('ThrusterFire', 1, [plumeTrack, antennaTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
