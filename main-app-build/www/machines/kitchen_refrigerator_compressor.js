import { aluminum, glass, plastic, redAccent } from '../utils/materials.js';

export function createRefrigeratorCompressor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base/Housing (Cutaway)
    const housingGeo = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI);
    const housingMat = plastic.clone();
    housingMat.side = THREE.DoubleSide;
    const housing = new THREE.Mesh(housingGeo, housingMat);
    housing.position.y = 2;
    group.add(housing);

    // Cylinder block
    const blockGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.5, 16, 1, true, 0, Math.PI);
    const blockMat = aluminum.clone();
    blockMat.side = THREE.DoubleSide;
    const block = new THREE.Mesh(blockGeo, blockMat);
    block.position.set(0, 2, 0);
    block.rotation.z = Math.PI / 2;
    group.add(block);

    // Piston
    const pistonGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.8, 16);
    const piston = new THREE.Mesh(pistonGeo, aluminum);
    piston.name = 'Piston';
    piston.position.set(0, 2, 0);
    piston.rotation.z = Math.PI / 2;
    group.add(piston);

    // Crankshaft
    const crankGeo = new THREE.CylinderGeometry(0.2, 0.2, 2);
    const crank = new THREE.Mesh(crankGeo, aluminum);
    crank.rotation.x = Math.PI / 2;
    crank.position.set(-1.5, 2, 0);
    group.add(crank);

    // Connecting Rod
    const rodGeo = new THREE.BoxGeometry(0.2, 1.5, 0.2);
    const rod = new THREE.Mesh(rodGeo, aluminum);
    rod.name = 'ConnectingRod';
    rod.position.set(-0.75, 2, 0);
    rod.rotation.z = Math.PI / 2;
    group.add(rod);

    // Animation: Piston moving back and forth
    const times = [0, 0.5, 1];
    const posValues = [
        -0.5, 2, 0,
        0.5, 2, 0,
        -0.5, 2, 0
    ];
    const track = new THREE.VectorKeyframeTrack('Piston.position', times, posValues);

    const rodPosValues = [
        -1.0, 2, 0,
        -0.5, 2, 0,
        -1.0, 2, 0
    ];
    const rodTrack = new THREE.VectorKeyframeTrack('ConnectingRod.position', times, rodPosValues);

    const clip = new THREE.AnimationClip('Pump', 1, [track, rodTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
