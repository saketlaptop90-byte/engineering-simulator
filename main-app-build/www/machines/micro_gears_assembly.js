import { titanium, carbonFiber, ghostMaterial } from '../utils/materials.js';

export function createMicroGearsAssembly(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Helper to create a gear
    function createGear(radius, teethCount, material) {
        const gearGeo = new THREE.CylinderGeometry(radius, radius, 0.1, teethCount * 2);
        const gear = new THREE.Mesh(gearGeo, material);
        // Add teeth
        for (let i = 0; i < teethCount; i++) {
            const toothGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
            const tooth = new THREE.Mesh(toothGeo, material);
            const angle = (i / teethCount) * Math.PI * 2;
            tooth.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
            tooth.rotation.y = -angle;
            gear.add(tooth);
        }
        return gear;
    }

    // Create a train of 3 gears
    const gear1 = createGear(0.5, 12, titanium);
    gear1.position.set(-0.6, 0, 0);
    group.add(gear1);

    const gear2 = createGear(0.3, 8, carbonFiber);
    gear2.position.set(0.3, 0, 0);
    group.add(gear2);

    const gear3 = createGear(0.7, 16, ghostMaterial);
    gear3.position.set(1.4, 0, 0);
    group.add(gear3);

    // Base plate
    const plateGeo = new THREE.BoxGeometry(3, 0.05, 1.5);
    const plate = new THREE.Mesh(plateGeo, titanium);
    plate.position.set(0.4, -0.1, 0);
    group.add(plate);

    // Animation: Gears spinning in interlocking ratios
    const duration = 2; // seconds
    const times = [0, duration];
    
    // gear1 rotates 1 turn
    const track1 = new THREE.QuaternionKeyframeTrack(
        `${gear1.uuid}.quaternion`,
        times,
        [
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray(),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 2, 0)).toArray()
        ].flat()
    );

    // gear2 rotates in opposite direction, ratio = 12/8 = 1.5 turns
    const track2 = new THREE.QuaternionKeyframeTrack(
        `${gear2.uuid}.quaternion`,
        times,
        [
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray(),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI * 2 * 1.5, 0)).toArray()
        ].flat()
    );

    // gear3 rotates in same direction as gear1, ratio from gear2 = 8/16 = 0.5 of gear2 = 0.75 turns of gear1
    const track3 = new THREE.QuaternionKeyframeTrack(
        `${gear3.uuid}.quaternion`,
        times,
        [
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray(),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 2 * 0.75, 0)).toArray()
        ].flat()
    );

    const clip = new THREE.AnimationClip('spin_gears', duration, [track1, track2, track3]);
    animationClips.push(clip);

    return { group, animationClips };
}
