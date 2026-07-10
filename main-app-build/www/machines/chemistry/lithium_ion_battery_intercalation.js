import * as THREE from 'three';

export function createLithiumIntercalation(scene, renderer, camera) {
    const group = new THREE.Group();

    // Graphite Layers (Cathode/Anode representation)
    const layerMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x333333,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 0.5,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });

    const layers = [];
    for (let i = 0; i < 4; i++) {
        const geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
        // Perturb graphite slightly for realism
        const pos = geometry.attributes.position;
        for(let j=0; j<pos.count; j++) {
            pos.setZ(j, (Math.random() - 0.5) * 0.2);
        }
        geometry.computeVertexNormals();
        const mesh = new THREE.Mesh(geometry, layerMaterial);
        mesh.rotation.x = Math.PI / 2;
        mesh.position.y = (i - 1.5) * 2; // -3, -1, 1, 3
        group.add(mesh);
        layers.push(mesh);
    }

    // Lithium Ions intercalating
    const liGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const liMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff3366, // Hot pink for Lithium ions
        emissive: 0x880022,
        metalness: 0.5,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const numIons = 60;
    const ions = [];
    
    for (let i = 0; i < numIons; i++) {
        const ion = new THREE.Mesh(liGeometry, liMaterial);
        
        // Random starting position within the bounds
        const targetLayer = Math.floor(Math.random() * 3); // 0, 1, 2 space between layers
        const yBase = (targetLayer - 1) * 2; // -2, 0, 2
        
        ion.position.set(
            (Math.random() - 0.5) * 8,
            yBase + (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 8
        );
        
        // Custom properties for animation
        ion.userData = {
            baseY: yBase,
            speed: Math.random() * 0.02 + 0.01,
            phaseX: Math.random() * Math.PI * 2,
            phaseZ: Math.random() * Math.PI * 2,
            radiusX: Math.random() * 0.5,
            radiusZ: Math.random() * 0.5,
            migrating: false,
            migrationProgress: 0,
            migrationTargetY: 0,
            migrationStartY: 0
        };
        
        group.add(ion);
        ions.push(ion);
    }

    // Add glowing energy trails or "electrolyte" particles
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount; i++) {
        positions[i*3] = (Math.random() - 0.5) * 12;
        positions[i*3+1] = (Math.random() - 0.5) * 10;
        positions[i*3+2] = (Math.random() - 0.5) * 12;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.1,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    const electrolyte = new THREE.Points(particleGeo, particleMat);
    group.add(electrolyte);

    // Add ambient and point lights
    const light = new THREE.PointLight(0xffffff, 2, 20);
    light.position.set(0, 5, 0);
    group.add(light);
    
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
    group.add(ambientLight);

    let time = 0;

    return {
        update: () => {
            time += 0.01;
            
            // Gently rotate the entire structure
            group.rotation.y = Math.sin(time * 0.2) * 0.3;
            group.rotation.x = Math.sin(time * 0.1) * 0.1;
            
            // Vibrate graphite layers slightly
            layers.forEach((layer, idx) => {
                layer.position.y = (idx - 1.5) * 2 + Math.sin(time * 2 + idx) * 0.05;
            });

            // Update ions
            ions.forEach((ion, i) => {
                const data = ion.userData;
                
                if (data.migrating) {
                    // Ion is moving between layers
                    data.migrationProgress += 0.02;
                    if (data.migrationProgress >= 1) {
                        data.migrating = false;
                        data.baseY = data.migrationTargetY;
                        ion.position.y = data.baseY;
                    } else {
                        // Smooth interpolation (ease-in-out)
                        const t = data.migrationProgress;
                        const smoothT = t * t * (3 - 2 * t);
                        ion.position.y = data.migrationStartY + (data.migrationTargetY - data.migrationStartY) * smoothT;
                    }
                } else {
                    // Ion is vibrating/diffusing within its current layer
                    ion.position.x += Math.sin(time * 5 + data.phaseX) * 0.01;
                    ion.position.z += Math.cos(time * 5 + data.phaseZ) * 0.01;
                    ion.position.y = data.baseY + Math.sin(time * 10 + i) * 0.05;
                    
                    // Randomly decide to migrate to a different layer (simulating charge/discharge)
                    if (Math.random() < 0.001) {
                        data.migrating = true;
                        data.migrationProgress = 0;
                        data.migrationStartY = data.baseY;
                        // Move up or down one layer if possible
                        const dir = Math.random() > 0.5 ? 2 : -2;
                        let targetY = data.baseY + dir;
                        if (targetY > 2) targetY = -2;
                        if (targetY < -2) targetY = 2;
                        data.migrationTargetY = targetY;
                    }
                }
                
                // Pulse emissive color
                ion.material.emissiveIntensity = 0.5 + Math.sin(time * 3 + i) * 0.5;
            });
            
            // Swirl electrolyte
            electrolyte.rotation.y += 0.002;
            const positions = electrolyte.geometry.attributes.position.array;
            for(let i=0; i<particleCount; i++) {
                positions[i*3+1] += Math.sin(time + positions[i*3]) * 0.01;
            }
            electrolyte.geometry.attributes.position.needsUpdate = true;
        },
        cleanup: () => {
            layerMaterial.dispose();
            liMaterial.dispose();
            liGeometry.dispose();
            particleMat.dispose();
            particleGeo.dispose();
            layers.forEach(l => l.geometry.dispose());
        }
    };
}