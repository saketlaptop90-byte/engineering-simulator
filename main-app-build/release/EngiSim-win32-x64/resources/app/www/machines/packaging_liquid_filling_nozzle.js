import { getMaterials } from '../utils/materials.js';

export function createLiquidFillingNozzleArray(THREE) {
    const group = new THREE.Group();
    const materials = getMaterials(THREE);
    const animationClips = [];

    // Manifold
    const manifoldGeo = new THREE.BoxGeometry(6, 0.5, 1);
    const manifold = new THREE.Mesh(manifoldGeo, materials.steel);
    manifold.position.y = 3;
    manifold.name = 'manifold';
    group.add(manifold);

    const tracks = [];
    const manifoldTimes = [0, 0.5, 1.5, 2];
    const manifoldValues = [0, 3, 0,  0, 2.5, 0,  0, 2.5, 0,  0, 3, 0];
    const manifoldTrack = new THREE.VectorKeyframeTrack('manifold.position', manifoldTimes, manifoldValues);
    tracks.push(manifoldTrack);

    // Nozzles and Streams
    for (let i = 0; i < 4; i++) {
        const xPos = -2.25 + i * 1.5;

        const nozzleGeo = new THREE.CylinderGeometry(0.1, 0.05, 1, 16);
        const nozzle = new THREE.Mesh(nozzleGeo, materials.brass);
        nozzle.position.set(xPos, 2.25, 0);
        nozzle.name = `nozzle_${i}`;
        group.add(nozzle);

        const fluidGeo = new THREE.CylinderGeometry(0.04, 0.04, 2, 8);
        const fluid = new THREE.Mesh(fluidGeo, materials.plastic);
        fluid.position.set(xPos, 1, 0);
        fluid.name = `fluid_${i}`;
        fluid.scale.set(1, 0.01, 1);
        group.add(fluid);

        const fluidTimes = [0, 0.5, 0.6, 1.4, 1.5, 2];
        const fluidScaleValues = [1,0.01,1,  1,0.01,1,  1,1,1,  1,1,1,  1,0.01,1,  1,0.01,1];
        const scaleTrack = new THREE.VectorKeyframeTrack(`fluid_${i}.scale`, fluidTimes, fluidScaleValues);
        tracks.push(scaleTrack);

        const nozzleTimes = [0, 0.5, 1.5, 2];
        const nozzleValues = [xPos, 2.25, 0,  xPos, 1.75, 0,  xPos, 1.75, 0,  xPos, 2.25, 0];
        const nozzleTrack = new THREE.VectorKeyframeTrack(`nozzle_${i}.position`, nozzleTimes, nozzleValues);
        tracks.push(nozzleTrack);
    }

    const fillClip = new THREE.AnimationClip('FillAction', 2, tracks);
    animationClips.push(fillClip);

    return { group, animationClips };
}
