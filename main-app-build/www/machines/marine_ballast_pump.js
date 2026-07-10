import * as materials from '../utils/materials.js';

export function createSubmarineBallastTankPump(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Pump Casing
    const casingGeo = new THREE.CylinderGeometry(2, 2, 3, 32);
    const casing = new THREE.Mesh(casingGeo, materials.castIron);
    group.add(casing);

    // Motor
    const motorGeo = new THREE.CylinderGeometry(1.5, 1.5, 2.5, 32);
    motorGeo.translate(0, 2.75, 0);
    const motor = new THREE.Mesh(motorGeo, materials.bluePaint || materials.steel);
    group.add(motor);

    // Pipes (Intake and Outlet)
    const pipeGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 16);
    pipeGeo.rotateZ(Math.PI / 2);
    
    const intake = new THREE.Mesh(pipeGeo, materials.castIron);
    intake.position.set(-2.5, -0.5, 0);
    group.add(intake);

    const outlet = new THREE.Mesh(pipeGeo, materials.castIron);
    outlet.position.set(2.5, 0.5, 0);
    group.add(outlet);

    // Inner Impeller (visible through a cutout or top)
    const impellerGroup = new THREE.Group();
    impellerGroup.name = "Impeller";
    group.add(impellerGroup);

    // Make casing semi-transparent so we can see impeller
    casing.material = new THREE.MeshStandardMaterial({
        color: 0x333333,
        transparent: true,
        opacity: 0.7,
        roughness: 0.8
    });

    const hubGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
    const hub = new THREE.Mesh(hubGeo, materials.brass);
    impellerGroup.add(hub);

    const bladeGeo = new THREE.BoxGeometry(0.1, 1, 3);
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const blade = new THREE.Mesh(bladeGeo, materials.brass);
        // Curve the blade
        blade.position.set(Math.cos(angle) * 1, 0, Math.sin(angle) * 1);
        blade.rotation.y = -angle + Math.PI / 4;
        impellerGroup.add(blade);
    }

    // Animation: Fast spin
    const times = [0, 0.5, 1];
    const yAxis = new THREE.Vector3(0, 1, 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(yAxis, 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI * 2);

    const spinTrack = new THREE.QuaternionKeyframeTrack(
        `Impeller.quaternion`,
        times,
        [q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w, q3.x, q3.y, q3.z, q3.w]
    );

    const clip = new THREE.AnimationClip('PumpOperation', 1, [spinTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
