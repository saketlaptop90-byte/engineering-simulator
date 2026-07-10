import * as THREE from 'three';

export function createLithiumDensity(scene, renderer, camera) {
    const group = new THREE.Group();

    // Create a tank of water/oil
    // Lithium is extremely light (0.534 g/cm3), so it floats on water and even oil.
    
    // Tank glass
    const tankGeo = new THREE.BoxGeometry(8, 12, 8);
    const tankMat = new THREE.MeshPhysicalMaterial({
        color: 0xeeeeee,
        transparent: true,
        opacity: 0.1,
        roughness: 0,
        transmission: 0.9,
        ior: 1.5,
        side: THREE.BackSide
    });
    const tank = new THREE.Mesh(tankGeo, tankMat);
    group.add(tank);
    
    // Edges of tank
    const edges = new THREE.EdgesGeometry(tankGeo);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x444444 });
    const tankEdges = new THREE.LineSegments(edges, lineMat);
    group.add(tankEdges);

    // Liquid (Mineral Oil - where Li is stored)
    const liquidGeo = new THREE.BoxGeometry(7.8, 8, 7.8);
    const liquidMat = new THREE.MeshPhysicalMaterial({
        color: 0xeeddcc, // yellowish oil
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        transmission: 0.8,
        ior: 1.4
    });
    const liquid = new THREE.Mesh(liquidGeo, liquidMat);
    liquid.position.y = -2;
    group.add(liquid);
    
    // Liquid surface animation geometry
    const surfaceGeo = new THREE.PlaneGeometry(7.8, 7.8, 32, 32);
    surfaceGeo.rotateX(-Math.PI / 2);
    const surfaceMat = new THREE.MeshPhysicalMaterial({
        color: 0xeeddcc,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.5
    });
    const surface = new THREE.Mesh(surfaceGeo, surfaceMat);
    surface.position.y = 2;
    group.add(surface);

    // Lithium chunk
    // Use an Icosahedron with displacement to look like a rough metallic chunk
    const liGeo = new THREE.IcosahedronGeometry(1.5, 4);
    const pos = liGeo.attributes.position;
    const originalPos = new Float32Array(pos.count * 3);
    for(let i=0; i<pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);
        originalPos[i*3] = x;
        originalPos[i*3+1] = y;
        originalPos[i*3+2] = z;
        
        // Roughness
        const noise = 1 + (Math.random() - 0.5) * 0.2;
        pos.setXYZ(i, x * noise, y * noise, z * noise);
    }
    liGeo.computeVertexNormals();
    
    const liMat = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.9,
        roughness: 0.5,
        flatShading: true
    });
    const lithium = new THREE.Mesh(liGeo, liMat);
    
    // It floats HIGH on the oil (density 0.53 vs oil ~0.8)
    lithium.position.y = 2.2; 
    group.add(lithium);

    // Compare with a heavy metal chunk (e.g. Lead, sinks to bottom)
    const pbGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const pbMat = new THREE.MeshStandardMaterial({
        color: 0x444455,
        metalness: 0.7,
        roughness: 0.6
    });
    const lead = new THREE.Mesh(pbGeo, pbMat);
    lead.position.set(-2, -5.2, -2); // at bottom
    group.add(lead);

    // Bubbles
    const bubbleGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const bubbleMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
        transmission: 1.0,
        ior: 1.1
    });
    
    const bubbles = new THREE.InstancedMesh(bubbleGeo, bubbleMat, 50);
    const dummy = new THREE.Object3D();
    for(let i=0; i<50; i++) {
        dummy.position.set(
            (Math.random() - 0.5) * 6,
            -5 + Math.random() * 7,
            (Math.random() - 0.5) * 6
        );
        dummy.scale.setScalar(Math.random() * 0.5 + 0.5);
        dummy.updateMatrix();
        bubbles.setMatrixAt(i, dummy.matrix);
    }
    group.add(bubbles);

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(5, 10, 7);
    group.add(light);
    group.add(new THREE.AmbientLight(0xffffff, 0.5));

    let time = 0;

    return {
        update: () => {
            time += 0.02;
            
            // Gently rotate scene
            group.rotation.y = Math.sin(time * 0.2) * 0.2;
            
            // Bobbing motion for floating Lithium
            lithium.position.y = 2.2 + Math.sin(time * 2) * 0.1;
            lithium.rotation.x = Math.sin(time) * 0.05;
            lithium.rotation.z = Math.cos(time * 1.3) * 0.05;
            
            // Animate liquid surface waves
            const sPos = surface.geometry.attributes.position;
            for(let i=0; i<sPos.count; i++) {
                const x = sPos.getX(i);
                const z = sPos.getZ(i);
                // Dist wave around lithium
                const dist = Math.sqrt(x*x + z*z);
                const y = Math.sin(dist * 3 - time * 3) * 0.05 * Math.max(0, 1 - dist/5);
                sPos.setY(i, y);
            }
            surface.geometry.computeVertexNormals();
            surface.geometry.attributes.position.needsUpdate = true;
            
            // Animate bubbles up
            for(let i=0; i<50; i++) {
                bubbles.getMatrixAt(i, dummy.matrix);
                dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
                dummy.position.y += 0.05 * dummy.scale.x;
                if (dummy.position.y > 2) {
                    dummy.position.y = -5.8;
                    dummy.position.x = (Math.random() - 0.5) * 6;
                    dummy.position.z = (Math.random() - 0.5) * 6;
                }
                dummy.updateMatrix();
                bubbles.setMatrixAt(i, dummy.matrix);
            }
            bubbles.instanceMatrix.needsUpdate = true;
        },
        cleanup: () => {
            tankGeo.dispose();
            tankMat.dispose();
            liquidGeo.dispose();
            liquidMat.dispose();
            surfaceGeo.dispose();
            surfaceMat.dispose();
            liGeo.dispose();
            liMat.dispose();
            pbGeo.dispose();
            pbMat.dispose();
            bubbleGeo.dispose();
            bubbleMat.dispose();
            lineMat.dispose();
            edges.dispose();
        }
    };
}