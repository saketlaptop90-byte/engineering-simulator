import * as sharedMaterials from '../utils/materials.js';

export function createElectrostaticPrecipitator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const metal = sharedMaterials.metalMaterial || new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.9, roughness: 0.4 });
    const wireMat = sharedMaterials.wireMaterial || new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 1.0, roughness: 0.1 });

    const casing = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 3), metal);
    casing.position.set(0, 3, 0);
    group.add(casing);

    const hopper1 = new THREE.Mesh(new THREE.ConeGeometry(1.5, 1.5, 4), metal);
    hopper1.rotation.y = Math.PI / 4;
    hopper1.position.set(-1, 0.75, 0);
    group.add(hopper1);

    const hopper2 = new THREE.Mesh(new THREE.ConeGeometry(1.5, 1.5, 4), metal);
    hopper2.rotation.y = Math.PI / 4;
    hopper2.position.set(1, 0.75, 0);
    group.add(hopper2);

    const hammerGroup = new THREE.Group();
    hammerGroup.position.set(0, 4.6, 0);
    hammerGroup.name = 'ESP_Hammers';
    
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.2, 8), wireMat);
    shaft.rotation.z = Math.PI / 2;
    hammerGroup.add(shaft);

    for(let i=0; i<5; i++) {
        const hammer = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.1), metal);
        hammer.position.set(-1.5 + i*0.75, 0.2, 0);
        hammerGroup.add(hammer);
    }
    group.add(hammerGroup);

    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/4, 0, 0));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q4 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/4, 0, 0));
    const q5 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    
    const rotTrack = new THREE.QuaternionKeyframeTrack('ESP_Hammers.quaternion', [0, 0.25, 0.5, 0.75, 1.0], [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w,
        q4.x, q4.y, q4.z, q4.w,
        q5.x, q5.y, q5.z, q5.w
    ]);

    animationClips.push(new THREE.AnimationClip('ESP_Rapping_Animation', 1.0, [rotTrack]));

    return { group, animationClips };
}
