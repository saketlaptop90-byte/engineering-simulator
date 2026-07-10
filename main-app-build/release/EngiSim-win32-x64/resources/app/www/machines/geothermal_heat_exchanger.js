import { getMaterials } from '../utils/materials.js';

export function createDeepBoreholeHeatExchanger(THREE) {
    const group = new THREE.Group();
    group.name = "DeepBoreholeHeatExchanger";

    let materials = {};
    try {
        materials = getMaterials(THREE) || {};
    } catch (e) {
        console.warn("Could not load materials, using fallbacks.", e);
    }
    
    // Outer Casing
    const casingGeometry = new THREE.CylinderGeometry(3, 3, 20, 32, 1, true);
    const casingMaterial = materials.casing || new THREE.MeshStandardMaterial({ color: 0x555555, side: THREE.DoubleSide, metalness: 0.6 });
    const casing = new THREE.Mesh(casingGeometry, casingMaterial);
    group.add(casing);

    // Inner Pipe (Cold water going down)
    const innerPipeGeometry = new THREE.CylinderGeometry(1, 1, 22, 16);
    const innerPipeMaterial = materials.coldPipe || new THREE.MeshStandardMaterial({ color: 0x0088ff, metalness: 0.8 });
    const innerPipe = new THREE.Mesh(innerPipeGeometry, innerPipeMaterial);
    group.add(innerPipe);

    // Outer Annulus Fluid (Hot water coming up)
    const hotWaterGeometry = new THREE.CylinderGeometry(2.8, 2.8, 20, 32, 10, true);
    const hotWaterMaterial = materials.hotWater || new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
    const hotWater = new THREE.Mesh(hotWaterGeometry, hotWaterMaterial);
    group.add(hotWater);

    // Animations
    const animationClips = [];
    
    // We animate the hot water rising and cold water descending using scale or rotation as a pseudo-flow effect.
    // Flow animation (Rotation as substitute for texture offset if maps aren't present)
    const flowTrack = new THREE.NumberKeyframeTrack(`${hotWater.uuid}.rotation[y]`, [0, 2], [0, Math.PI * 2]);
    animationClips.push(new THREE.AnimationClip('Flow', 2, [flowTrack]));

    // Pulsate the inner pipe slightly
    const scaleTrack = new THREE.NumberKeyframeTrack(`${innerPipe.uuid}.scale[x]`, [0, 1, 2], [1, 1.05, 1]);
    const scaleTrackZ = new THREE.NumberKeyframeTrack(`${innerPipe.uuid}.scale[z]`, [0, 1, 2], [1, 1.05, 1]);
    animationClips.push(new THREE.AnimationClip('PressurePulse', 2, [scaleTrack, scaleTrackZ]));

    return { group, animationClips };
}
