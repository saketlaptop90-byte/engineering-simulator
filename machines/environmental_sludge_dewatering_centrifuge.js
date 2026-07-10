import * as sharedMaterials from '../utils/materials.js';

export function createSludgeDewateringCentrifuge(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const shinyMetal = sharedMaterials.metalMaterial || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.1 });
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.5 });
    const bluePaint = sharedMaterials.plasticMaterial || new THREE.MeshStandardMaterial({ color: 0x114488, roughness: 0.4 });

    const base = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 1.5), darkMetal);
    base.position.y = 0.25;
    group.add(base);

    const support1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 1), darkMetal);
    support1.position.set(-1.5, 1, 0);
    group.add(support1);

    const support2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 1), darkMetal);
    support2.position.set(1.5, 1, 0);
    group.add(support2);

    const casing = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2.5, 32), bluePaint);
    casing.rotation.z = Math.PI / 2;
    casing.position.set(0, 1.5, 0);
    group.add(casing);

    const scrollBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.4, 3.2, 16), shinyMetal);
    scrollBowl.rotation.z = Math.PI / 2;
    scrollBowl.position.set(0, 1.5, 0);
    scrollBowl.name = 'Centrifuge_Bowl';
    group.add(scrollBowl);

    const motor = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), darkMetal);
    motor.position.set(2.2, 1.5, 0);
    group.add(motor);

    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI/2));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI, 0, Math.PI/2));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI*2, 0, Math.PI/2));
    
    // High speed rotation (0.5s full rotation)
    const rotTrack = new THREE.QuaternionKeyframeTrack('Centrifuge_Bowl.quaternion', [0, 0.25, 0.5], [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ]);

    animationClips.push(new THREE.AnimationClip('Centrifuge_Spin', 0.5, [rotTrack]));

    return { group, animationClips };
}
