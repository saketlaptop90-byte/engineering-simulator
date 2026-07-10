import * as materials from '../utils/materials.js';

export function createTextileDyeingVat(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const metal = materials.metal || new THREE.MeshStandardMaterial({ color: 0x8899a6, metalness: 0.8, roughness: 0.3 });
    const liquidMat = materials.liquid || new THREE.MeshPhysicalMaterial({ color: 0x1f4287, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 });
    const fabric = materials.fabric || new THREE.MeshStandardMaterial({ color: 0x1f4287, side: THREE.DoubleSide });

    // Vat
    const vatGeo = new THREE.CylinderGeometry(2, 2, 2, 32, 1, true);
    const vat = new THREE.Mesh(vatGeo, metal);
    vat.position.y = 1;
    group.add(vat);

    const vatBase = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.1, 32), metal);
    vatBase.position.y = 0.05;
    group.add(vatBase);

    // Liquid
    const liquid = new THREE.Mesh(new THREE.CylinderGeometry(1.95, 1.95, 1.5, 32), liquidMat);
    liquid.position.y = 0.8;
    group.add(liquid);

    // Rollers
    const roller1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3, 16), metal);
    roller1.rotation.z = Math.PI / 2;
    roller1.position.set(-1.5, 2.5, 0);
    group.add(roller1);

    const roller2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3, 16), metal);
    roller2.rotation.z = Math.PI / 2;
    roller2.position.set(0, 0.5, 0);
    group.add(roller2);

    const roller3 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3, 16), metal);
    roller3.rotation.z = Math.PI / 2;
    roller3.position.set(1.5, 2.5, 0);
    group.add(roller3);
    
    // Liquid level undulating slightly (scale y)
    const liquidScaleTrack = new THREE.VectorKeyframeTrack(
        liquid.uuid + '.scale',
        [0, 1, 2],
        [1,1,1, 1,1.05,1, 1,1,1]
    );

    const r1Track = new THREE.NumberKeyframeTrack(roller1.uuid + '.rotation[x]', [0, 2], [0, Math.PI * 4]);
    const r2Track = new THREE.NumberKeyframeTrack(roller2.uuid + '.rotation[x]', [0, 2], [0, Math.PI * 4]);
    const r3Track = new THREE.NumberKeyframeTrack(roller3.uuid + '.rotation[x]', [0, 2], [0, Math.PI * 4]);

    const clip = new THREE.AnimationClip('DyeingProcess', 2, [liquidScaleTrack, r1Track, r2Track, r3Track]);
    animationClips.push(clip);

    return { group, animationClips };
}

// Auto-generated missing stub
export function createDyeingVat() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
