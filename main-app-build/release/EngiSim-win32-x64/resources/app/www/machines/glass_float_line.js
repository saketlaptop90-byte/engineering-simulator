import * as materials from '../utils/materials.js';

export function createFloatGlassLine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const metal = materials.metal || new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.7, roughness: 0.3 });
    const glass = materials.glass || new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transmission: 0.9, opacity: 0.8, transparent: true });
    const molten = materials.molten || new THREE.MeshStandardMaterial({ color: 0xff5500, emissive: 0xff2200, emissiveIntensity: 0.8 });

    // Furnace
    const furnace = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 5), metal);
    furnace.position.set(-8, 2, 0);
    group.add(furnace);

    // Tin Bath
    const bath = new THREE.Mesh(new THREE.BoxGeometry(10, 1, 4), metal);
    bath.position.set(-1, 0.5, 0);
    group.add(bath);

    const tin = new THREE.Mesh(new THREE.BoxGeometry(9.8, 0.1, 3.8), molten);
    tin.position.set(-1, 1.05, 0);
    tin.name = 'MoltenTin';
    group.add(tin);

    // Glass Ribbon
    const ribbon = new THREE.Mesh(new THREE.BoxGeometry(20, 0.05, 3), glass);
    ribbon.position.set(0, 1.1, 0);
    ribbon.name = 'GlassRibbon';
    group.add(ribbon);

    // Rollers
    const rollerGeo = new THREE.CylinderGeometry(0.2, 0.2, 4);
    const axis = new THREE.Vector3(1, 0, 0);
    for (let i = 0; i < 5; i++) {
        const roller = new THREE.Mesh(rollerGeo, metal);
        roller.rotation.x = Math.PI / 2;
        roller.position.set(5 + i, 0.9, 0);
        roller.name = `Roller${i}`;
        group.add(roller);
        
        const rotTrack = new THREE.QuaternionKeyframeTrack(
            `${roller.name}.quaternion`,
            [0, 0.25, 0.5, 0.75, 1],
            [
                ...new THREE.Quaternion().setFromAxisAngle(axis, 0).toArray(),
                ...new THREE.Quaternion().setFromAxisAngle(axis, Math.PI / 2).toArray(),
                ...new THREE.Quaternion().setFromAxisAngle(axis, Math.PI).toArray(),
                ...new THREE.Quaternion().setFromAxisAngle(axis, Math.PI * 1.5).toArray(),
                ...new THREE.Quaternion().setFromAxisAngle(axis, Math.PI * 2).toArray()
            ]
        );
        animationClips.push(new THREE.AnimationClip(`Roll${i}`, 1, [rotTrack]));
    }

    const moveTrack = new THREE.VectorKeyframeTrack(
        'GlassRibbon.position',
        [0, 1],
        [0, 1.1, 0, 1, 1.1, 0]
    );
    animationClips.push(new THREE.AnimationClip('RibbonMove', 1, [moveTrack]));

    return { group, animationClips };
}
