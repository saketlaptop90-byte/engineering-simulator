import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. The Dam Structure (Concrete Cross-section) ---
    const damShape = new THREE.Shape();
    damShape.moveTo(0, 0);
    damShape.lineTo(2, 0);
    damShape.lineTo(2, -6);
    damShape.lineTo(-1, -6);
    damShape.lineTo(0, 0);
    
    const extrudeSettings = { depth: 4, bevelEnabled: false };
    const damGeo = new THREE.ExtrudeGeometry(damShape, extrudeSettings);
    const damMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9 });
    const dam = new THREE.Mesh(damGeo, damMat);
    dam.position.set(-1, 2, -2);
    dam.userData = { id: 'dam_wall', name: 'Concrete Dam Wall', description: 'Holds back the massive weight of the reservoir, converting potential energy into kinetic energy.' };
    group.add(dam);

    // --- 2. Water Reservoir (High Potential Energy) ---
    const reservoirGeo = new THREE.BoxGeometry(6, 6, 4);
    const waterMat = new THREE.MeshPhysicalMaterial({ 
        color: 0x0066aa, transmission: 0.8, opacity: 1, transparent: true, roughness: 0.1, ior: 1.33 
    });
    const reservoir = new THREE.Mesh(reservoirGeo, waterMat);
    reservoir.position.set(-4, -1, 0);
    reservoir.userData = { id: 'reservoir', name: 'Reservoir', description: 'Stores water at a high elevation (Potential Energy).' };
    group.add(reservoir);

    // Lower River (After turbine)
    const riverGeo = new THREE.BoxGeometry(5, 1, 4);
    const river = new THREE.Mesh(riverGeo, waterMat);
    river.position.set(3.5, -3.5, 0);
    group.add(river);

    // --- 3. Penstock (Pipe) ---
    const penstockPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1, -2, 0),
        new THREE.Vector3(0.5, -3.5, 0),
        new THREE.Vector3(1.5, -3.5, 0)
    ]);
    const penstockGeo = new THREE.TubeGeometry(penstockPath, 20, 0.4, 16, false);
    const penstockMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.5, transparent: true, opacity: 0.5 }); // Semi-transparent to see water
    const penstock = new THREE.Mesh(penstockGeo, penstockMat);
    penstock.userData = { id: 'penstock', name: 'Penstock', description: 'Channel that guides pressurized water to the turbine.' };
    group.add(penstock);

    // --- 4. Turbine & Generator ---
    const turbineGroup = new THREE.Group();
    turbineGroup.position.set(1.5, -3.5, 0);
    group.add(turbineGroup);

    // Turbine Blades (Francis/Kaplan style)
    const hubGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16);
    const hubMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8 });
    const hub = new THREE.Mesh(hubGeo, hubMat);
    hub.rotation.x = Math.PI / 2;
    turbineGroup.add(hub);

    const bladeGeo = new THREE.BoxGeometry(0.8, 0.05, 0.4);
    for(let i=0; i<6; i++){
        const blade = new THREE.Mesh(bladeGeo, hubMat);
        const pivot = new THREE.Group();
        pivot.rotation.z = (i * Math.PI * 2) / 6;
        blade.position.x = 0.4;
        blade.rotation.x = Math.PI / 4; // Angle to catch water
        pivot.add(blade);
        turbineGroup.add(pivot);
    }
    turbineGroup.userData = { id: 'turbine', name: 'Water Turbine', description: 'Converts kinetic energy of flowing water into mechanical rotational energy.' };

    // Generator Shaft (Going UP)
    const shaftGeo = new THREE.CylinderGeometry(0.1, 0.1, 3.5, 16);
    const shaft = new THREE.Mesh(shaftGeo, hubMat);
    shaft.position.set(1.5, -1.5, 0);
    group.add(shaft);

    // Generator (Top of dam)
    const generatorGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.2, 32);
    const generatorMat = new THREE.MeshStandardMaterial({ color: 0xcc4400, metalness: 0.9, roughness: 0.4 });
    const generator = new THREE.Mesh(generatorGeo, generatorMat);
    generator.position.set(1.5, 0.5, 0);
    generator.userData = { id: 'generator', name: 'Electromagnetic Generator', description: 'Converts mechanical rotation into electrical power via induction.' };
    group.add(generator);

    // --- 5. Particles (Water Flow & Electricity) ---
    
    // Water in Penstock
    const waterCount = 100;
    const waterPartGeo = new THREE.BufferGeometry();
    const waterPartPos = new Float32Array(waterCount * 3);
    const wProgress = new Float32Array(waterCount);
    for(let i=0; i<waterCount; i++){
        wProgress[i] = Math.random();
        const pt = penstockPath.getPoint(wProgress[i]);
        waterPartPos[i*3] = pt.x + (Math.random()-0.5)*0.3;
        waterPartPos[i*3+1] = pt.y + (Math.random()-0.5)*0.3;
        waterPartPos[i*3+2] = pt.z + (Math.random()-0.5)*0.3;
    }
    waterPartGeo.setAttribute('position', new THREE.BufferAttribute(waterPartPos, 3));
    waterPartGeo.setAttribute('progress', new THREE.BufferAttribute(wProgress, 1));
    const waterPartMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const waterParticles = new THREE.Points(waterPartGeo, waterPartMat);
    group.add(waterParticles);

    // Electricity exiting generator
    const elecCount = 30;
    const elecGeo = new THREE.BufferGeometry();
    const elecPos = new Float32Array(elecCount * 3);
    for(let i=0; i<elecCount; i++){
        elecPos[i*3] = 1.5 + Math.random() * 4; // Moving right on X
        elecPos[i*3+1] = 0.5; // Out of generator
        elecPos[i*3+2] = (Math.random()-0.5)*0.2;
    }
    elecGeo.setAttribute('position', new THREE.BufferAttribute(elecPos, 3));
    const elecMat = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.2, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
    const electrons = new THREE.Points(elecGeo, elecMat);
    group.add(electrons);
    
    // Transmission Line
    const wireLineGeo = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
    const wireLine = new THREE.Mesh(wireLineGeo, new THREE.MeshStandardMaterial({color: 0x222222}));
    wireLine.rotation.z = Math.PI/2;
    wireLine.position.set(3.5, 0.5, 0);
    group.add(wireLine);

    // --- 6. Animation ---
    let time = 0;
    group.userData.animate = function(delta) {
        time += delta;

        // Spin Turbine and Shaft
        const rotationSpeed = delta * 5;
        turbineGroup.rotation.z -= rotationSpeed;
        shaft.rotation.y -= rotationSpeed;

        // Animate water flowing through penstock
        const wPos = waterParticles.geometry.attributes.position.array;
        const wProg = waterParticles.geometry.attributes.progress.array;
        for(let i=0; i<waterCount; i++){
            wProg[i] += delta * 0.8; // Fast flow
            if (wProg[i] > 1) {
                wProg[i] = 0; // Reset to top
            }
            const pt = penstockPath.getPoint(wProg[i]);
            wPos[i*3] = pt.x + (Math.sin(time*10+i)*0.15); // Add turbulence
            wPos[i*3+1] = pt.y + (Math.cos(time*12+i)*0.15);
            wPos[i*3+2] = pt.z + (Math.sin(time*8+i)*0.15);
        }
        waterParticles.geometry.attributes.position.needsUpdate = true;
        waterParticles.geometry.attributes.progress.needsUpdate = true;

        // Animate electrons
        const ePos = electrons.geometry.attributes.position.array;
        for(let i=0; i<elecCount; i++){
            ePos[i*3] += delta * 6; // Move along X wire
            if(ePos[i*3] > 5.5) {
                ePos[i*3] = 1.5; // Reset at generator
            }
        }
        electrons.geometry.attributes.position.needsUpdate = true;
    };

    return group;
}

// Auto-generated missing stub
export function createHydroelectricDam() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
