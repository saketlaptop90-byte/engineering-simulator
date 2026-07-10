import * as THREE from 'three';

export function createMachine(scene) {
    const group = new THREE.Group();
    

    // Bounding Box (Fluid Container)
    const boxSize = 10;
    const boxGeom = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    const boxMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.1 });
    const box = new THREE.Mesh(boxGeom, boxMat);
    group.add(box);

    // Large Particle (e.g. Pollen grain)
    const pollenGeom = new THREE.SphereGeometry(0.8, 32, 32);
    const pollenMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.8 });
    const pollen = new THREE.Mesh(pollenGeom, pollenMat);
    group.add(pollen);

    // Small Particles (Fluid molecules)
    const numMolecules = 500;
    const molGeom = new THREE.SphereGeometry(0.1, 8, 8);
    const molMat = new THREE.MeshBasicMaterial({ color: 0x4488ff });
    
    // Instanced mesh for performance
    const instancedMols = new THREE.InstancedMesh(molGeom, molMat, numMolecules);
    group.add(instancedMols);

    const molData = [];
    const dummy = new THREE.Object3D();
    const speed = 10;

    for (let i = 0; i < numMolecules; i++) {
        const x = (Math.random() - 0.5) * boxSize;
        const y = (Math.random() - 0.5) * boxSize;
        const z = (Math.random() - 0.5) * boxSize;
        
        // Random velocity vector
        const v = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize().multiplyScalar(speed);
        
        molData.push({ position: new THREE.Vector3(x, y, z), velocity: v });
        
        dummy.position.set(x,y,z);
        dummy.updateMatrix();
        instancedMols.setMatrixAt(i, dummy.matrix);
    }
    
    // Path tracing for pollen
    const pathMat = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 });
    const pathPoints = [pollen.position.clone()];
    const pathGeom = new THREE.BufferGeometry().setFromPoints(pathPoints);
    const pathLine = new THREE.Line(pathGeom, pathMat);
    group.add(pathLine);

    // Labels
    const createLabel = (text, pos, color) => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(text, 128, 40);
        
        const tex = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.copy(pos);
        sprite.scale.set(2, 0.5, 1);
        group.add(sprite);
    };

    createLabel("Pollen Grain", new THREE.Vector3(0, 6, 0), "#ffaa00");
    createLabel("Fluid Molecules", new THREE.Vector3(5, 5, 0), "#4488ff");

    // Physics state for pollen
    const pollenVel = new THREE.Vector3(0,0,0);
    const pollenMass = 50; // Much heavier than molecules

    group.userData.animate = (delta) => {
        // Update molecules
        for (let i = 0; i < numMolecules; i++) {
            const mol = molData[i];
            
            mol.position.addScaledVector(mol.velocity, delta);
            
            // Wall collisions for molecules
            const halfBox = boxSize / 2 - 0.1;
            if (Math.abs(mol.position.x) > halfBox) { mol.velocity.x *= -1; mol.position.x = Math.sign(mol.position.x) * halfBox; }
            if (Math.abs(mol.position.y) > halfBox) { mol.velocity.y *= -1; mol.position.y = Math.sign(mol.position.y) * halfBox; }
            if (Math.abs(mol.position.z) > halfBox) { mol.velocity.z *= -1; mol.position.z = Math.sign(mol.position.z) * halfBox; }
            
            // Collision with pollen
            const dist = mol.position.distanceTo(pollen.position);
            if (dist < 0.9) { // 0.8 (pollen) + 0.1 (mol)
                // Normal vector
                const normal = mol.position.clone().sub(pollen.position).normalize();
                
                // Reflect molecule
                mol.velocity.reflect(normal);
                
                // Transfer momentum to pollen (simplified inelastic bump)
                const impulse = normal.multiplyScalar(-1 * mol.velocity.length() / pollenMass);
                pollenVel.add(impulse);
            }

            dummy.position.copy(mol.position);
            dummy.updateMatrix();
            instancedMols.setMatrixAt(i, dummy.matrix);
        }
        instancedMols.instanceMatrix.needsUpdate = true;

        // Update pollen
        pollen.position.addScaledVector(pollenVel, delta);
        // Friction / drag
        pollenVel.multiplyScalar(0.99);

        // Wall collisions for pollen
        const halfBoxP = boxSize / 2 - 0.8;
        if (Math.abs(pollen.position.x) > halfBoxP) { pollenVel.x *= -0.5; pollen.position.x = Math.sign(pollen.position.x) * halfBoxP; }
        if (Math.abs(pollen.position.y) > halfBoxP) { pollenVel.y *= -0.5; pollen.position.y = Math.sign(pollen.position.y) * halfBoxP; }
        if (Math.abs(pollen.position.z) > halfBoxP) { pollenVel.z *= -0.5; pollen.position.z = Math.sign(pollen.position.z) * halfBoxP; }

        // Update path tracing
        if (pollenVel.length() > 0.05) { // Only record if moved significantly
            pathPoints.push(pollen.position.clone());
            if (pathPoints.length > 50) pathPoints.shift(); // keep tail short
            pathGeom.setFromPoints(pathPoints);
        }
    };

    return group;
}
