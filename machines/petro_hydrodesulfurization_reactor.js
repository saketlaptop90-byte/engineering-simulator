import { materials } from '../utils/materials.js';

export function createHydrodesulfurizationReactor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main vessel
    const vesselGeo = new THREE.CapsuleGeometry(3, 10, 4, 16);
    const vesselMat = materials.steel || new THREE.MeshStandardMaterial({ color: 0x777777 });
    const vessel = new THREE.Mesh(vesselGeo, vesselMat);
    group.add(vessel);

    // Catalyst bed
    const bedGeo = new THREE.CylinderGeometry(2.8, 2.8, 6, 32);
    const bedMat = materials.catalyst || new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 });
    const bed = new THREE.Mesh(bedGeo, bedMat);
    group.add(bed);

    // Hydrogen flow animation
    const flowTracks = [];
    for(let i=0; i<15; i++) {
        const h2Geo = new THREE.SphereGeometry(0.2, 8, 8);
        const h2Mat = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.7 });
        const h2 = new THREE.Mesh(h2Geo, h2Mat);
        h2.position.set(Math.random() * 4 - 2, 6, Math.random() * 4 - 2);
        h2.name = `h2_${i}`;
        group.add(h2);

        const times = [0, 2];
        const values = [
            h2.position.x, 6, h2.position.z,
            h2.position.x, -6, h2.position.z
        ];
        const positionTrack = new THREE.VectorKeyframeTrack(`${h2.name}.position`, times, values);
        flowTracks.push(positionTrack);
    }

    const clip = new THREE.AnimationClip('HydrogenFlow', 2, flowTracks);
    animationClips.push(clip);

    return { group, animationClips };
}
