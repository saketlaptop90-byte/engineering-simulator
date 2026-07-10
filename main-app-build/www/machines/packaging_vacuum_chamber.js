import { materials } from '../utils/materials.js';

export function createVacuumChamber(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matMetal = materials?.metal || new THREE.MeshStandardMaterial({ color: 0x99aacc, roughness: 0.3, metalness: 0.7 });
    const matDark = materials?.darkMetal || new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
    const matGlass = materials?.glass || new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true });

    // Lower Chamber
    const baseGeo = new THREE.BoxGeometry(3, 1, 3);
    const base = new THREE.Mesh(baseGeo, matMetal);
    base.position.y = 0.5;
    group.add(base);

    const cavityGeo = new THREE.BoxGeometry(2.6, 0.2, 2.6);
    const cavity = new THREE.Mesh(cavityGeo, matDark);
    cavity.position.y = 1.01;
    group.add(cavity);

    // Lid (Hinged at the back)
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 1, -1.5); // Hinge position
    lidGroup.name = 'ChamberLid';
    group.add(lidGroup);

    const lidGeo = new THREE.BoxGeometry(3, 0.5, 3);
    const lid = new THREE.Mesh(lidGeo, matMetal);
    lid.position.set(0, 0.25, 1.5); // Offset from hinge
    lidGroup.add(lid);

    const windowGeo = new THREE.BoxGeometry(2, 0.52, 2);
    const windowMesh = new THREE.Mesh(windowGeo, matGlass);
    windowMesh.position.set(0, 0.25, 1.5);
    lidGroup.add(windowMesh);

    // Vacuum Pump
    const pumpGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 16);
    const pump = new THREE.Mesh(pumpGeo, matDark);
    pump.position.set(1.5, 0.6, 0);
    pump.rotation.z = Math.PI / 2;
    group.add(pump);

    // Animation: Lid opening and closing
    const qClosed = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0);
    const qOpen = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -Math.PI / 3);

    const lidTrack = new THREE.QuaternionKeyframeTrack(
        'ChamberLid.quaternion',
        [0, 1, 2, 3, 4],
        [
            qOpen.x, qOpen.y, qOpen.z, qOpen.w,
            qClosed.x, qClosed.y, qClosed.z, qClosed.w,
            qClosed.x, qClosed.y, qClosed.z, qClosed.w, // Hold closed for vacuum process
            qOpen.x, qOpen.y, qOpen.z, qOpen.w,
            qOpen.x, qOpen.y, qOpen.z, qOpen.w
        ]
    );

    const clip = new THREE.AnimationClip('VacuumCycle', 4, [lidTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
