import { materials } from '../utils/materials.js';

export function createAnemometerTower(THREE) {
    const group = new THREE.Group();

    // Tower base (lattice truss simulation using simple thin cylinders)
    const baseGroup = new THREE.Group();
    const legGeo = new THREE.CylinderGeometry(0.1, 0.2, 10, 4);
    
    for (let i = 0; i < 4; i++) {
        const leg = new THREE.Mesh(legGeo, materials.metallic);
        const x = i % 2 === 0 ? 0.5 : -0.5;
        const z = i < 2 ? 0.5 : -0.5;
        leg.position.set(x, 5, z);
        leg.rotation.x = z * 0.05;
        leg.rotation.z = -x * 0.05;
        baseGroup.add(leg);
    }
    
    // Core structural piece for simplicity
    const coreGeo = new THREE.CylinderGeometry(0.2, 0.2, 10, 8);
    const core = new THREE.Mesh(coreGeo, materials.metallic);
    core.position.y = 5;
    baseGroup.add(core);

    group.add(baseGroup);

    // Anemometer (Cups)
    const cupGroup = new THREE.Group();
    cupGroup.position.y = 10.5;
    group.add(cupGroup);

    const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const arm1 = new THREE.Mesh(armGeo, materials.metallic);
    arm1.rotation.x = Math.PI / 2;
    cupGroup.add(arm1);

    const arm2 = new THREE.Mesh(armGeo, materials.metallic);
    arm2.rotation.z = Math.PI / 2;
    cupGroup.add(arm2);

    const cupGeo = new THREE.SphereGeometry(0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    
    for (let i = 0; i < 4; i++) {
        const cup = new THREE.Mesh(cupGeo, materials.accent || new THREE.MeshStandardMaterial({ color: 0xff3333 }));
        const angle = (i * Math.PI) / 2;
        cup.position.set(Math.cos(angle) * 1, 0, Math.sin(angle) * 1);
        cup.rotation.y = angle + Math.PI / 2;
        cup.rotation.x = Math.PI / 2;
        cupGroup.add(cup);
    }

    // Wind Vane
    const vaneGroup = new THREE.Group();
    vaneGroup.position.y = 8.5;
    group.add(vaneGroup);

    const vaneArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8), materials.metallic);
    vaneArm.rotation.x = Math.PI / 2;
    vaneGroup.add(vaneArm);

    const finGeo = new THREE.BoxGeometry(0.05, 0.5, 0.5);
    const fin = new THREE.Mesh(finGeo, materials.accent || materials.metallic);
    fin.position.z = -0.75;
    vaneGroup.add(fin);

    const pointerGeo = new THREE.ConeGeometry(0.15, 0.4, 8);
    const pointer = new THREE.Mesh(pointerGeo, materials.accent || materials.metallic);
    pointer.rotation.x = Math.PI / 2;
    pointer.position.z = 0.75;
    vaneGroup.add(pointer);

    // Animations
    const animationClips = [];

    // Fast cup rotation
    const cupTrack = new THREE.NumberKeyframeTrack(
        `${cupGroup.uuid}.rotation[y]`,
        [0, 1],
        [0, Math.PI * 2]
    );

    // Vane oscillating
    const vaneTrack = new THREE.NumberKeyframeTrack(
        `${vaneGroup.uuid}.rotation[y]`,
        [0, 1.5, 3, 4.5, 6],
        [0, Math.PI/4, -Math.PI/6, Math.PI/8, 0]
    );

    const clip = new THREE.AnimationClip('WindMeasurement', 6, [cupTrack, vaneTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
