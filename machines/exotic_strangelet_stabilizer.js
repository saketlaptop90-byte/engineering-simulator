import * as materials from '../utils/materials.js';

export function createStrangeletStabilizer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base structure
    const baseGeo = new THREE.CylinderGeometry(8, 8, 2, 32);
    const baseMat = materials.heavyMetal || new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.4 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -5;
    group.add(base);

    // Stabilizer arms
    const armGeo = new THREE.BoxGeometry(1, 10, 1);
    const armMat = materials.conductiveMaterial || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 1.0, roughness: 0.1 });
    
    const arm1 = new THREE.Mesh(armGeo, armMat);
    arm1.position.set(6, 0, 0);
    group.add(arm1);

    const arm2 = new THREE.Mesh(armGeo, armMat);
    arm2.position.set(-6, 0, 0);
    group.add(arm2);

    const arm3 = new THREE.Mesh(armGeo, armMat);
    arm3.position.set(0, 0, 6);
    group.add(arm3);

    const arm4 = new THREE.Mesh(armGeo, armMat);
    arm4.position.set(0, 0, -6);
    group.add(arm4);

    // Strangelet core
    const coreGeo = new THREE.TetrahedronGeometry(3, 2);
    const coreMat = materials.strangeMaterial || new THREE.MeshPhysicalMaterial({ color: 0x00ff00, emissive: 0x004400, clearcoat: 1.0 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Magnetic containment field
    const fieldGeo = new THREE.SphereGeometry(7, 32, 32);
    const fieldMat = materials.energyField || new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.1, wireframe: true });
    const field = new THREE.Mesh(fieldGeo, fieldMat);
    group.add(field);

    // Animations
    const times = [0, 1, 2];
    
    // Core morphing and spinning
    const coreRotTrack = new THREE.VectorKeyframeTrack('.rotation[x]', times, [0, Math.PI, Math.PI * 2]);
    const coreScaleTrack = new THREE.VectorKeyframeTrack('.scale', times, [1, 1, 1, 1.2, 0.8, 1.2, 1, 1, 1]);
    const coreClip = new THREE.AnimationClip('CoreSpin', 2, [coreRotTrack, coreScaleTrack]);
    animationClips.push({ mesh: core, clip: coreClip });

    // Field pulsing
    const fieldScaleTrack = new THREE.VectorKeyframeTrack('.scale', times, [1, 1, 1, 1.05, 1.05, 1.05, 1, 1, 1]);
    const fieldClip = new THREE.AnimationClip('FieldPulse', 2, [fieldScaleTrack]);
    animationClips.push({ mesh: field, clip: fieldClip });

    return { group, animationClips };
}
