import { materials } from '../utils/materials.js';

export function createCoreMemoryMatrix(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const gridSize = 4;
    const spacing = 1.5;

    // Frames
    const frameGeo = new THREE.BoxGeometry(gridSize * spacing + 1, 0.2, gridSize * spacing + 1);
    const frameMesh = new THREE.Mesh(frameGeo, materials.darkMetal || materials.metallic);
    frameMesh.position.set((gridSize - 1) * spacing / 2, -0.5, (gridSize - 1) * spacing / 2);
    group.add(frameMesh);

    // Wires and Cores
    const coreGeo = new THREE.TorusGeometry(0.2, 0.08, 8, 16);
    
    const wireXGeo = new THREE.CylinderGeometry(0.02, 0.02, gridSize * spacing + 1, 8);
    const wireYGeo = new THREE.CylinderGeometry(0.02, 0.02, gridSize * spacing + 1, 8);
    
    const coreTracks = [];
    const times = [0, 0.5, 1.0, 1.5, 2.0];

    for (let i = 0; i < gridSize; i++) {
        // X Wires
        const wireX = new THREE.Mesh(wireXGeo, materials.copper || materials.metallic);
        wireX.rotation.z = Math.PI / 2;
        wireX.position.set((gridSize - 1) * spacing / 2, 0, i * spacing);
        group.add(wireX);

        // Y Wires
        const wireY = new THREE.Mesh(wireYGeo, materials.copper || materials.metallic);
        wireY.rotation.x = Math.PI / 2;
        wireY.position.set(i * spacing, 0, (gridSize - 1) * spacing / 2);
        group.add(wireY);

        for (let j = 0; j < gridSize; j++) {
            const coreMesh = new THREE.Mesh(coreGeo, materials.darkMetal || materials.metallic);
            coreMesh.position.set(i * spacing, 0, j * spacing);
            // Alternate rotation
            coreMesh.rotation.x = Math.PI / 2;
            coreMesh.rotation.y = Math.PI / 4;
            coreMesh.name = `Core_${i}_${j}`;
            group.add(coreMesh);

            // Animation: random slight rotation or scaling to simulate "flipping" state
            if ((i === 1 && j === 2) || (i === 3 && j === 0)) {
                const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/2, Math.PI/4, 0));
                const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/2, -Math.PI/4, 0));
                
                const qValues = [
                    ...q0.toArray(),
                    ...q1.toArray(),
                    ...q1.toArray(),
                    ...q0.toArray(),
                    ...q0.toArray()
                ];
                const track = new THREE.QuaternionKeyframeTrack(`Core_${i}_${j}.quaternion`, times, qValues);
                coreTracks.push(track);
            }
        }
    }

    if (coreTracks.length > 0) {
        const memoryClip = new THREE.AnimationClip('Memory_Activity', 2, coreTracks);
        animationClips.push(memoryClip);
    }

    return { group, animationClips };
}
