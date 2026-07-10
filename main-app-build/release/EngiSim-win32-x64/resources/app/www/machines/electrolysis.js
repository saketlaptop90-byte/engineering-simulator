import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. The Beaker & Water ---
    const beakerGeo = new THREE.CylinderGeometry(2, 2, 4, 32, 1, true, 0, Math.PI); // Half beaker
    const beakerMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, side: THREE.DoubleSide });
    const beaker = new THREE.Mesh(beakerGeo, beakerMat);
    group.add(beaker);
    
    // Water volume
    const waterGeo = new THREE.CylinderGeometry(1.95, 1.95, 3.5, 32, 1, true, 0, Math.PI);
    const waterMat = new THREE.MeshPhysicalMaterial({ color: 0x0066aa, transmission: 0.8, opacity: 1, transparent: true, roughness: 0.1, ior: 1.33, side: THREE.DoubleSide });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.y = -0.25;
    group.add(water);

    // --- 2. Electrodes (Anode and Cathode) ---
    const electrodeGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
    
    // Anode (+) Attracts Oxygen
    const anodeMat = new THREE.MeshStandardMaterial({ color: 0xcc2222, metalness: 0.8 });
    const anode = new THREE.Mesh(electrodeGeo, anodeMat);
    anode.position.set(-1, -0.5, 0);
    anode.userData = { id: 'anode', name: 'Anode (Positive +)', description: 'Pulls electrons away from water molecules, releasing Oxygen (O2) gas and Hydrogen ions (H+).' };
    group.add(anode);

    // Cathode (-) Attracts Hydrogen
    const cathodeMat = new THREE.MeshStandardMaterial({ color: 0x2222cc, metalness: 0.8 });
    const cathode = new THREE.Mesh(electrodeGeo, cathodeMat);
    cathode.position.set(1, -0.5, 0);
    cathode.userData = { id: 'cathode', name: 'Cathode (Negative -)', description: 'Supplies electrons to Hydrogen ions (H+), forming Hydrogen (H2) gas.' };
    group.add(cathode);

    // --- 3. Power Source / Battery ---
    const batteryGeo = new THREE.BoxGeometry(1.5, 1, 1);
    const batteryMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const battery = new THREE.Mesh(batteryGeo, batteryMat);
    battery.position.set(0, 3, 0);
    battery.userData = { id: 'battery', name: 'DC Power Source', description: 'Provides the voltage required to overcome the chemical bonds of H2O.' };
    group.add(battery);

    // Wires
    const wireGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const wireRed = new THREE.Mesh(wireGeo, new THREE.MeshStandardMaterial({ color: 0xff0000 }));
    wireRed.position.set(-1, 1.5, 0);
    group.add(wireRed);
    const wireBlack = new THREE.Mesh(wireGeo, new THREE.MeshStandardMaterial({ color: 0x000000 }));
    wireBlack.position.set(1, 1.5, 0);
    group.add(wireBlack);

    // --- 4. Particles (Bubbles & Electrons) ---
    // Electrons flowing through wires
    const eCount = 20;
    const eGeo = new THREE.BufferGeometry();
    const ePos = new Float32Array(eCount * 3);
    for(let i=0; i<eCount; i++){
        ePos[i*3] = (i%2===0) ? -1 : 1; // Left or Right wire
        ePos[i*3+1] = 1.0 + Math.random() * 1.5;
        ePos[i*3+2] = 0;
    }
    eGeo.setAttribute('position', new THREE.BufferAttribute(ePos, 3));
    const eMat = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.15, blending: THREE.AdditiveBlending });
    const electrons = new THREE.Points(eGeo, eMat);
    group.add(electrons);

    // Gas Bubbles (Oxygen at Anode, Hydrogen at Cathode)
    const bCount = 150;
    const bGeo = new THREE.BufferGeometry();
    const bPos = new Float32Array(bCount * 3);
    const bType = new Float32Array(bCount); // 0: Oxygen (Anode/Left), 1: Hydrogen (Cathode/Right)
    const bColor = new Float32Array(bCount * 3);

    for(let i=0; i<bCount; i++){
        // There should be TWICE as much Hydrogen as Oxygen (H2O)
        const isHydrogen = Math.random() < 0.66; 
        
        if (isHydrogen) {
            bType[i] = 1;
            bPos[i*3] = 1 + (Math.random()-0.5)*0.5; // Near Cathode (Right)
            bColor[i*3] = 1.0; bColor[i*3+1] = 1.0; bColor[i*3+2] = 1.0; // White bubbles
        } else {
            bType[i] = 0;
            bPos[i*3] = -1 + (Math.random()-0.5)*0.5; // Near Anode (Left)
            bColor[i*3] = 1.0; bColor[i*3+1] = 0.5; bColor[i*3+2] = 0.5; // Reddish bubbles for Oxygen
        }
        bPos[i*3+1] = -2 + Math.random() * 3.5; // Depth in water
        bPos[i*3+2] = (Math.random()-0.5)*0.5;
    }

    bGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3));
    bGeo.setAttribute('color', new THREE.BufferAttribute(bColor, 3));
    const bMat = new THREE.PointsMaterial({ size: 0.1, vertexColors: true, transparent: true, opacity: 0.8 });
    const bubbles = new THREE.Points(bGeo, bMat);
    bubbles.userData = { id: 'gas_bubbles', name: 'Gas Evolution', description: 'Notice there is exactly twice as much Hydrogen gas produced at the cathode as Oxygen at the anode (H2O)!' };
    group.add(bubbles);

    // --- 5. Animation ---
    group.userData.animate = function(delta) {
        // Animate Electrons (Anode -> Battery -> Cathode)
        const ep = electrons.geometry.attributes.position.array;
        for(let i=0; i<eCount; i++){
            if (ep[i*3] < 0) {
                // Left wire (Anode to Battery, UP)
                ep[i*3+1] += delta * 2;
                if (ep[i*3+1] > 2.5) ep[i*3+1] = 0.5;
            } else {
                // Right wire (Battery to Cathode, DOWN)
                ep[i*3+1] -= delta * 2;
                if (ep[i*3+1] < 0.5) ep[i*3+1] = 2.5;
            }
        }
        electrons.geometry.attributes.position.needsUpdate = true;

        // Animate Bubbles (Rising)
        const bp = bubbles.geometry.attributes.position.array;
        for(let i=0; i<bCount; i++){
            // Hydrogen rises slightly faster because it's lighter
            const speed = (bType[i] === 1) ? 1.5 : 1.2;
            bp[i*3+1] += delta * speed;
            bp[i*3] += (Math.random()-0.5)*0.02; // Wiggle X
            bp[i*3+2] += (Math.random()-0.5)*0.02; // Wiggle Z

            // If hits surface, pop and respawn at bottom of electrode
            if (bp[i*3+1] > 1.5) {
                bp[i*3+1] = -2;
                bp[i*3] = (bType[i] === 1 ? 1 : -1) + (Math.random()-0.5)*0.4;
            }
        }
        bubbles.geometry.attributes.position.needsUpdate = true;
    };

    return group;
}
