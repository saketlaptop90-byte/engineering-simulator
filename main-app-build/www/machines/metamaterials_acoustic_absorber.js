export function createAcousticAbsorber(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const foamMaterial = new THREE.MeshStandardMaterial({
        color: 0x444455,
        roughness: 0.9,
        metalness: 0.1,
        wireframe: false
    });

    const resonatorMaterial = new THREE.MeshStandardMaterial({
        color: 0x2288cc,
        roughness: 0.5,
        metalness: 0.3
    });

    const baseGeometry = new THREE.BoxGeometry(8, 0.5, 8);
    const base = new THREE.Mesh(baseGeometry, foamMaterial);
    group.add(base);

    // Array of Helmholtz resonators
    const count = 4;
    const spacing = 1.8;
    const resonators = new THREE.Group();

    for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
            const cavity = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.2, 16), foamMaterial);
            cavity.position.y = 0.6;
            
            const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16), resonatorMaterial);
            neck.position.y = 1.45;

            const unit = new THREE.Group();
            unit.add(cavity);
            unit.add(neck);

            unit.position.set(
                (i - count / 2 + 0.5) * spacing,
                0.25,
                (j - count / 2 + 0.5) * spacing
            );
            
            resonators.add(unit);
        }
    }
    group.add(resonators);

    // Animation: simulating pressure waves compressing the resonators
    const times = [0, 1, 2];
    const scaleValues = [
        1, 1, 1,
        1, 0.9, 1,
        1, 1, 1
    ];
    const groupTrack = new THREE.VectorKeyframeTrack('.scale', times, scaleValues);
    const clip = new THREE.AnimationClip('AcousticAbsorption', 2, [groupTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
