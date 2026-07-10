import * as materials from '../utils/materials.js';

export function createDesalinationPlant(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(10, 1, 6);
    const baseMat = materials.concreteMaterial || new THREE.MeshStandardMaterial({ color: 0x888888 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    group.add(base);

    // RO Membranes (Cylinders)
    const membraneGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
    const membraneMat = materials.metalMaterial || new THREE.MeshStandardMaterial({ color: 0xdcdcdc });
    
    for (let i = 0; i < 4; i++) {
        const membrane = new THREE.Mesh(membraneGeo, membraneMat);
        membrane.rotation.z = Math.PI / 2;
        membrane.position.set(0, 2 + i * 1.5, 0);
        group.add(membrane);
        
        // Water flow visualizer inside membrane (transparent blue cylinder moving)
        const waterGeo = new THREE.CylinderGeometry(0.55, 0.55, 1, 16);
        const waterMat = materials.waterMaterial || new THREE.MeshStandardMaterial({ color: 0x00aaff, transparent: true, opacity: 0.5 });
        const waterFlow = new THREE.Mesh(waterGeo, waterMat);
        waterFlow.rotation.z = Math.PI / 2;
        waterFlow.position.set(-2, 2 + i * 1.5, 0);
        waterFlow.name = `waterFlow_${i}`;
        group.add(waterFlow);
    }

    // High Pressure Pump
    const pumpGeo = new THREE.BoxGeometry(2, 2, 2);
    const pump = new THREE.Mesh(pumpGeo, materials.paintedMetalMaterial || new THREE.MeshStandardMaterial({ color: 0x336699 }));
    pump.position.set(-4, 1.5, 0);
    group.add(pump);

    // Pipes
    const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 8, 8);
    const pipe = new THREE.Mesh(pipeGeo, materials.pipeMaterial || new THREE.MeshStandardMaterial({ color: 0x555555 }));
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(0, 1, 0);
    group.add(pipe);

    // Animations (Water flowing through membranes)
    for (let i = 0; i < 4; i++) {
        const flowName = `waterFlow_${i}`;
        const yPos = 2 + i * 1.5;
        const track = new THREE.VectorKeyframeTrack(
            `${flowName}.position`,
            [0, 1, 2],
            [-2, yPos, 0, 2, yPos, 0, -2, yPos, 0]
        );
        const clip = new THREE.AnimationClip(`FlowAnimation_${i}`, 2, [track]);
        animationClips.push(clip);
    }

    return { group, animationClips };
}
