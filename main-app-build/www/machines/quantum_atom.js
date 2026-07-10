import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. The Nucleus (Protons & Neutrons) ---
    const nucleusGroup = new THREE.Group();
    const nucleonGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const protonMat = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.1, roughness: 0.8 });
    const neutronMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.1, roughness: 0.8 });

    // Build a carbon-like nucleus (6 protons, 6 neutrons)
    const nucleons = [];
    for(let i=0; i<12; i++){
        const isProton = i % 2 === 0;
        const nucleon = new THREE.Mesh(nucleonGeo, isProton ? protonMat : neutronMat);
        
        // Pack them tightly
        nucleon.position.set(
            (Math.random() - 0.5) * 0.8,
            (Math.random() - 0.5) * 0.8,
            (Math.random() - 0.5) * 0.8
        );
        nucleon.userData = { 
            id: isProton ? `proton_${i}` : `neutron_${i}`, 
            name: isProton ? 'Proton' : 'Neutron', 
            description: isProton ? 'Positively charged hadron in the nucleus.' : 'Neutral hadron in the nucleus.' 
        };
        nucleons.push(nucleon);
        nucleusGroup.add(nucleon);
    }
    nucleusGroup.userData = { id: 'nucleus', name: 'Atomic Nucleus', description: 'Contains 99.9% of the atom\'s mass via the strong nuclear force.' };
    group.add(nucleusGroup);

    // --- 2. Quantum Probability Clouds (S and P orbitals) ---
    // Instead of planetary rings, we use hundreds of particles to represent the likelihood of finding an electron.
    const cloudCount = 2000;
    const cloudGeo = new THREE.BufferGeometry();
    const cloudPos = new Float32Array(cloudCount * 3);
    const cloudColors = new Float32Array(cloudCount * 3);

    for(let i=0; i<cloudCount; i++){
        // Spherical 1s and 2s orbitals (inner shell)
        let radius = 2 + Math.random() * 1.5;
        
        // 2p orbital (dumbbell shape) - for outer shell variation
        if (i > 1000) {
            const axis = Math.floor(Math.random() * 3); // x, y, or z dumbbell
            if (axis === 0) {
                cloudPos[i*3] = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random()*2);
                cloudPos[i*3+1] = (Math.random() - 0.5) * 2;
                cloudPos[i*3+2] = (Math.random() - 0.5) * 2;
                cloudColors[i*3] = 0; cloudColors[i*3+1] = 1; cloudColors[i*3+2] = 0.5; // Greenish
            } else if (axis === 1) {
                cloudPos[i*3] = (Math.random() - 0.5) * 2;
                cloudPos[i*3+1] = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random()*2);
                cloudPos[i*3+2] = (Math.random() - 0.5) * 2;
                cloudColors[i*3] = 0; cloudColors[i*3+1] = 0.5; cloudColors[i*3+2] = 1; // Bluish
            } else {
                cloudPos[i*3] = (Math.random() - 0.5) * 2;
                cloudPos[i*3+1] = (Math.random() - 0.5) * 2;
                cloudPos[i*3+2] = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random()*2);
                cloudColors[i*3] = 0.5; cloudColors[i*3+1] = 0; cloudColors[i*3+2] = 1; // Purplish
            }
        } else {
            // S orbital (spherical)
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            cloudPos[i*3] = radius * Math.sin(phi) * Math.cos(theta);
            cloudPos[i*3+1] = radius * Math.sin(phi) * Math.sin(theta);
            cloudPos[i*3+2] = radius * Math.cos(phi);
            cloudColors[i*3] = 0; cloudColors[i*3+1] = 1; cloudColors[i*3+2] = 1; // Cyan
        }
    }

    cloudGeo.setAttribute('position', new THREE.BufferAttribute(cloudPos, 3));
    cloudGeo.setAttribute('color', new THREE.BufferAttribute(cloudColors, 3));

    const cloudMat = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const probabilityCloud = new THREE.Points(cloudGeo, cloudMat);
    probabilityCloud.userData = { id: 'electron_cloud', name: 'Electron Probability Cloud', description: 'According to quantum mechanics, electrons exist in clouds of probability rather than fixed orbits.' };
    group.add(probabilityCloud);

    // --- 3. Flashing Electron Particles ---
    // Representing actual electrons appearing and disappearing in the cloud
    const electronGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const electronMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const activeElectrons = [];
    
    for(let i=0; i<6; i++){
        const e = new THREE.Mesh(electronGeo, electronMat);
        e.visible = false;
        group.add(e);
        activeElectrons.push({ mesh: e, timer: Math.random() });
    }

    // --- 4. Animation Loop ---
    let time = 0;
    group.userData.animate = function(delta) {
        time += delta;

        // Vibrate the nucleus
        nucleusGroup.rotation.x = Math.sin(time * 10) * 0.05;
        nucleusGroup.rotation.y = Math.cos(time * 12) * 0.05;

        // Slowly rotate the probability clouds
        probabilityCloud.rotation.y += delta * 0.2;
        probabilityCloud.rotation.z += delta * 0.1;

        // Flash electrons randomly within the bounds of the clouds
        activeElectrons.forEach(eObj => {
            eObj.timer -= delta;
            if (eObj.timer <= 0) {
                // Pick a random spot from the cloud geometry
                const idx = Math.floor(Math.random() * cloudCount) * 3;
                
                // Account for the cloud's current rotation
                const localPos = new THREE.Vector3(cloudPos[idx], cloudPos[idx+1], cloudPos[idx+2]);
                localPos.applyEuler(probabilityCloud.rotation);

                eObj.mesh.position.copy(localPos);
                eObj.mesh.visible = true;
                eObj.timer = 0.05 + Math.random() * 0.1; // Visible for a tiny fraction of a second
            } else if (eObj.timer < 0.02) {
                eObj.mesh.visible = false;
            }
        });
    };

    return group;
}
