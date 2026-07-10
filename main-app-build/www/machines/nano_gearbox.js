import { gold, carbon } from '../utils/materials.js';

export function createNanoscaleGearbox(THREE) {
    const group = new THREE.Group();
    group.name = "NanoscaleGearbox";
    const animationClips = [];

    const gearMat1 = gold || new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 1, roughness: 0.2 });
    const gearMat2 = carbon || new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.5 });

    const createGear = (radius, teethCount, material, name) => {
        const gearGroup = new THREE.Group();
        gearGroup.name = name;
        
        const bodyGeo = new THREE.CylinderGeometry(radius, radius, 0.5, 32);
        const body = new THREE.Mesh(bodyGeo, material);
        body.rotation.x = Math.PI / 2;
        gearGroup.add(body);

        const toothGeo = new THREE.BoxGeometry(0.4, 0.4, 0.5);
        for(let i = 0; i < teethCount; i++) {
            const angle = (i / teethCount) * Math.PI * 2;
            const tooth = new THREE.Mesh(toothGeo, material);
            tooth.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
            tooth.rotation.z = angle;
            gearGroup.add(tooth);
        }
        return gearGroup;
    };

    const gear1 = createGear(2, 12, gearMat1, "Gear1");
    gear1.position.set(-2.2, 0, 0);
    group.add(gear1);

    const gear2 = createGear(1.5, 9, gearMat2, "Gear2");
    gear2.position.set(1.5, 0, 0);
    gear2.rotation.z = Math.PI / 9; // Offset for meshing
    group.add(gear2);

    // Animation: Gears turning
    const times = [0, 0.5, 1, 1.5, 2];
    const g1Rot = [];
    const g2Rot = [];
    
    for(let i = 0; i < 5; i++) {
        const angle1 = (i / 4) * Math.PI * 2;
        const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle1);
        g1Rot.push(...q1.toArray());

        const angle2 = Math.PI / 9 - angle1 * (12 / 9);
        const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle2);
        g2Rot.push(...q2.toArray());
    }

    const track1 = new THREE.QuaternionKeyframeTrack("Gear1.quaternion", times, g1Rot);
    const track2 = new THREE.QuaternionKeyframeTrack("Gear2.quaternion", times, g2Rot);

    const clip = new THREE.AnimationClip('Turn', 2, [track1, track2]);
    animationClips.push(clip);

    return { group, animationClips };
}
