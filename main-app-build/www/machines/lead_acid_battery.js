import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. Battery Casing (Transparent) ---
    const casingGeo = new THREE.BoxGeometry(6, 5, 3);
    const casingMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xffffff, 
        transmission: 0.8, // glass-like
        opacity: 1, 
        transparent: true,
        roughness: 0.1,
        ior: 1.5
    });
    const casing = new THREE.Mesh(casingGeo, casingMat);
    casing.userData = { id: 'casing', name: 'Battery Casing', description: 'Houses the cells and electrolyte solution.' };
    group.add(casing);

    // --- 2. Electrolyte Solution (Sulfuric Acid) ---
    const liquidGeo = new THREE.BoxGeometry(5.8, 3.8, 2.8);
    const liquidMat = new THREE.MeshPhysicalMaterial({ 
        color: 0x00aaff, 
        transmission: 0.6, 
        opacity: 1, 
        transparent: true,
        roughness: 0.2
    });
    const liquid = new THREE.Mesh(liquidGeo, liquidMat);
    liquid.position.y = -0.5;
    liquid.userData = { id: 'electrolyte', name: 'Sulfuric Acid (H2SO4)', description: 'The electrolyte solution that facilitates ion transfer.' };
    group.add(liquid);

    // --- 3. Electrodes (Anode and Cathode) ---
    // Anode (Negative) - Lead (Pb)
    const anodeGeo = new THREE.BoxGeometry(0.5, 3.5, 2);
    const anodeMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.6 });
    const anode = new THREE.Mesh(anodeGeo, anodeMat);
    anode.position.set(-1.5, -0.2, 0);
    anode.userData = { id: 'anode', name: 'Lead Anode (Pb)', description: 'The negative terminal. Oxidizes to release electrons.' };
    group.add(anode);

    // Cathode (Positive) - Lead Dioxide (PbO2)
    const cathodeGeo = new THREE.BoxGeometry(0.5, 3.5, 2);
    const cathodeMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, metalness: 0.3, roughness: 0.9 }); // Brownish
    const cathode = new THREE.Mesh(cathodeGeo, cathodeMat);
    cathode.position.set(1.5, -0.2, 0);
    cathode.userData = { id: 'cathode', name: 'Lead Dioxide Cathode (PbO2)', description: 'The positive terminal. Reduces by gaining electrons.' };
    group.add(cathode);

    // Terminals
    const termGeo = new THREE.CylinderGeometry(0.3, 0.3, 1, 16);
    const negTerm = new THREE.Mesh(termGeo, anodeMat);
    negTerm.position.set(-1.5, 2.5, 0);
    group.add(negTerm);

    const posTerm = new THREE.Mesh(termGeo, cathodeMat);
    posTerm.position.set(1.5, 2.5, 0);
    group.add(posTerm);

    // External Circuit Wire
    const wirePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.5, 3, 0),
        new THREE.Vector3(-1.5, 4, 0),
        new THREE.Vector3(0, 4.5, 0),
        new THREE.Vector3(1.5, 4, 0),
        new THREE.Vector3(1.5, 3, 0)
    ]);
    const wireGeo = new THREE.TubeGeometry(wirePath, 20, 0.05, 8, false);
    const wireMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    group.add(wire);

    // Load (Lightbulb)
    const bulbGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(0, 4.5, 0);
    bulb.userData = { id: 'load', name: 'External Load', description: 'Consumes the electrical energy provided by the battery.' };
    group.add(bulb);

    // --- 4. Particles (Ions in liquid, Electrons in wire) ---
    
    // SO4-- and H+ Ions in the electrolyte
    const ionCount = 150;
    const ionGeo = new THREE.BufferGeometry();
    const ionPos = new Float32Array(ionCount * 3);
    const ionTypes = new Float32Array(ionCount); // 0 for negative (SO4), 1 for positive (H+)
    const ionColors = new Float32Array(ionCount * 3);
    
    for(let i=0; i<ionCount; i++){
        ionPos[i*3] = (Math.random() - 0.5) * 4;
        ionPos[i*3+1] = -2 + Math.random() * 3;
        ionPos[i*3+2] = (Math.random() - 0.5) * 2;
        
        const isPositive = Math.random() > 0.5;
        ionTypes[i] = isPositive ? 1 : 0;
        
        if (isPositive) {
            // H+ (Reddish)
            ionColors[i*3] = 1; ionColors[i*3+1] = 0.2; ionColors[i*3+2] = 0.2;
        } else {
            // SO4-- (Bluish)
            ionColors[i*3] = 0.2; ionColors[i*3+1] = 0.5; ionColors[i*3+2] = 1;
        }
    }
    ionGeo.setAttribute('position', new THREE.BufferAttribute(ionPos, 3));
    ionGeo.setAttribute('color', new THREE.BufferAttribute(ionColors, 3));
    
    const ionMat = new THREE.PointsMaterial({ size: 0.2, vertexColors: true, transparent: true, opacity: 0.8 });
    const ions = new THREE.Points(ionGeo, ionMat);
    ions.userData = { id: 'ions', name: 'Electrolyte Ions', description: 'Sulfate (SO4--) and Hydrogen (H+) ions migrate to balance charge.' };
    group.add(ions);

    // Electrons in the external wire
    const electronCount = 40;
    const electronGeo = new THREE.BufferGeometry();
    const electronPos = new Float32Array(electronCount * 3);
    const eProgress = new Float32Array(electronCount);
    for(let i=0; i<electronCount; i++){
        eProgress[i] = Math.random();
        const pt = wirePath.getPoint(eProgress[i]);
        electronPos[i*3] = pt.x;
        electronPos[i*3+1] = pt.y;
        electronPos[i*3+2] = pt.z;
    }
    electronGeo.setAttribute('position', new THREE.BufferAttribute(electronPos, 3));
    electronGeo.setAttribute('progress', new THREE.BufferAttribute(eProgress, 1));
    const electronMat = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.15, blending: THREE.AdditiveBlending });
    const electrons = new THREE.Points(electronGeo, electronMat);
    electrons.userData = { id: 'electrons', name: 'Electron Flow', description: 'Electrons flow from the negative Anode to the positive Cathode through the external circuit.' };
    group.add(electrons);

    // --- 5. Animation ---
    let time = 0;
    group.userData.animate = function(delta) {
        time += delta;

        // Pulse the lightbulb
        bulbMat.color.setHSL(0.15, 1.0, 0.4 + (Math.sin(time*8)*0.2));

        // Animate Ions in electrolyte
        // During discharge: Negative ions (SO4) move towards Anode (-1.5), Positive ions (H+) move towards Cathode (+1.5)
        const iPos = ions.geometry.attributes.position.array;
        for(let i=0; i<ionCount; i++){
            const isPos = ionTypes[i] === 1;
            const targetX = isPos ? 1.5 : -1.5;
            
            // Move towards target
            const dirX = targetX - iPos[i*3];
            iPos[i*3] += Math.sign(dirX) * delta * 0.3;
            
            // Add some Brownian motion
            iPos[i*3+1] += (Math.random() - 0.5) * delta;
            iPos[i*3+2] += (Math.random() - 0.5) * delta;

            // Keep within liquid bounds
            if (iPos[i*3+1] > 1) iPos[i*3+1] = 1;
            if (iPos[i*3+1] < -2) iPos[i*3+1] = -2;
            
            // If they reach the plate, reset them to the center to keep the flow going
            if (Math.abs(iPos[i*3] - targetX) < 0.3) {
                 iPos[i*3] = (Math.random() - 0.5) * 2;
            }
        }
        ions.geometry.attributes.position.needsUpdate = true;

        // Animate Electrons in wire
        const ePos = electrons.geometry.attributes.position.array;
        const eProg = electrons.geometry.attributes.progress.array;
        for(let i=0; i<electronCount; i++){
            eProg[i] += delta * 0.3;
            if (eProg[i] > 1) eProg[i] = 0;
            const pt = wirePath.getPoint(eProg[i]);
            ePos[i*3] = pt.x;
            ePos[i*3+1] = pt.y;
            ePos[i*3+2] = pt.z;
        }
        electrons.geometry.attributes.position.needsUpdate = true;
        electrons.geometry.attributes.progress.needsUpdate = true;
    };

    return group;
}
