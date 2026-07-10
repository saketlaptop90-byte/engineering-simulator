import { copper, gold, darkSteel, aluminum } from '../utils/materials.js';

export function createDilutionFridge(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base plate
    const baseGeometry = new THREE.CylinderGeometry(2, 2, 0.5, 32);
    const baseMesh = new THREE.Mesh(baseGeometry, gold);
    group.add(baseMesh);

    // Stages (Plates)
    const plateCount = 5;
    const plateRadii = [1.8, 1.5, 1.2, 0.9, 0.6];
    const plateHeights = [-2, -4, -6, -8, -10];
    
    for (let i = 0; i < plateCount; i++) {
        const plateGeo = new THREE.CylinderGeometry(plateRadii[i], plateRadii[i], 0.2, 32);
        const plateMesh = new THREE.Mesh(plateGeo, copper);
        plateMesh.position.y = plateHeights[i];
        group.add(plateMesh);
        
        // Add supports between plates
        if (i > 0) {
            for (let j = 0; j < 3; j++) {
                const angle = (j / 3) * Math.PI * 2;
                const supportGeo = new THREE.CylinderGeometry(0.05, 0.05, Math.abs(plateHeights[i] - plateHeights[i-1]), 8);
                const supportMesh = new THREE.Mesh(supportGeo, darkSteel);
                supportMesh.position.set(
                    Math.cos(angle) * (plateRadii[i] - 0.2),
                    (plateHeights[i] + plateHeights[i-1]) / 2,
                    Math.sin(angle) * (plateRadii[i] - 0.2)
                );
                group.add(supportMesh);
            }
        }
    }

    // Cooling cycles glowing
    const glowGeo = new THREE.CylinderGeometry(0.5, 0.5, 10, 16);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.3 });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.position.y = -5;
    glowMesh.name = 'CoolingGlow';
    group.add(glowMesh);

    // Animation: Pulse opacity of glowMesh
    const times = [0, 1, 2];
    const values = [0.1, 0.6, 0.1];
    const opacityTrack = new THREE.NumberKeyframeTrack(`${glowMesh.name}.material.opacity`, times, values);
    const clip = new THREE.AnimationClip('CoolingPulse', 2, [opacityTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
