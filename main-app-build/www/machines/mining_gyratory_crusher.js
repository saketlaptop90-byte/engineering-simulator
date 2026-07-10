import * as sharedMaterials from '../utils/materials.js';

export function createGyratoryCrusher(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const bluePaint = sharedMaterials.bluePaint || new THREE.MeshStandardMaterial({ color: 0x0055aa, roughness: 0.6 });
    const steel = sharedMaterials.steel || new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.5, roughness: 0.5 });
    const darkMetal = sharedMaterials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });

    // Outer Crusher Bowl (Top Shell)
    const bowlGeo = new THREE.CylinderGeometry(4, 2, 6, 32, 1, true);
    const bowlMat = bluePaint.clone();
    bowlMat.side = THREE.DoubleSide; // To allow looking inside
    const bowl = new THREE.Mesh(bowlGeo, bowlMat);
    bowl.position.y = 4;
    group.add(bowl);

    // Support Base (Bottom Shell Structure)
    const baseGeo = new THREE.CylinderGeometry(2.2, 2.5, 2, 16);
    const base = new THREE.Mesh(baseGeo, darkMetal);
    base.position.y = 1;
    group.add(base);

    // The Spider Assembly (Top bracing)
    const spiderGeo = new THREE.BoxGeometry(8.2, 0.5, 1.2);
    const spider1 = new THREE.Mesh(spiderGeo, bluePaint);
    spider1.position.y = 7;
    group.add(spider1);

    const spider2 = new THREE.Mesh(spiderGeo, bluePaint);
    spider2.rotation.y = Math.PI / 2;
    spider2.position.y = 7;
    group.add(spider2);

    // Eccentric Core Setup for Gyratory Motion
    // The top pivot point is held by the spider at y=7
    const eccentricGroup = new THREE.Group();
    eccentricGroup.position.y = 7; 
    group.add(eccentricGroup);

    // Inner shaft that applies the eccentric tilt
    const mantleGroup = new THREE.Group();
    mantleGroup.rotation.z = 0.12; // Static tilt off the central vertical axis
    eccentricGroup.add(mantleGroup);

    // The Mantle (Crushing Cone)
    const mantleGeo = new THREE.ConeGeometry(1.8, 5.5, 32);
    const mantle = new THREE.Mesh(mantleGeo, steel);
    // Move the cone down so its pivot point accurately remains at the spider
    mantle.position.y = -3.5;
    mantleGroup.add(mantle);

    // Shaft extending below the mantle
    const shaftGeo = new THREE.CylinderGeometry(0.4, 0.4, 2, 16);
    const shaft = new THREE.Mesh(shaftGeo, steel);
    shaft.position.y = -7.25;
    mantleGroup.add(shaft);

    // Animation: The eccentric sleeve rotates rapidly, driving the mantle in a wobbling/gyratory motion
    const rotYTrack = new THREE.NumberKeyframeTrack(
        eccentricGroup.uuid + '.rotation[y]',
        [0, 0.5, 1],
        [0, Math.PI, Math.PI * 2]
    );

    const clip = new THREE.AnimationClip('Gyrate', 1, [rotYTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}

// Auto-generated missing stub
export function createGyratoryRockCrusher() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
