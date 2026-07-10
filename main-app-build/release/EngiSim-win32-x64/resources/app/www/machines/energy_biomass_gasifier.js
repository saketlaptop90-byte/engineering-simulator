import { whitePlastic, steel, aluminum, concrete } from '../utils/materials.js';

export function createBiomassGasifier(THREE) {
    const group = new THREE.Group();

    // Reactor base
    const baseGeo = new THREE.BoxGeometry(3, 0.5, 3);
    const base = new THREE.Mesh(baseGeo, concrete);
    base.position.y = 0.25;
    group.add(base);

    // Main Gasifier Cylinder
    const reactorGeo = new THREE.CylinderGeometry(1, 1, 4, 16);
    const reactor = new THREE.Mesh(reactorGeo, steel);
    reactor.position.y = 2.5;
    group.add(reactor);

    // Hopper (Cone on top)
    const hopperGeo = new THREE.ConeGeometry(1.5, 1.5, 16);
    const hopper = new THREE.Mesh(hopperGeo, aluminum);
    hopper.position.y = 5.25;
    group.add(hopper);

    // Feed Auger Tube
    const augerTubeGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.5, 8);
    const augerTube = new THREE.Mesh(augerTubeGeo, steel);
    augerTube.rotation.z = Math.PI / 4;
    augerTube.position.set(-1.5, 4, 0);
    group.add(augerTube);

    // Auger Container (for correct local rotation axis)
    const augerContainer = new THREE.Group();
    augerContainer.position.set(-1.5, 4, 0);
    augerContainer.rotation.z = Math.PI / 4;
    group.add(augerContainer);

    // Animated Auger inside tube (simulating the feed mechanism)
    const augerGroup = new THREE.Group();
    augerGroup.name = 'BiomassAuger';
    augerContainer.add(augerGroup);

    const augerScrewGeo = new THREE.CylinderGeometry(0.15, 0.15, 2.6, 8);
    const augerScrew = new THREE.Mesh(augerScrewGeo, aluminum);
    augerGroup.add(augerScrew);

    // Exhaust Pipe
    const exhaustGeo = new THREE.CylinderGeometry(0.15, 0.15, 3, 8);
    const exhaust = new THREE.Mesh(exhaustGeo, steel);
    exhaust.position.set(1.15, 3.5, 0);
    group.add(exhaust);

    // Animation: Auger spinning
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 2 * Math.PI);
    
    const times = [0, 1, 2];
    const values = [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
    ];
    
    const track = new THREE.QuaternionKeyframeTrack('BiomassAuger.quaternion', times, values);
    const clip = new THREE.AnimationClip('SpinAuger', 2, [track]);

    return { group, animationClips: [clip] };
}
