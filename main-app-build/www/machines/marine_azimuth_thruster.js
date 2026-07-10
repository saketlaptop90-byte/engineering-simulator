import * as importedMaterials from '../utils/materials.js';
const materials = importedMaterials.default || importedMaterials;

export function createAzimuthThruster(THREE) {
    const group = new THREE.Group();
    group.name = 'AzimuthThruster';
    
    const fallbackMetal = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.3 });
    const fallbackBronze = new THREE.MeshStandardMaterial({ color: 0xcd7f32, metalness: 0.9, roughness: 0.2 });
    const fallbackDark = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.6, roughness: 0.8 });
    
    const metalMat = materials?.metal || fallbackMetal;
    const bronzeMat = materials?.bronze || fallbackBronze;
    const darkMat = materials?.darkMetal || fallbackDark;

    const steeringAssembly = new THREE.Group();
    steeringAssembly.name = 'steeringAssembly';
    group.add(steeringAssembly);

    const stemGeo = new THREE.CylinderGeometry(0.4, 0.4, 2.5, 32);
    const stem = new THREE.Mesh(stemGeo, metalMat);
    stem.position.y = 1.25;
    steeringAssembly.add(stem);

    const podGeo = new THREE.CapsuleGeometry(0.6, 2, 32, 32);
    const pod = new THREE.Mesh(podGeo, darkMat);
    pod.rotation.z = Math.PI / 2;
    pod.position.y = 0;
    steeringAssembly.add(pod);

    const propeller = new THREE.Group();
    propeller.name = 'propeller';
    propeller.position.x = 1.5;
    steeringAssembly.add(propeller);

    const hubGeo = new THREE.CylinderGeometry(0.2, 0.3, 0.4, 32);
    const hub = new THREE.Mesh(hubGeo, bronzeMat);
    hub.rotation.z = Math.PI / 2;
    propeller.add(hub);

    const noseGeo = new THREE.ConeGeometry(0.2, 0.4, 32);
    const nose = new THREE.Mesh(noseGeo, bronzeMat);
    nose.rotation.z = -Math.PI / 2;
    nose.position.x = 0.4;
    propeller.add(nose);

    const bladeGeo = new THREE.BoxGeometry(0.05, 1.2, 0.3);
    for (let i = 0; i < 4; i++) {
        const bladePivot = new THREE.Group();
        bladePivot.rotation.x = (Math.PI / 2) * i;
        const blade = new THREE.Mesh(bladeGeo, bronzeMat);
        blade.position.y = 0.6;
        blade.rotation.y = Math.PI / 6;
        bladePivot.add(blade);
        propeller.add(bladePivot);
    }

    const steeringTrack = new THREE.NumberKeyframeTrack(
        'steeringAssembly.rotation[y]',
        [0, 5, 10, 15, 20],
        [0, Math.PI / 4, 0, -Math.PI / 4, 0]
    );

    const propTimes = [];
    const propValues = [];
    for(let i = 0; i <= 20; i++) {
        propTimes.push(i);
        propValues.push(i * Math.PI * 2);
    }
    const propTrack = new THREE.NumberKeyframeTrack(
        'propeller.rotation[x]',
        propTimes,
        propValues
    );

    const animationClips = [
        new THREE.AnimationClip('Operate', 20, [steeringTrack, propTrack])
    ];

    return { group, animationClips };
}
