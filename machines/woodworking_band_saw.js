import { steel, iron, wood, redAccent, blackPlastic } from '../utils/materials.js';

export function createBandSaw(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Stand
    const stand = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2, 1.5), iron);
    stand.position.set(0, 1, 0);
    group.add(stand);

    // Lower Cabinet
    const lowerCabinet = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.5, 1.2), redAccent);
    lowerCabinet.position.set(0, 2.75, 0);
    group.add(lowerCabinet);

    // Spine
    const spine = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2, 0.8), redAccent);
    spine.position.set(-0.3, 4.5, -0.2);
    group.add(spine);

    // Upper Cabinet
    const upperCabinet = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.5, 1.2), redAccent);
    upperCabinet.position.set(0, 6.25, 0);
    group.add(upperCabinet);

    // Table
    const table = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 2), steel);
    table.position.set(0.5, 3.8, 0);
    table.rotation.z = -0.1;
    group.add(table);

    // Blade (visible part)
    const bladeGroup = new THREE.Group();
    bladeGroup.name = "bandSawBlade";
    bladeGroup.position.set(0.5, 4.8, 0.4);

    const bladeGeo = new THREE.BoxGeometry(0.02, 1.8, 0.2);
    const blade = new THREE.Mesh(bladeGeo, steel);
    bladeGroup.add(blade);
    group.add(bladeGroup);

    const teethGroup = new THREE.Group();
    teethGroup.name = "teethGroup";
    bladeGroup.add(teethGroup);
    
    for(let i=0; i<10; i++) {
        const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.05), steel);
        tooth.position.set(0, 0.8 - i*0.2, 0.1);
        teethGroup.add(tooth);
    }

    // Animation: Teeth moving down and looping
    const posTimes = [0, 0.1];
    const posValues = [
        0, 0, 0,
        0, -0.2, 0 // move down by spacing amount
    ];
    
    const posTrack = new THREE.VectorKeyframeTrack(
        `${teethGroup.name}.position`,
        posTimes,
        posValues
    );

    const clip = new THREE.AnimationClip('BandSawCut', 0.1, [posTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
