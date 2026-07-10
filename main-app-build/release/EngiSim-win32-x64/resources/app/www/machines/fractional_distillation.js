import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. Distillation Column ---
    const colGroup = new THREE.Group();
    colGroup.position.set(0, -3, 0);
    group.add(colGroup);

    // Main Tower (Transparent to see trays/vapors)
    const towerGeo = new THREE.CylinderGeometry(2, 2, 8, 32);
    const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xcccccc, transmission: 0.8, opacity: 1, transparent: true, roughness: 0.1, side: THREE.DoubleSide
    });
    const tower = new THREE.Mesh(towerGeo, glassMat);
    tower.position.set(0, 4, 0);
    colGroup.add(tower);

    tower.userData = { id: 'distillation_tower', name: 'Fractionating Column', description: 'Crude oil is heated and enters the column as vapor. The column is hot at the bottom and cooler at the top, causing different hydrocarbons to condense at different heights.' };

    // Trays / Bubble caps
    const numTrays = 4;
    const trayGeo = new THREE.CylinderGeometry(1.9, 1.9, 0.1, 32);
    const trayMat = new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.8 });
    
    // Output Pipes & Labels
    const fractions = [
        { height: 1, color: 0x222222, label: 'Residue (Bitumen)' },
        { height: 3, color: 0x554422, label: 'Diesel / Fuel Oil' },
        { height: 5, color: 0x888833, label: 'Kerosene' },
        { height: 7, color: 0xdddd88, label: 'Petrol (Gasoline)' },
        { height: 8.5, color: 0xeeeeee, label: 'Refinery Gases' } // Top exit
    ];

    for(let i=0; i<numTrays; i++) {
        const tray = new THREE.Mesh(trayGeo, trayMat);
        const yPos = 2 + (i * 1.5);
        tray.position.set(0, yPos, 0);
        colGroup.add(tray);
    }

    // Output pipes
    fractions.forEach(frac => {
        if (frac.height > 8) return; // Top gas pipe handled separately
        const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
        const pipe = new THREE.Mesh(pipeGeo, trayMat);
        pipe.rotation.z = Math.PI/2;
        pipe.position.set(2.5, frac.height, 0);
        colGroup.add(pipe);

        // A small liquid drop indicating color of fraction
        const dropGeo = new THREE.SphereGeometry(0.3, 16, 16);
        const dropMat = new THREE.MeshStandardMaterial({ color: frac.color });
        const drop = new THREE.Mesh(dropGeo, dropMat);
        drop.position.set(4, frac.height, 0);
        drop.userData = { id: 'frac_' + frac.height, name: frac.label, description: 'Condenses at this level based on its boiling point.' };
        colGroup.add(drop);
    });

    // Top Gas Pipe
    const topPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2), trayMat);
    topPipe.position.set(0, 9, 0);
    colGroup.add(topPipe);
    
    const topDrop = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshStandardMaterial({ color: 0xeeeeee, transparent: true, opacity: 0.5 }));
    topDrop.position.set(0, 10.5, 0);
    topDrop.userData = { id: 'frac_gas', name: 'Refinery Gases', description: 'Lowest boiling point hydrocarbons (methane, ethane) do not condense and exit as gas.' };
    colGroup.add(topDrop);

    // --- 2. Furnace & Inlet ---
    const furnaceGroup = new THREE.Group();
    furnaceGroup.position.set(-5, 0, 0);
    colGroup.add(furnaceGroup);

    const furnaceBody = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshStandardMaterial({ color: 0x555555 }));
    furnaceGroup.add(furnaceBody);

    const fire = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 2), new THREE.MeshBasicMaterial({ color: 0xff4400 }));
    fire.position.set(0, -0.8, 0);
    furnaceGroup.add(fire);
    
    furnaceBody.userData = { id: 'furnace', name: 'Furnace', description: 'Heats crude oil to ~400°C, turning most of it into a mixture of vapors.' };

    // Inlet Pipe (Crude oil to tower)
    const inletGeo = new THREE.CylinderGeometry(0.3, 0.3, 3);
    const inlet = new THREE.Mesh(inletGeo, trayMat);
    inlet.rotation.z = Math.PI/2;
    inlet.position.set(-2, 1, 0);
    colGroup.add(inlet);


    // --- 3. Vapors (Particles) ---
    const pCount = 300;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pData = []; // Store target height for each particle based on fraction

    for(let i=0; i<pCount; i++) {
        pPos[i*3] = -5; // Start in furnace
        pPos[i*3+1] = 0;
        pPos[i*3+2] = (Math.random()-0.5)*1.5;

        // Assign a random target height (condensation point)
        const type = Math.floor(Math.random() * fractions.length);
        pData.push({
            type: type,
            targetY: fractions[type].height,
            color: new THREE.Color(fractions[type].color),
            state: 'heating' // heating -> rising -> condensing -> exiting
        });
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    
    // We need vertex colors
    const pColors = new Float32Array(pCount * 3);
    for(let i=0; i<pCount; i++) {
        pColors[i*3] = pData[i].color.r;
        pColors[i*3+1] = pData[i].color.g;
        pColors[i*3+2] = pData[i].color.b;
    }
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({ size: 0.3, vertexColors: true, transparent: true, opacity: 0.8 });
    const particles = new THREE.Points(pGeo, pMat);
    colGroup.add(particles);

    // --- 4. Animation ---
    group.userData.animate = function(delta) {
        const positions = particles.geometry.attributes.position.array;
        const speed = 2.0;

        for(let i=0; i<pCount; i++) {
            const data = pData[i];
            let x = positions[i*3];
            let y = positions[i*3+1];
            let z = positions[i*3+2];

            if (data.state === 'heating') {
                // Move from furnace to tower via inlet pipe
                if (x < 0) {
                    x += speed * delta;
                    y = 1 + (Math.random()-0.5)*0.2; // wobble in pipe
                } else {
                    data.state = 'rising';
                }
            } else if (data.state === 'rising') {
                // Rise up the tower
                if (y < data.targetY) {
                    y += speed * delta;
                    x = (Math.random()-0.5)*1.8; // random x within tower
                    z = (Math.random()-0.5)*1.8;
                } else {
                    data.state = 'condensing';
                }
            } else if (data.state === 'condensing') {
                // Move out through the output pipe
                if (data.targetY > 8) {
                    // Top gas exits upwards
                    y += speed * delta;
                    x = (Math.random()-0.5)*0.2;
                    if (y > 10.5) data.state = 'reset';
                } else {
                    // Side pipe
                    x += speed * delta;
                    y = data.targetY + (Math.random()-0.5)*0.1;
                    z = (Math.random()-0.5)*0.1;
                    if (x > 4) data.state = 'reset';
                }
            } else if (data.state === 'reset') {
                x = -5;
                y = 0;
                z = (Math.random()-0.5)*1.5;
                data.state = 'heating';
            }

            positions[i*3] = x;
            positions[i*3+1] = y;
            positions[i*3+2] = z;
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
        
        // Flicker furnace fire
        fire.scale.y = 1.0 + Math.random() * 0.2;
    };

    return group;
}

// Auto-generated missing stub
export function createFractionalDistillation() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
