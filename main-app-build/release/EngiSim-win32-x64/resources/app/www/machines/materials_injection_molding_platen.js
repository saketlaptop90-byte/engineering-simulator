import { materials } from '../utils/materials.js';

export function createInjectionMoldingPlaten(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const metalMat = materials.metal || new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.8, roughness: 0.4 });
    const plasticMat = materials.plastic || new THREE.MeshStandardMaterial({ color: 0xff4400, roughness: 0.5 });

    const fixedPlatenGeo = new THREE.BoxGeometry(2, 3, 0.5);
    const fixedPlaten = new THREE.Mesh(fixedPlatenGeo, metalMat);
    fixedPlaten.position.set(-1.5, 0, 0);
    group.add(fixedPlaten);

    const movingPlatenGeo = new THREE.BoxGeometry(2, 3, 0.5);
    const movingPlaten = new THREE.Mesh(movingPlatenGeo, metalMat);
    movingPlaten.position.set(1.5, 0, 0);
    group.add(movingPlaten);

    const tieBarGeo = new THREE.CylinderGeometry(0.1, 0.1, 4);
    for(let i=0; i<4; i++) {
        const tieBar = new THREE.Mesh(tieBarGeo, metalMat);
        tieBar.rotation.z = Math.PI / 2;
        tieBar.position.set(0, (i%2==0?1:-1)*1.2, (i<2?1:-1)*0.2);
        group.add(tieBar);
    }

    // Mold halves
    const moldHalfGeo = new THREE.BoxGeometry(1.5, 2, 0.5);
    const fixedMold = new THREE.Mesh(moldHalfGeo, metalMat);
    fixedMold.position.set(-1, 0, 0);
    group.add(fixedMold);

    const movingMold = new THREE.Mesh(moldHalfGeo, metalMat);
    movingMold.position.set(-0.25, 0, 0); // closed position
    movingPlaten.add(movingMold);

    // Animation: Platens closing and opening
    const trackName = movingPlaten.uuid + '.position';
    const times = [0, 1, 2, 3, 4];
    const values = [
        1.5, 0, 0,  // Open
        0.5, 0, 0,  // Closed
        0.5, 0, 0,  // Hold
        1.5, 0, 0,  // Open
        1.5, 0, 0   // Wait
    ];
    const platenKF = new THREE.VectorKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('CloseOpen', 4, [platenKF]);
    animationClips.push(clip);

    return { group, animationClips };
}
