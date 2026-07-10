import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. Beaker / Tank ---
    const tankGeo = new THREE.CylinderGeometry(4, 4, 6, 32, 1, true); // Open top
    const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xaaaaaa,
        transmission: 0.9,
        opacity: 1,
        transparent: true,
        roughness: 0,
        ior: 1.5,
        thickness: 0.2,
        side: THREE.DoubleSide
    });
    const tank = new THREE.Mesh(tankGeo, glassMat);
    tank.position.set(0, 0, 0);
    group.add(tank);

    const tankBottomGeo = new THREE.CylinderGeometry(4, 4, 0.2, 32);
    const tankBottom = new THREE.Mesh(tankBottomGeo, glassMat);
    tankBottom.position.set(0, -3.1, 0);
    group.add(tankBottom);

    // Electrolyte Solution (Copper Sulfate)
    const solutionGeo = new THREE.CylinderGeometry(3.9, 3.9, 5, 32);
    const solutionMat = new THREE.MeshPhysicalMaterial({
        color: 0x0055ff, // Deep blue for CuSO4
        transmission: 0.7,
        opacity: 0.8,
        transparent: true,
        roughness: 0.2,
        depthWrite: false
    });
    const solution = new THREE.Mesh(solutionGeo, solutionMat);
    solution.position.set(0, -0.5, 0);
    group.add(solution);

    solution.userData = { id: 'electrolyte', name: 'Copper(II) Sulfate Solution', description: 'The electrolyte allows ions to move freely between the electrodes. It is blue due to hydrated Cu2+ ions.' };

    // --- 2. Electrodes ---
    // Anode (Impure Copper, Positive)
    const anodeGeo = new THREE.BoxGeometry(1.5, 4, 0.5);
    const anodeMat = new THREE.MeshStandardMaterial({ color: 0xcd7f32, metalness: 0.6, roughness: 0.8 }); // Dull bronze/copper
    const anode = new THREE.Mesh(anodeGeo, anodeMat);
    anode.position.set(-2, 0, 0);
    group.add(anode);

    anode.userData = { id: 'anode', name: 'Anode (+)', description: 'Oxidation occurs here: Cu(s) -> Cu2+(aq) + 2e-. The solid copper dissolves into the solution.' };

    // Cathode (Pure Copper, Negative)
    const cathodeGeo = new THREE.BoxGeometry(0.5, 4, 2); // Thinner initially
    const cathodeMat = new THREE.MeshStandardMaterial({ color: 0xffa07a, metalness: 0.9, roughness: 0.2 }); // Shiny pure copper
    const cathode = new THREE.Mesh(cathodeGeo, cathodeMat);
    cathode.position.set(2, 0, 0);
    group.add(cathode);

    cathode.userData = { id: 'cathode', name: 'Cathode (-)', description: 'Reduction occurs here: Cu2+(aq) + 2e- -> Cu(s). Copper ions from the solution plate onto this electrode, purifying it.' };

    // --- 3. Battery and Wires ---
    const batteryGroup = new THREE.Group();
    batteryGroup.position.set(0, 5, 0);
    group.add(batteryGroup);

    const batBody = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), new THREE.MeshStandardMaterial({color: 0x222222}));
    const batPos = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.2), new THREE.MeshStandardMaterial({color: 0xff0000}));
    batPos.position.set(-0.6, 0.6, 0);
    const batNeg = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.2), new THREE.MeshStandardMaterial({color: 0x000000}));
    batNeg.position.set(0.6, 0.6, 0);
    batteryGroup.add(batBody, batPos, batNeg);

    batteryGroup.userData = { id: 'dc_power', name: 'DC Power Source', description: 'Provides the electromotive force driving the non-spontaneous chemical reaction. It pumps electrons from the anode to the cathode.' };

    // Wires
    const wireMat = new THREE.LineBasicMaterial({ color: 0x555555, linewidth: 2 });
    
    // Wire Anode to Battery
    const ptsLeft = [new THREE.Vector3(-2, 2, 0), new THREE.Vector3(-2, 5.6, 0), new THREE.Vector3(-0.6, 5.6, 0)];
    const wireLeft = new THREE.Line(new THREE.BufferGeometry().setFromPoints(ptsLeft), wireMat);
    group.add(wireLeft);

    // Wire Battery to Cathode
    const ptsRight = [new THREE.Vector3(0.6, 5.6, 0), new THREE.Vector3(2, 5.6, 0), new THREE.Vector3(2, 2, 0)];
    const wireRight = new THREE.Line(new THREE.BufferGeometry().setFromPoints(ptsRight), wireMat);
    group.add(wireRight);

    // --- 4. Moving Particles (Electrons & Ions) ---
    // Electrons flowing through wire (Anode to Cathode)
    const eCount = 20;
    const eGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const eMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const electrons = [];
    for(let i=0; i<eCount; i++) {
        const e = new THREE.Mesh(eGeo, eMat);
        e.position.set(-2, 2, 0); // start at anode top
        e.userData = { progress: i / eCount };
        group.add(e);
        electrons.push(e);
    }

    // Cu2+ Ions moving in solution (Anode to Cathode)
    const iCount = 30;
    const iGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const iMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc }); // bright cyan
    const ions = [];
    for(let i=0; i<iCount; i++) {
        const ion = new THREE.Mesh(iGeo, iMat);
        ion.position.set(-1.25, (Math.random()*4)-2, (Math.random()*2)-1); // start near anode
        ion.userData = { progress: Math.random(), yBase: (Math.random()*4)-2, zBase: (Math.random()*2)-1 };
        group.add(ion);
        ions.push(ion);
    }

    // --- 5. Animation ---
    group.userData.animate = function(delta) {
        const speed = 0.5;

        // Animate Electrons through wire (Path: (-2,2)->(-2,5.6)->(-0.6,5.6) ... battery ... (0.6,5.6)->(2,5.6)->(2,2) )
        electrons.forEach(e => {
            e.userData.progress += delta * speed;
            if (e.userData.progress > 1) e.userData.progress = 0;

            const p = e.userData.progress;
            // Simplify path mapping (0 to 1)
            if (p < 0.2) {
                // Anode straight up
                e.position.set(-2, 2 + (p/0.2)*3.6, 0);
            } else if (p < 0.4) {
                // Over to battery pos
                e.position.set(-2 + ((p-0.2)/0.2)*1.4, 5.6, 0);
            } else if (p < 0.6) {
                // Inside battery (hidden or jump)
                e.position.set(0, 5.6, 0);
                e.visible = false;
            } else if (p < 0.8) {
                // Battery neg to right
                e.visible = true;
                e.position.set(0.6 + ((p-0.6)/0.2)*1.4, 5.6, 0);
            } else {
                // Down to cathode
                e.position.set(2, 5.6 - ((p-0.8)/0.2)*3.6, 0);
            }
        });

        // Animate Cu2+ Ions through solution (-1.25 to 1.75 X)
        ions.forEach(ion => {
            ion.userData.progress += delta * (speed * 0.3);
            if (ion.userData.progress > 1) {
                ion.userData.progress = 0;
                ion.userData.yBase = (Math.random()*4)-2;
                ion.userData.zBase = (Math.random()*2)-1;
            }

            const p = ion.userData.progress;
            const startX = -1.25;
            const endX = 1.75;
            
            // Jitter for brownian motion in solution
            const jitterY = Math.sin(p * Math.PI * 8) * 0.2;
            const jitterZ = Math.cos(p * Math.PI * 7) * 0.2;

            ion.position.set(startX + (endX - startX)*p, ion.userData.yBase + jitterY, ion.userData.zBase + jitterZ);
        });

        // Optional: Anode shrinks, Cathode grows over time (Very slowly)
        // Just oscillate them slightly for visual effect without permanently deforming
        const scaleWave = Math.sin(Date.now() * 0.001) * 0.1;
        anode.scale.x = 1.0 - scaleWave;
        cathode.scale.x = 1.0 + scaleWave;
    };

    return group;
}
