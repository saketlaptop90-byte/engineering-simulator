import { brass, gold, wood, steel } from '../utils/materials.js';

export function createMechanicalOrrery(THREE) {
    const group = new THREE.Group();

    // Base
    const baseGeo = new THREE.CylinderGeometry(4, 5, 1, 32);
    const base = new THREE.Mesh(baseGeo, wood);
    group.add(base);

    // Central Sun
    const sunPivot = new THREE.Group();
    sunPivot.name = "SunPivot";
    sunPivot.position.y = 4;
    group.add(sunPivot);

    const sunGeo = new THREE.SphereGeometry(1.5, 16, 16);
    const sun = new THREE.Mesh(sunGeo, gold);
    sunPivot.add(sun);

    // Central Pillar
    const pillarGeo = new THREE.CylinderGeometry(0.3, 0.3, 4);
    const pillar = new THREE.Mesh(pillarGeo, brass);
    pillar.position.y = 2;
    group.add(pillar);

    // Planet 1 (Inner)
    const p1Pivot = new THREE.Group();
    p1Pivot.position.y = 1;
    p1Pivot.name = "P1Pivot";
    pillar.add(p1Pivot);

    const p1ArmGeo = new THREE.CylinderGeometry(0.1, 0.1, 3);
    const p1Arm = new THREE.Mesh(p1ArmGeo, steel);
    p1Arm.rotation.z = Math.PI / 2;
    p1Arm.position.x = 1.5;
    p1Pivot.add(p1Arm);

    const p1Geo = new THREE.SphereGeometry(0.4, 16, 16);
    const planet1 = new THREE.Mesh(p1Geo, brass);
    planet1.position.x = 3;
    p1Pivot.add(planet1);

    // Planet 2 (Outer)
    const p2Pivot = new THREE.Group();
    p2Pivot.position.y = 2;
    p2Pivot.name = "P2Pivot";
    pillar.add(p2Pivot);

    const p2ArmGeo = new THREE.CylinderGeometry(0.1, 0.1, 5);
    const p2Arm = new THREE.Mesh(p2ArmGeo, steel);
    p2Arm.rotation.z = Math.PI / 2;
    p2Arm.position.x = 2.5;
    p2Pivot.add(p2Arm);

    const p2Geo = new THREE.SphereGeometry(0.6, 16, 16);
    const planet2 = new THREE.Mesh(p2Geo, wood);
    planet2.position.x = 5;
    p2Pivot.add(planet2);

    // Animations (Orbiting)
    const makeRotValues = (cycles, duration) => {
        const tr = [];
        const vl = [];
        const steps = 4 * cycles;
        for(let i=0; i<=steps; i++) {
            tr.push((i/steps)*duration);
            const angle = (i/steps) * (Math.PI * 2 * cycles);
            const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
            vl.push(q.x, q.y, q.z, q.w);
        }
        return { tr, vl };
    }

    const sunAnim = makeRotValues(1, 4);
    const sunTrackFixed = new THREE.QuaternionKeyframeTrack('SunPivot.quaternion', sunAnim.tr, sunAnim.vl);

    const p1Anim = makeRotValues(2, 4); // 2 orbits
    const p1TrackFixed = new THREE.QuaternionKeyframeTrack('P1Pivot.quaternion', p1Anim.tr, p1Anim.vl);

    const p2Anim = makeRotValues(1, 4); // 1 orbit
    const p2TrackFixed = new THREE.QuaternionKeyframeTrack('P2Pivot.quaternion', p2Anim.tr, p2Anim.vl);

    const clip = new THREE.AnimationClip('orbit', 4, [sunTrackFixed, p1TrackFixed, p2TrackFixed]);

    return { group, animationClips: [clip] };
}
