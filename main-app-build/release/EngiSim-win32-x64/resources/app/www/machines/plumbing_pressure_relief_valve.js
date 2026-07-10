import { copper, brass, iron, steel, rubber } from '../utils/materials.js';

export function createPressureReliefValve(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Body
    const bodyGeo = new THREE.CylinderGeometry(1.5, 1.5, 3, 32, 1, false, 0, Math.PI * 1.5);
    const body = new THREE.Mesh(bodyGeo, brass);
    group.add(body);

    const inletGeo = new THREE.CylinderGeometry(1, 1, 1.5, 32);
    const inlet = new THREE.Mesh(inletGeo, brass);
    inlet.position.y = -2;
    group.add(inlet);

    const outletGeo = new THREE.CylinderGeometry(1, 1, 1.5, 32);
    const outlet = new THREE.Mesh(outletGeo, brass);
    outlet.position.x = 1.5;
    outlet.position.y = -0.5;
    outlet.rotation.z = Math.PI / 2;
    group.add(outlet);

    // Spring and Disc
    const internalGroup = new THREE.Group();
    internalGroup.name = 'InternalParts';

    const discGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32);
    const disc = new THREE.Mesh(discGeo, steel);
    disc.position.y = -1;
    internalGroup.add(disc);

    const stemGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.5, 16);
    const stem = new THREE.Mesh(stemGeo, steel);
    stem.position.y = 0.35;
    internalGroup.add(stem);

    // Spring visual (simplified as rings for this example)
    for(let i=0; i<5; i++) {
        const ringGeo = new THREE.TorusGeometry(0.8, 0.1, 8, 16);
        const ring = new THREE.Mesh(ringGeo, steel);
        ring.position.y = -0.5 + i * 0.4;
        ring.rotation.x = Math.PI / 2;
        internalGroup.add(ring);
    }
    
    group.add(internalGroup);

    // Animation: Pressure lifts the disc, then it drops
    const times = [0, 0.5, 1, 1.5, 2];
    const posValues = [
        0, 0, 0,
        0, 0.8, 0,
        0, 0.8, 0,
        0, 0, 0,
        0, 0, 0
    ];
    
    const track = new THREE.VectorKeyframeTrack('InternalParts.position', times, posValues);
    const clip = new THREE.AnimationClip('RelievePressure', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
