import { getMaterials } from '../utils/materials.js';

export function createSupercriticalFluidTurbine(THREE) {
    const group = new THREE.Group();
    group.name = "SupercriticalFluidTurbine";

    let materials = {};
    try {
        materials = getMaterials(THREE) || {};
    } catch (e) {
        console.warn("Could not load materials, using fallbacks.", e);
    }
    
    // Turbine Housing (transparent to see inside)
    const housingGeometry = new THREE.CylinderGeometry(5, 5, 8, 32, 1, true);
    const housingMaterial = materials.housing || new THREE.MeshPhysicalMaterial({ color: 0x99aaff, transmission: 0.9, opacity: 1, metalness: 0, roughness: 0.1, side: THREE.DoubleSide });
    const housing = new THREE.Mesh(housingGeometry, housingMaterial);
    housing.rotation.z = Math.PI / 2;
    group.add(housing);

    // Rotor Shaft
    const rotorGroup = new THREE.Group();
    const shaftGeometry = new THREE.CylinderGeometry(0.8, 0.8, 10, 16);
    const shaftMaterial = materials.metal || new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9 });
    const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
    shaft.rotation.z = Math.PI / 2;
    rotorGroup.add(shaft);

    // Multiple stages of Blades
    const bladeGeometry = new THREE.BoxGeometry(0.1, 4, 1.5);
    const bladeMaterial = materials.blade || new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.2 });
    
    const stages = 3;
    const bladesPerStage = 8;
    
    for (let s = 0; s < stages; s++) {
        const xOffset = (s - 1) * 2.5; // Positions: -2.5, 0, 2.5
        for (let i = 0; i < bladesPerStage; i++) {
            const angle = (i * Math.PI * 2) / bladesPerStage;
            const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
            
            // Orient and position blade
            blade.position.x = xOffset;
            blade.position.y = Math.sin(angle) * 2.5;
            blade.position.z = Math.cos(angle) * 2.5;
            
            // Pitch angle
            blade.rotation.x = angle;
            blade.rotation.y = Math.PI / 4; 
            
            rotorGroup.add(blade);
        }
    }
    
    group.add(rotorGroup);

    // Supercritical fluid effect (particle ring)
    const fluidGeometry = new THREE.TorusGeometry(3.5, 1, 16, 50);
    const fluidMaterial = materials.supercriticalFluid || new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
    const fluid = new THREE.Mesh(fluidGeometry, fluidMaterial);
    fluid.rotation.y = Math.PI / 2;
    group.add(fluid);

    // Animations
    const animationClips = [];
    
    // Spin rotor group
    const spinTrack = new THREE.NumberKeyframeTrack(`${rotorGroup.uuid}.rotation[x]`, [0, 1], [0, Math.PI * 2]);
    animationClips.push(new THREE.AnimationClip('Spin', 1, [spinTrack]));
    
    // Swirl fluid
    const swirlTrack = new THREE.NumberKeyframeTrack(`${fluid.uuid}.rotation[z]`, [0, 2], [0, Math.PI * 2]);
    animationClips.push(new THREE.AnimationClip('FluidSwirl', 2, [swirlTrack]));

    return { group, animationClips };
}
