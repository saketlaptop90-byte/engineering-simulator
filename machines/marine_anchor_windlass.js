import * as importedMaterials from '../utils/materials.js';
const materials = importedMaterials.default || importedMaterials;

export function createAnchorWindlass(THREE) {
    const group = new THREE.Group();
    group.name = 'AnchorWindlass';

    const fallbackMetal = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.8, roughness: 0.4 });
    const fallbackSteel = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.9, roughness: 0.2 });
    const fallbackDark = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.6 });
    const fallbackRed = new THREE.MeshStandardMaterial({ color: 0xaa2222, metalness: 0.3, roughness: 0.7 });

    const metalMat = materials?.metal || fallbackMetal;
    const steelMat = materials?.steel || fallbackSteel;
    const darkMat = materials?.darkMetal || fallbackDark;
    const redMat = materials?.redPaint || fallbackRed;

    const baseGeo = new THREE.BoxGeometry(4, 0.4, 3);
    const base = new THREE.Mesh(baseGeo, darkMat);
    group.add(base);

    const motorGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.5, 32);
    const motor = new THREE.Mesh(motorGeo, redMat);
    motor.rotation.z = Math.PI / 2;
    motor.position.set(-1, 0.8, -0.5);
    group.add(motor);

    const shaftAssembly = new THREE.Group();
    shaftAssembly.name = 'shaftAssembly';
    shaftAssembly.position.set(0, 1.2, 0);
    group.add(shaftAssembly);

    const shaftGeo = new THREE.CylinderGeometry(0.2, 0.2, 4.5, 16);
    const shaft = new THREE.Mesh(shaftGeo, steelMat);
    shaft.rotation.z = Math.PI / 2;
    shaftAssembly.add(shaft);

    const gypsyGeo = new THREE.TorusGeometry(0.6, 0.2, 16, 16);
    const gypsy = new THREE.Mesh(gypsyGeo, metalMat);
    gypsy.rotation.y = Math.PI / 2;
    gypsy.position.x = 0.5;
    shaftAssembly.add(gypsy);

    const gypsyTeethGeo = new THREE.BoxGeometry(0.4, 1.4, 0.4);
    for (let i = 0; i < 6; i++) {
        const tooth = new THREE.Mesh(gypsyTeethGeo, metalMat);
        tooth.position.x = 0.5;
        tooth.rotation.x = (Math.PI / 3) * i;
        shaftAssembly.add(tooth);
    }

    const drumGeo = new THREE.CylinderGeometry(0.5, 0.4, 1, 32);
    const drum = new THREE.Mesh(drumGeo, steelMat);
    drum.rotation.z = Math.PI / 2;
    drum.position.x = 1.8;
    shaftAssembly.add(drum);

    const drum2 = new THREE.Mesh(drumGeo, steelMat);
    drum2.rotation.z = -Math.PI / 2;
    drum2.position.x = -1.8;
    shaftAssembly.add(drum2);

    const pillarGeo = new THREE.BoxGeometry(0.6, 1.2, 0.8);
    const pillar1 = new THREE.Mesh(pillarGeo, darkMat);
    pillar1.position.set(1.2, 0.6, 0);
    group.add(pillar1);

    const pillar2 = new THREE.Mesh(pillarGeo, darkMat);
    pillar2.position.set(-1.2, 0.6, 0);
    group.add(pillar2);

    const chainGroup = new THREE.Group();
    chainGroup.name = 'chainGroup';
    group.add(chainGroup);

    const linkGeo = new THREE.TorusGeometry(0.15, 0.06, 8, 16);
    for (let i = -2; i < 10; i++) {
        const link = new THREE.Mesh(linkGeo, steelMat);
        link.position.set(0.5, 1.2 - i * 0.35, 0.6);
        if (Math.abs(i) % 2 === 0) {
            link.rotation.y = Math.PI / 2;
        } else {
            link.rotation.x = Math.PI / 2;
        }
        chainGroup.add(link);
    }

    const duration = 2;
    const times = [];
    const shaftRotValues = [];
    const chainPosValues = [];

    for (let i = 0; i <= 30; i++) {
        const t = (i / 30) * duration;
        times.push(t);
        
        shaftRotValues.push(-t * Math.PI);
        
        const chainY = -((t / duration) * 0.7);
        chainPosValues.push(0, chainY, 0);
    }

    const shaftTrack = new THREE.NumberKeyframeTrack('shaftAssembly.rotation[x]', times, shaftRotValues);
    const chainTrack = new THREE.VectorKeyframeTrack('chainGroup.position', times, chainPosValues);

    const animationClips = [
        new THREE.AnimationClip('Wind', duration, [shaftTrack, chainTrack])
    ];

    return { group, animationClips };
}
