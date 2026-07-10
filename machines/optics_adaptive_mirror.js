import { allMaterials as mat, tinted } from '../utils/materials.js';

export function createAdaptiveOpticsMirror(THREE) {
    const group = new THREE.Group();
    group.name = "Adaptive Optics Mirror";

    const animationClips = [];

    // Base structure
    const baseGeo = new THREE.CylinderGeometry(5, 5.5, 1.5, 32);
    const base = new THREE.Mesh(baseGeo, mat.darkSteel);
    base.position.y = -0.75;
    group.add(base);

    // Actuators and Mirror segments
    const segments = new THREE.Group();
    group.add(segments);

    const rings = 4;
    const hexGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.1, 6);
    const actuatorGeo = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);

    const segmentMeshes = [];
    
    let id = 0;
    for (let q = -rings; q <= rings; q++) {
        let r1 = Math.max(-rings, -q - rings);
        let r2 = Math.min(rings, -q + rings);
        for (let r = r1; r <= r2; r++) {
            const x = Math.sqrt(3) * (q + r/2) * 0.95;
            const z = 3/2 * r * 0.95;

            // actuator
            const actuator = new THREE.Mesh(actuatorGeo, mat.aluminum);
            actuator.position.set(x, 0.5, z);
            group.add(actuator);

            // mirror segment
            const seg = new THREE.Mesh(hexGeo, mat.chrome);
            seg.position.set(x, 1.05, z);
            seg.rotation.y = Math.PI / 6;
            segments.add(seg);
            
            segmentMeshes.push({ mesh: seg, x, z, dist: Math.sqrt(x*x + z*z) });
            id++;
        }
    }

    // Animation for flexing
    const tracks = [];
    const times = [];
    for (let i = 0; i <= 60; i++) {
        times.push(i * 0.05); // 3 seconds
    }

    segmentMeshes.forEach((item) => {
        const values = [];
        for (let i = 0; i <= 60; i++) {
            const t = i * 0.05;
            // Wave equation
            const yOffset = Math.sin(item.dist * 1.5 - t * Math.PI * 2) * 0.15;
            values.push(item.x, 1.05 + yOffset, item.z);
        }
        const trackName = `${item.mesh.uuid}.position`;
        const track = new THREE.VectorKeyframeTrack(trackName, times, values);
        tracks.push(track);
    });

    const clip = new THREE.AnimationClip('FlexMirror', 3, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
