import * as materialsImport from '../utils/materials.js';
const materials = materialsImport.default || materialsImport.materials || materialsImport;

export function createFrothFlotationCell(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Tank
    const tankGeo = new THREE.CylinderGeometry(4, 4, 6, 32, 1, true);
    const tankMat = materials.bluePaint || new THREE.MeshStandardMaterial({ color: 0x0055ff, side: THREE.DoubleSide });
    const tank = new THREE.Mesh(tankGeo, tankMat);
    group.add(tank);

    // Froth layer (bubbles)
    const frothGroup = new THREE.Group();
    frothGroup.name = "FrothLayer";
    frothGroup.position.set(0, 2.8, 0);
    const frothGeo = new THREE.TorusGeometry(3.5, 0.5, 16, 50);
    const frothMat = materials.foam || new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    const froth = new THREE.Mesh(frothGeo, frothMat);
    froth.rotation.x = Math.PI / 2;
    frothGroup.add(froth);
    group.add(frothGroup);

    // Impeller
    const impellerGroup = new THREE.Group();
    impellerGroup.name = "Impeller";
    const shaftGeo = new THREE.CylinderGeometry(0.2, 0.2, 5);
    const shaft = new THREE.Mesh(shaftGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0xcccccc }));
    shaft.position.y = -0.5;
    impellerGroup.add(shaft);

    const bladeGeo = new THREE.BoxGeometry(3, 0.2, 0.5);
    const blade1 = new THREE.Mesh(bladeGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0xcccccc }));
    blade1.position.y = -2.5;
    const blade2 = new THREE.Mesh(bladeGeo, materials.steel || new THREE.MeshStandardMaterial({ color: 0xcccccc }));
    blade2.position.y = -2.5;
    blade2.rotation.y = Math.PI / 2;
    impellerGroup.add(blade1);
    impellerGroup.add(blade2);
    group.add(impellerGroup);

    // Animation: Impeller spinning, froth bubbling
    const times = [0, 1, 2];
    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 2, 0));
    const impellerTrack = new THREE.QuaternionKeyframeTrack('Impeller.quaternion', times, [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w
    ]);

    const frothTimes = [0, 0.5, 1, 1.5, 2];
    const frothTrack = new THREE.VectorKeyframeTrack('FrothLayer.position', frothTimes, [
        0, 2.8, 0,
        0, 3.0, 0,
        0, 2.8, 0,
        0, 3.0, 0,
        0, 2.8, 0
    ]);

    const clip = new THREE.AnimationClip('Float', 2, [impellerTrack, frothTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
