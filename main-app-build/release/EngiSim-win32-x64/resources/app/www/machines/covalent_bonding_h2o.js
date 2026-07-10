import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. Nuclei ---
    // Oxygen Nucleus (Red/Blue center)
    const oNucleusGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const oNucleusMat = new THREE.MeshStandardMaterial({ color: 0xff4444, metalness: 0.1, roughness: 0.8 });
    const oNucleus = new THREE.Mesh(oNucleusGeo, oNucleusMat);
    oNucleus.userData = { id: 'oxygen_nucleus', name: 'Oxygen Nucleus (8 Protons)', description: 'Highly electronegative, it wants to gain 2 electrons to complete its octet.' };
    group.add(oNucleus);

    // Hydrogen 1 Nucleus
    const h1NucleusGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const hNucleusMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.8 });
    const h1Nucleus = new THREE.Mesh(h1NucleusGeo, hNucleusMat);
    h1Nucleus.position.set(2, 2, 0); // ~104.5 degree angle for water
    h1Nucleus.userData = { id: 'hydrogen_nucleus_1', name: 'Hydrogen Nucleus (1 Proton)', description: 'Shares its single electron with oxygen.' };
    group.add(h1Nucleus);

    // Hydrogen 2 Nucleus
    const h2Nucleus = new THREE.Mesh(h1NucleusGeo, hNucleusMat);
    h2Nucleus.position.set(-2, 2, 0);
    h2Nucleus.userData = { id: 'hydrogen_nucleus_2', name: 'Hydrogen Nucleus (1 Proton)', description: 'Shares its single electron with oxygen.' };
    group.add(h2Nucleus);


    // --- 2. Probability Clouds (Volumetric approach) ---
    // Instead of drawing orbits, we draw the electron clouds representing the probability of finding electrons.
    // For a covalent bond, the cloud is concentrated between the nuclei.

    const cloudCount = 3000;
    const cloudGeo = new THREE.BufferGeometry();
    const cloudPos = new Float32Array(cloudCount * 3);
    const cloudColors = new Float32Array(cloudCount * 3);

    for(let i=0; i<cloudCount; i++){
        // We divide the particles among the regions:
        // 0-1000: Oxygen core (n=1 inner shell)
        // 1000-2000: O-H1 Bond (covalent shared cloud)
        // 2000-3000: O-H2 Bond (covalent shared cloud)
        
        let x, y, z;
        if (i < 1000) {
            // Oxygen inner shell
            const radius = Math.random() * 1.2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            x = radius * Math.sin(phi) * Math.cos(theta);
            y = radius * Math.sin(phi) * Math.sin(theta);
            z = radius * Math.cos(phi);
            
            cloudColors[i*3] = 0.2; cloudColors[i*3+1] = 0.8; cloudColors[i*3+2] = 1.0;
        } else if (i < 2000) {
            // O-H1 Bond cloud
            // Interpolate between O (0,0,0) and H1 (2,2,0)
            const t = Math.random();
            const spread = (1 - Math.abs(t - 0.5) * 2) * 1.0; // Thicker in the middle of the bond
            x = t * 2 + (Math.random() - 0.5) * spread;
            y = t * 2 + (Math.random() - 0.5) * spread;
            z = (Math.random() - 0.5) * spread;
            
            cloudColors[i*3] = 1.0; cloudColors[i*3+1] = 0.5; cloudColors[i*3+2] = 1.0; // Purple shared
        } else {
            // O-H2 Bond cloud
            // Interpolate between O (0,0,0) and H2 (-2,2,0)
            const t = Math.random();
            const spread = (1 - Math.abs(t - 0.5) * 2) * 1.0;
            x = t * -2 + (Math.random() - 0.5) * spread;
            y = t * 2 + (Math.random() - 0.5) * spread;
            z = (Math.random() - 0.5) * spread;

            cloudColors[i*3] = 1.0; cloudColors[i*3+1] = 0.5; cloudColors[i*3+2] = 1.0; // Purple shared
        }
        
        cloudPos[i*3] = x;
        cloudPos[i*3+1] = y;
        cloudPos[i*3+2] = z;
    }

    cloudGeo.setAttribute('position', new THREE.BufferAttribute(cloudPos, 3));
    cloudGeo.setAttribute('color', new THREE.BufferAttribute(cloudColors, 3));

    const cloudMat = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const probabilityCloud = new THREE.Points(cloudGeo, cloudMat);
    probabilityCloud.userData = { id: 'covalent_cloud', name: 'Covalent Electron Cloud', description: 'Electrons are shared between the atoms, spending most of their time in the region between the nuclei.' };
    group.add(probabilityCloud);

    // --- 3. Flashing Electrons (Quantum Mechanics) ---
    const electronGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const electronMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const activeElectrons = [];
    
    // 10 total electrons in H2O (8 from O, 1 from each H)
    for(let i=0; i<10; i++){
        const e = new THREE.Mesh(electronGeo, electronMat);
        e.visible = false;
        group.add(e);
        activeElectrons.push({ mesh: e, timer: Math.random() });
    }

    // --- 4. Animation ---
    let time = 0;
    group.userData.animate = function(delta) {
        time += delta;

        // Rotate the whole molecule slowly
        group.rotation.y = Math.sin(time * 0.5) * 0.5;
        group.rotation.x = Math.sin(time * 0.3) * 0.2;

        // Vibrate nuclei slightly
        oNucleus.position.y = Math.sin(time * 8) * 0.05;
        h1Nucleus.position.x = 2 + Math.cos(time * 12) * 0.05;
        h2Nucleus.position.x = -2 + Math.sin(time * 11) * 0.05;

        // Flash electrons inside the clouds
        activeElectrons.forEach(eObj => {
            eObj.timer -= delta;
            if (eObj.timer <= 0) {
                // Pick a random spot from the cloud geometry
                const idx = Math.floor(Math.random() * cloudCount) * 3;
                eObj.mesh.position.set(cloudPos[idx], cloudPos[idx+1], cloudPos[idx+2]);
                eObj.mesh.visible = true;
                eObj.timer = 0.05 + Math.random() * 0.1; // Visible briefly
            } else if (eObj.timer < 0.02) {
                eObj.mesh.visible = false;
            }
        });
    };

    return group;
}
