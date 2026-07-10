import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. The Chloroplast (Plant Cell Organelle) ---
    const chloroGeo = new THREE.CapsuleGeometry(2, 2, 16, 32);
    const chloroMat = new THREE.MeshPhysicalMaterial({ 
        color: 0x228b22, transmission: 0.6, opacity: 1, transparent: true, roughness: 0.4, ior: 1.4 
    });
    const chloroplast = new THREE.Mesh(chloroGeo, chloroMat);
    chloroplast.rotation.z = Math.PI / 2;
    chloroplast.userData = { id: 'chloroplast', name: 'Chloroplast', description: 'The organelle where photosynthesis takes place, containing chlorophyll.' };
    group.add(chloroplast);

    // Thylakoid Stacks (Grana) inside
    const thylakoidGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 16);
    const thylakoidMat = new THREE.MeshStandardMaterial({ color: 0x005500, roughness: 0.8 });
    
    for (let stack = -1.5; stack <= 1.5; stack += 1.5) {
        for (let disc = -0.5; disc <= 0.5; disc += 0.2) {
            const t = new THREE.Mesh(thylakoidGeo, thylakoidMat);
            t.position.set(stack, disc, 0);
            t.rotation.x = Math.PI / 2;
            group.add(t);
        }
    }

    // --- 2. Molecules (Inputs & Outputs) ---
    const molecules = new THREE.Group();
    group.add(molecules);

    // Helper to create small molecule meshes
    function createMolecule(type) {
        const m = new THREE.Group();
        const atomGeo = new THREE.SphereGeometry(0.15, 8, 8);
        if (type === 'H2O') {
            const o = new THREE.Mesh(atomGeo, new THREE.MeshBasicMaterial({color: 0xff4444}));
            const h1 = new THREE.Mesh(atomGeo, new THREE.MeshBasicMaterial({color: 0xffffff}));
            const h2 = new THREE.Mesh(atomGeo, new THREE.MeshBasicMaterial({color: 0xffffff}));
            h1.position.set(0.15, 0.15, 0); h2.position.set(-0.15, 0.15, 0);
            m.add(o, h1, h2);
        } else if (type === 'CO2') {
            const c = new THREE.Mesh(atomGeo, new THREE.MeshBasicMaterial({color: 0x444444}));
            const o1 = new THREE.Mesh(atomGeo, new THREE.MeshBasicMaterial({color: 0xff4444}));
            const o2 = new THREE.Mesh(atomGeo, new THREE.MeshBasicMaterial({color: 0xff4444}));
            o1.position.set(0.25, 0, 0); o2.position.set(-0.25, 0, 0);
            m.add(c, o1, o2);
        } else if (type === 'O2') {
            const o1 = new THREE.Mesh(atomGeo, new THREE.MeshBasicMaterial({color: 0xff4444}));
            const o2 = new THREE.Mesh(atomGeo, new THREE.MeshBasicMaterial({color: 0xff4444}));
            o1.position.set(0.1, 0, 0); o2.position.set(-0.1, 0, 0);
            m.add(o1, o2);
        } else if (type === 'Glucose') {
            // Hexagon shape (rough representation of C6H12O6 ring)
            for(let i=0; i<6; i++){
                const c = new THREE.Mesh(atomGeo, new THREE.MeshBasicMaterial({color: 0x444444}));
                const angle = (i/6)*Math.PI*2;
                c.position.set(Math.cos(angle)*0.3, Math.sin(angle)*0.3, 0);
                m.add(c);
                const h = new THREE.Mesh(new THREE.SphereGeometry(0.08,8,8), new THREE.MeshBasicMaterial({color: 0xffffff}));
                h.position.set(Math.cos(angle)*0.5, Math.sin(angle)*0.5, 0.1);
                m.add(h);
            }
        }
        return m;
    }

    const mPool = [];
    for(let i=0; i<15; i++){
        mPool.push({
            type: 'H2O', mesh: createMolecule('H2O'), phase: 0, progress: Math.random()
        });
        mPool.push({
            type: 'CO2', mesh: createMolecule('CO2'), phase: 0, progress: Math.random()
        });
    }

    mPool.forEach(m => molecules.add(m.mesh));

    // --- 3. Photons (Light Energy) ---
    const photonCount = 50;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(photonCount * 3);
    for(let i=0; i<photonCount; i++){
        pPos[i*3] = (Math.random()-0.5)*4;
        pPos[i*3+1] = 4 + Math.random()*4;
        pPos[i*3+2] = (Math.random()-0.5)*2;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xffff00, size: 0.1, blending: THREE.AdditiveBlending, transparent: true });
    const photons = new THREE.Points(pGeo, pMat);
    photons.userData = { id: 'photons', name: 'Light Energy (Photons)', description: 'Powers the endothermic reaction to convert CO2 and H2O into Glucose.' };
    group.add(photons);

    // --- 4. Animation ---
    let time = 0;
    group.userData.animate = function(delta) {
        time += delta;

        // Animate Photons falling
        const pp = photons.geometry.attributes.position.array;
        for(let i=0; i<photonCount; i++){
            pp[i*3+1] -= delta * 3;
            if(pp[i*3+1] < -2) {
                pp[i*3+1] = 4 + Math.random()*2; // Reset to top
            }
        }
        photons.geometry.attributes.position.needsUpdate = true;

        // Pulse the chloroplast slightly (energy absorption)
        chloroplast.scale.setScalar(1.0 + Math.sin(time*2)*0.02);

        // Animate Molecules
        mPool.forEach(m => {
            m.progress += delta * 0.2; // Speed
            
            // Phase 0: Entering (Left side for H2O, Bottom for CO2)
            if (m.phase === 0) {
                if (m.type === 'H2O') {
                    // Enter from left roots
                    m.mesh.position.set(-5 + m.progress*4, -1 + Math.sin(time*2+m.progress*10)*0.5, 0);
                } else {
                    // Enter from bottom stomata
                    m.mesh.position.set(-2 + Math.sin(time+m.progress*10)*0.5, -4 + m.progress*3, 0);
                }

                if (m.progress >= 1.0) {
                    m.phase = 1; // Inside chloroplast, reacting
                    m.progress = 0;
                    // Transformation happens!
                    molecules.remove(m.mesh);
                    if (m.type === 'H2O') {
                        m.type = 'O2';
                        m.mesh = createMolecule('O2');
                    } else {
                        m.type = 'Glucose';
                        m.mesh = createMolecule('Glucose');
                    }
                    molecules.add(m.mesh);
                }
            } 
            // Phase 1: Reacting inside
            else if (m.phase === 1) {
                m.mesh.position.set((Math.random()-0.5)*1.5, (Math.random()-0.5)*1.5, 0);
                m.mesh.rotation.z += delta;
                if (m.progress >= 1.0) {
                    m.phase = 2;
                    m.progress = 0;
                }
            }
            // Phase 2: Exiting
            else if (m.phase === 2) {
                if (m.type === 'O2') {
                    // Exit to bottom (atmosphere)
                    m.mesh.position.set(2 + Math.sin(time)*0.5, -1 - m.progress*3, 0);
                } else {
                    // Exit to right (phloem / rest of plant)
                    m.mesh.position.set(1 + m.progress*4, Math.sin(time+m.progress*5)*0.5, 0);
                }

                if (m.progress >= 1.0) {
                    m.phase = 0; // Reset
                    m.progress = 0;
                    molecules.remove(m.mesh);
                    if (m.type === 'O2') {
                        m.type = 'H2O';
                        m.mesh = createMolecule('H2O');
                    } else {
                        m.type = 'CO2';
                        m.mesh = createMolecule('CO2');
                    }
                    molecules.add(m.mesh);
                }
            }
        });

    };

    return group;
}
