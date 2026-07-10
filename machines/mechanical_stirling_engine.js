import { brassMaterial, glassMaterial, steelMaterial } from '../utils/materials.js';

export function createStirlingEngine(THREE) {
    const group = new THREE.Group();
    group.name = "StirlingEngine";

    // Main cylinder
    const cylinderGeometry = new THREE.CylinderGeometry(1.2, 1.2, 4, 32);
    const cylinder = new THREE.Mesh(cylinderGeometry, glassMaterial || new THREE.MeshStandardMaterial({color: 0xadd8e6, transparent: true, opacity: 0.3}));
    group.add(cylinder);

    // Displacer piston
    const displacerGeometry = new THREE.CylinderGeometry(1.1, 1.1, 1.5, 16);
    const displacer = new THREE.Mesh(displacerGeometry, brassMaterial || new THREE.MeshStandardMaterial({color: 0xb5a642}));
    displacer.name = "Displacer";
    group.add(displacer);

    // Power piston cylinder
    const powerCylinderGeo = new THREE.CylinderGeometry(0.6, 0.6, 2, 16);
    const powerCyl = new THREE.Mesh(powerCylinderGeo, steelMaterial || new THREE.MeshStandardMaterial({color: 0x555555}));
    powerCyl.position.set(2, -1, 0);
    group.add(powerCyl);

    // Power piston
    const powerPistonGeometry = new THREE.CylinderGeometry(0.55, 0.55, 0.5, 16);
    const powerPiston = new THREE.Mesh(powerPistonGeometry, steelMaterial || new THREE.MeshStandardMaterial({color: 0x888888}));
    powerPiston.name = "PowerPiston";
    powerPiston.position.set(2, -0.5, 0);
    group.add(powerPiston);

    // Flywheel
    const flywheelGeo = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    const flywheel = new THREE.Mesh(flywheelGeo, brassMaterial || new THREE.MeshStandardMaterial({color: 0xaa9944}));
    flywheel.rotation.x = Math.PI / 2;
    flywheel.position.set(1, 2.5, 0);
    flywheel.name = "Flywheel";
    group.add(flywheel);

    // Animations: Displacer and Power Piston 90 degrees out of phase
    const dPosTrack = new THREE.VectorKeyframeTrack('Displacer.position', [0, 0.5, 1, 1.5, 2], [0, 1, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 1, 0]);
    const pPosTrack = new THREE.VectorKeyframeTrack('PowerPiston.position', [0, 0.5, 1, 1.5, 2], [
        2, -0.5, 0,
        2, -1, 0,
        2, -0.5, 0,
        2, 0, 0,
        2, -0.5, 0
    ]);

    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * 2);
    const flyTrack = new THREE.QuaternionKeyframeTrack('Flywheel.quaternion', [0, 1, 2], [
        q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w, q3.x, q3.y, q3.z, q3.w
    ]);

    const clip = new THREE.AnimationClip("StirlingCycle", 2, [dPosTrack, pPosTrack, flyTrack]);
    return { group, animationClips: [clip] };
}
