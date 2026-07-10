import * as materials from '../utils/materials.js';

export function createPlasmaTorch(THREE) {
    const group = new THREE.Group();

    // Handle
    const handleGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 16);
    const handleMesh = new THREE.Mesh(handleGeo, materials.plasticDark || new THREE.MeshStandardMaterial({ color: 0x111111 }));
    handleMesh.position.y = 0.5;
    group.add(handleMesh);

    // Shield Cup
    const cupGeo = new THREE.CylinderGeometry(0.05, 0.08, 0.2, 16);
    const cupMesh = new THREE.Mesh(cupGeo, materials.ceramic || new THREE.MeshStandardMaterial({ color: 0xffffff }));
    cupMesh.position.y = 0;
    group.add(cupMesh);

    // Plasma Beam
    const beamGeo = new THREE.CylinderGeometry(0.005, 0.01, 0.5, 8);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xaa22ff, transparent: true, opacity: 0.9 });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    // Move origin to top of beam so it extends downward
    beamMesh.position.y = -0.25;
    beamMesh.name = 'plasmaBeam';
    
    const beamGroup = new THREE.Group();
    beamGroup.position.y = -0.1;
    beamGroup.add(beamMesh);
    group.add(beamGroup);

    // Animation: Circular cutting path
    const times = Array.from({length: 41}, (_, i) => i * 0.1); // 4 seconds
    const positions = times.map(t => {
        // First 0.5s move to start
        if (t < 0.5) return [0, 0, 0];
        // 0.5s to 3.5s cut circle
        if (t <= 3.5) {
            const angle = ((t - 0.5) / 3) * Math.PI * 2;
            return [Math.cos(angle) * 0.5 - 0.5, 0, Math.sin(angle) * 0.5];
        }
        // Then return
        return [0, 0, 0];
    }).flat();
    const posTrack = new THREE.VectorKeyframeTrack('.position', times, positions);

    // Beam flicker
    const scales = times.map(t => {
        if (t < 0.5 || t > 3.5) return [1, 0.01, 1]; // Beam off
        return [1 + Math.random()*0.5, 1, 1 + Math.random()*0.5]; // Beam on and flickering
    }).flat();
    const scaleTrack = new THREE.VectorKeyframeTrack(`plasmaBeam.scale`, times, scales);

    const clip = new THREE.AnimationClip('PlasmaCut', 4, [posTrack, scaleTrack]);

    return { group, animationClips: [clip] };
}
