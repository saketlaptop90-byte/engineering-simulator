import { metals, fluids } from '../utils/materials.js';

export function createMagnetorheologicalDamper(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Outer cylinder (housing)
    const housingGeo = new THREE.CylinderGeometry(1, 1, 4, 32);
    const housingMat = metals ? metals.steel : new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.7, transparent: true, opacity: 0.5 });
    const housing = new THREE.Mesh(housingGeo, housingMat);
    group.add(housing);

    // Piston rod
    const rodGeo = new THREE.CylinderGeometry(0.2, 0.2, 6, 16);
    const rodMat = metals ? metals.chrome : new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.1 });
    const rod = new THREE.Mesh(rodGeo, rodMat);
    rod.position.y = 2;
    rod.name = 'pistonRod';
    group.add(rod);

    // Piston head
    const headGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.5, 32);
    const headMat = metals ? metals.steel : new THREE.MeshStandardMaterial({ color: 0x444444 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = -2;
    rod.add(head); // Add to rod so it moves with it

    // MR Fluid
    const fluidGeo = new THREE.CylinderGeometry(0.95, 0.95, 3.8, 32);
    const fluidMat = fluids ? fluids.mrFluid : new THREE.MeshStandardMaterial({ color: 0x111111, transparent: true, opacity: 0.8 });
    const fluid = new THREE.Mesh(fluidGeo, fluidMat);
    fluid.name = 'mrFluid';
    group.add(fluid);

    // Electromagnetic coil (around the middle)
    const coilGeo = new THREE.TorusGeometry(1.05, 0.1, 16, 64);
    const coilMat = metals ? metals.copper : new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.8 });
    const coil = new THREE.Mesh(coilGeo, coilMat);
    coil.scale.set(1, 1, 4); // Stretch it to look like a long coil
    coil.name = 'coil';
    group.add(coil);

    // Animation: Piston moving up and down, MR fluid changing opacity/color when magnetic field turns on
    const rodMotionTrack = new THREE.VectorKeyframeTrack(
        'pistonRod.position',
        [0, 1, 2, 3, 4],
        [0, 2, 0,  0, 1, 0,  0, 2, 0,  0, 3, 0,  0, 2, 0]
    );
    // Coil glows red when active
    const coilColorTrack = new THREE.ColorKeyframeTrack(
        'coil.material.color',
        [0, 1, 2, 3, 4],
        [0.7, 0.4, 0.2,  1, 0, 0,  0.7, 0.4, 0.2,  1, 0, 0,  0.7, 0.4, 0.2]
    );
    // Fluid becomes darker and more opaque when field is active
    const fluidOpacityTrack = new THREE.NumberKeyframeTrack(
        'mrFluid.material.opacity',
        [0, 1, 2, 3, 4],
        [0.5, 0.95, 0.5, 0.95, 0.5]
    );

    const clip = new THREE.AnimationClip('DampMotion', 4, [rodMotionTrack, coilColorTrack, fluidOpacityTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
